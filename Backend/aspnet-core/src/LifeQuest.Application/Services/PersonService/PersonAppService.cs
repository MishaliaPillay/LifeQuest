using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper;
using LifeQuest.Domain.Level;
using LifeQuest.Domain.Person;
using LifeQuest.Services.PersonService.Dtos;
using LifeQuest.Services.PersonService.Dtos.LifeQuest.Services.PersonService.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeQuest.Services.PersonService
{
    public class PersonAppService :
        AsyncCrudAppService<Person, PersonResponseDto, Guid, PagedAndSortedResultRequestDto, PersonRequestDto, PersonResponseDto>,
        IPersonAppService
    {
        private readonly PersonManager _personManager;
        private readonly IRepository<Person, Guid> _repository;
        private readonly IRepository<LevelDefinition> _levelDefinitionRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<PersonAppService> _logger; // Add this line

        public PersonAppService(
            IRepository<Person, Guid> repository,
            PersonManager personManager,
            IRepository<LevelDefinition> levelDefinitionRepository,
            IMapper mapper,
            ILogger<PersonAppService> logger // Add this parameter
        ) : base(repository)
        {
            _repository = repository;
            _personManager = personManager;
            _levelDefinitionRepository = levelDefinitionRepository;
            _mapper = mapper;
            _logger = logger; // Assign it here
        }

        // Method to Add XP to the Person
        public async Task<PersonResponseDto> AddXpToPersonAsync(Guid personId, int xpAmount)
        {
            // Retrieve the person
            var person = await _repository.GetAsync(personId);
            if (person == null)
                throw new UserFriendlyException("Person not found");

            // Get level definitions (e.g., XP thresholds for each level)
            var levelDefinitions = await _levelDefinitionRepository.GetAllListAsync();

            // Add XP and handle level-up logic
            person.AddXp(xpAmount, levelDefinitions);

            // Update the person's record
            await _repository.UpdateAsync(person);

            return _mapper.Map<PersonResponseDto>(person);
        }


        public override async Task<PersonResponseDto> CreateAsync(PersonRequestDto input)
        {
            var person = await _personManager.CreatePersonAsync(
                input.User.UserName,
                input.User.EmailAddress,
                input.User.Name,
                input.User.Surname,
                input.User.Password,
                input.Avatar
            );

            return _mapper.Map<PersonResponseDto>(person);
        }

        public override async Task<PersonResponseDto> GetAsync(EntityDto<Guid> input)
        {
            var person = await _repository.GetAsync(input.Id);
            if (person == null)
                throw new UserFriendlyException("Person not found");

            // Use AutoMapper to map Person to PersonResponseDto with PathId
            return _mapper.Map<PersonResponseDto>(person);
        }

        public override async Task<PagedResultDto<PersonResponseDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = _personManager.GetAllWithUser();
            var totalCount = await query.CountAsync();

            var persons = await query
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            // Use AutoMapper to map each Person to PersonResponseDto with PathId
            return new PagedResultDto<PersonResponseDto>(
                totalCount,
                _mapper.Map<List<PersonResponseDto>>(persons)
            );
        }

        public async Task<PersonResponseDto> GetCurrentPersonAsync(long userId)
        {
            var person = await _personManager.GetPersonByUserIdAsync(userId);
            // Use AutoMapper to map Person to PersonResponseDto with PathId
            return _mapper.Map<PersonResponseDto>(person);
        }

        public async Task<PersonResponseDto> updatePersonAsync(UpdatePersonDto input)
        {
            var person = await _repository.GetAsync(input.Id);
            if (person == null)
                throw new UserFriendlyException("Person not found");

            var updated = await _personManager.UpdatePersonAsync(
                input.Id,
                input.Avatar,
                input.Xp,
                input.Level
            );

            // Use AutoMapper to map Person to PersonResponseDto with PathId
            return _mapper.Map<PersonResponseDto>(updated);
        }

        public async Task<PersonResponseDto> GenerateAndSaveAvatarAsync(Guid personId, string userPrompt)
        {
            var person = await _repository.GetAsync(personId);
            if (person == null)
                throw new UserFriendlyException("Person not found");

            var httpClient = new HttpClient();

            // Default style and safety prompt
            var defaultPrompt = "3D chibi style character, safe for work, high quality, colorful, big expressive eyes, small cute body, white background";

            // Final prompt used in API call
            var fullPrompt = string.IsNullOrWhiteSpace(userPrompt)
                ? defaultPrompt
                : $"{defaultPrompt}, {userPrompt}";

            // Match structure exactly to their API example
            var requestBody = new
            {
                key = "NkF3yJlvyfwJ6wUM359xLBE6O4VF0t33Bn4i0KTnGclxb0hSejb6ktSIQb1F",
                prompt = fullPrompt,
                negative_prompt = "(worst quality:2), (low quality:2), (normal quality:2), (jpeg artifacts), (blurry), (duplicate), (morbid), (mutilated), (out of frame), (extra limbs), (bad anatomy), (disfigured), (deformed), (cross-eye), (glitch), (oversaturated), (overexposed), (underexposed), (bad proportions), (bad hands), (bad feet), (cloned face), (long neck), (missing arms), (missing legs), (extra fingers), (fused fingers), (poorly drawn hands), (poorly drawn face), (mutation), (deformed eyes), watermark, text, logo, signature, grainy, tiling, censored, nsfw, ugly, blurry eyes, noisy image, bad lighting, unnatural skin, asymmetry",
                samples = "1",
                height = "1024",
                width = "1024",
                safety_checker = false,
                seed = (string?)null,
                base64 = false,
                webhook = (string?)null,
                track_id = (string?)null
            };

            var jsonRequest = JsonSerializer.Serialize(requestBody);
            var httpContent = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            try
            {
                var response = await httpClient.PostAsync("https://modelslab.com/api/v6/realtime/text2img", httpContent);

                // Log the status code for debugging
                var statusCode = response.StatusCode;
                if (!response.IsSuccessStatusCode)
                {
                    throw new UserFriendlyException($"API request failed with status code: {statusCode}");
                }

                var responseString = await response.Content.ReadAsStringAsync();

                // Log the raw response for debugging
                _logger.LogInformation($"Raw API Response: {responseString}");

                // First check if we got a valid JSON response
                if (string.IsNullOrWhiteSpace(responseString))
                {
                    throw new UserFriendlyException("Empty response received from API.");
                }

                // Parse the response as JSON and handle potential format issues
                using var outerJson = JsonDocument.Parse(responseString);
                var root = outerJson.RootElement;

                // Check and extract the image URL using more robust approach
                string? imageUrl = null;

                // Option 1: Try the expected format
                if (root.TryGetProperty("result", out var resultElement))
                {
                    var resultString = resultElement.GetString();
                    if (!string.IsNullOrEmpty(resultString))
                    {
                        try
                        {
                            var innerResult = JsonDocument.Parse(resultString);
                            if (innerResult.RootElement.TryGetProperty("output", out var outputElement) && outputElement.GetArrayLength() > 0)
                            {
                                imageUrl = outputElement[0].GetString();
                            }
                        }
                        catch (JsonException ex)
                        {
                            _logger.LogError(ex, "Failed to parse inner JSON result");
                        }
                    }
                }

                // Option 2: Look for direct output property
                if (string.IsNullOrEmpty(imageUrl) && root.TryGetProperty("output", out var directOutputElement))
                {
                    if (directOutputElement.ValueKind == JsonValueKind.Array && directOutputElement.GetArrayLength() > 0)
                    {
                        imageUrl = directOutputElement[0].GetString();
                    }
                }

                // Option 3: Look for images property that some APIs use
                if (string.IsNullOrEmpty(imageUrl) && root.TryGetProperty("images", out var imagesElement))
                {
                    if (imagesElement.ValueKind == JsonValueKind.Array && imagesElement.GetArrayLength() > 0)
                    {
                        imageUrl = imagesElement[0].GetString();
                    }
                }

                // If we still don't have an image URL, throw a detailed exception
                if (string.IsNullOrEmpty(imageUrl))
                {
                    throw new UserFriendlyException("Failed to extract image URL from API response. Response format may have changed.");
                }

                // Persist new avatar URL
                person.Avatar = imageUrl;
                await _repository.UpdateAsync(person);
                return _mapper.Map<PersonResponseDto>(person);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request failed while generating avatar");
                throw new UserFriendlyException($"Failed to connect to avatar generation service: {ex.Message}");
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "JSON parsing error while processing API response");
                throw new UserFriendlyException($"Failed to process API response: {ex.Message}");
            }
            catch (Exception ex) when (!(ex is UserFriendlyException))
            {
                _logger.LogError(ex, "Unexpected error while generating avatar");
                throw new UserFriendlyException("An unexpected error occurred while generating the avatar.");
            }
        }

        public async Task<PersonResponseDto> SelectPath([FromBody] SelectPathDto input)
        {
            var hasPath = await _personManager.DoesPersonHavePathAsync(input.PersonId);

            if (hasPath)
            {
                throw new UserFriendlyException("Person already has a path assigned.");
            }

            var updatedPerson = await _personManager.SelectPathAsync(input.PersonId, input.PathId);

            // Use AutoMapper to map Person to PersonResponseDto with PathId
            return _mapper.Map<PersonResponseDto>(updatedPerson);
        }
    }
}