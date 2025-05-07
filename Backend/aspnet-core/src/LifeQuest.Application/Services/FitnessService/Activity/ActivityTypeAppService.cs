using Abp.Application.Services;
using Abp.UI;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Services.FitnessService.Activity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static LifeQuest.Services.FitnessService.Activity.Dtos.ActivityResponseDto;

namespace LifeQuest.Services.FitnessService.Activity
{
    public class ActivityTypeAppService : ApplicationService, IActivityTypeAppService
    {
        private readonly ActivityTypeManager _activityTypeManager;

        public ActivityTypeAppService(ActivityTypeManager activityTypeManager)
        {
            _activityTypeManager = activityTypeManager;
        }

        public async Task<ActivityTypeResponseDto> CreateActivityTypeAsync(CreateActivityTypeDto input)
        {
            var created = await _activityTypeManager.CreateActivityTypeAsync(
                input.Category,
                input.IntensityLevel,
                input.Description
            );

            return new ActivityTypeResponseDto
            {
                Id = created.Id,
                Category = created.Category,
                IntensityLevel = created.IntensityLevel,
                Description = created.Description
            };
        }

        public async Task<List<ActivityTypeResponseDto>> GetAllActivityTypesAsync()
        {
            var items = await _activityTypeManager.GetAllAsync();

            return items.Select(a => new ActivityTypeResponseDto
            {
                Id = a.Id,
                Category = a.Category,
                IntensityLevel = a.IntensityLevel,
                Description = a.Description
            }).ToList();
        }

        public async Task<ActivityTypeResponseDto> UpdateActivityTypeAsync(UpdateActivityTypeDto input)
        {
            var updated = await _activityTypeManager.UpdateActivityTypeAsync(
                input.Id,
                input.Category,
                input.IntensityLevel,
                input.Description
            );

            return new ActivityTypeResponseDto
            {
                Id = updated.Id,
                Category = updated.Category,
                IntensityLevel = updated.IntensityLevel,
                Description = updated.Description
            };
        }

        public async Task DeleteActivityTypeAsync(Guid id)
        {
            await _activityTypeManager.DeleteActivityTypeAsync(id);
        }

        public async Task<ActivityTypeResponseDto> GenerateExerciseActivityTypeAsync(ExerciseGenerationRequestDto input)
        {
            try
            {
                var httpClient = new HttpClient();
                var prompt = BuildPromptFromDto(input);
                var apiKey = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY");

                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    throw new Exception("OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in environment variables.");
                }


                var requestBody = new
                {
                    model = "deepseek/deepseek-prover-v2:free",
                    messages = new[] { new { role = "user", content = prompt } }
                };

                var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions")
                {
                    Content = new StringContent(
                        System.Text.Json.JsonSerializer.Serialize(requestBody),
                        System.Text.Encoding.UTF8,
                        "application/json")
                };
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

                var response = await httpClient.SendAsync(request);

                response.EnsureSuccessStatusCode();

                var jsonResponse = await response.Content.ReadAsStringAsync();
                Logger.Debug($"API Response: {jsonResponse}");

                using (var jsonDoc = System.Text.Json.JsonDocument.Parse(jsonResponse))
                {
                    var messageContent = jsonDoc.RootElement
                        .GetProperty("choices")[0]
                        .GetProperty("message")
                        .GetProperty("content")
                        .GetString();

                    var cleanedJsonContent = ExtractJsonFromMarkdown(messageContent);
                    Logger.Debug($"Cleaned JSON content: {cleanedJsonContent}");

                    var options = new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    var activityType = System.Text.Json.JsonSerializer.Deserialize<CreateActivityTypeDto>(
                        cleanedJsonContent, options);

                    if (activityType == null)
                        throw new Exception("Failed to deserialize activity type data");

                    var created = await _activityTypeManager.CreateActivityTypeAsync(
                        activityType.Category,
                        activityType.IntensityLevel,
                        activityType.Description
                    );

                    return new ActivityTypeResponseDto
                    {
                        Id = created.Id,
                        Category = created.Category,
                        IntensityLevel = created.IntensityLevel,
                        Description = created.Description
                    };
                }
            }
            catch (System.Text.Json.JsonException jsonEx)
            {
                Logger.Error("JSON parsing error", jsonEx);
                throw new UserFriendlyException("Failed to parse API response. Please try again later.");
            }
            catch (HttpRequestException httpEx)
            {
                Logger.Error("HTTP request error", httpEx);
                throw new UserFriendlyException("Failed to communicate with exercise API. Please check your internet connection.");
            }
            catch (Exception ex)
            {
                Logger.Error("Failed to generate exercise", ex);
                throw new UserFriendlyException("Failed to generate exercise. Please try again later.");
            }
        }

        private string BuildPromptFromDto(ExerciseGenerationRequestDto input)
        {
            var sb = new StringBuilder("Suggest one exercise.Generate a unique exercise suggestion that is different from previous ones. Avoid repeating any previously mentioned exercise.\r\n");

            if (input.Age > 0)
                sb.Append($" for a {input.Age}-year-old");

            if (!string.IsNullOrWhiteSpace(input.BodyType))
                sb.Append($" {input.BodyType.ToLower()}");

            if (!string.IsNullOrWhiteSpace(input.Gender))
                sb.Append($" {input.Gender.ToLower()}");

            if (!string.IsNullOrWhiteSpace(input.FitnessLevel))
                sb.Append($", who is {input.FitnessLevel.ToLower()} fitness level");

            if (!string.IsNullOrWhiteSpace(input.Limitations))
                sb.Append($", with the following limitations: {input.Limitations}");

            if (!string.IsNullOrWhiteSpace(input.PreferredExerciseTypes))
                sb.Append($", preferring {input.PreferredExerciseTypes}");

            if (input.AvailableEquipment?.Any() == true)
                sb.Append($", with access to equipment: {string.Join(", ", input.AvailableEquipment)}");

            sb.Append(". ");
            sb.Append("Return only a raw JSON object with no markdown formatting, code blocks, or explanation. ");
            sb.Append("The JSON should follow this format: {\"category\": \"string\", \"intensityLevel\": number, \"description\": \"string\"}. ");
            sb.Append("Your response should start with { and end with } and nothing else.");

            return sb.ToString();
        }


        private string ExtractJsonFromMarkdown(string content)
        {
            // Handle case where content is wrapped in markdown code block
            if (content.Contains("```"))
            {
                // Find the opening brace
                int startIndex = content.IndexOf('{');
                if (startIndex >= 0)
                {
                    // Find the closing brace
                    int endIndex = content.LastIndexOf('}');
                    if (endIndex > startIndex)
                    {
                        // Extract just the JSON part
                        return content.Substring(startIndex, endIndex - startIndex + 1);
                    }
                }
            }

            // Return the original if no markdown formatting detected
            return content;
        }


        public async Task<GeneratedActivityTypeResultDto> GenerateExerciseActivityTypesAsync(ExerciseGenerationBatchRequestDto input)
        {
            var results = new List<ActivityTypeResponseDto>();

            for (int i = 0; i < input.Count; i++)
            {
                try
                {
                    var response = await GenerateExerciseActivityTypeAsync(input.BaseRequest);
                    results.Add(response);
                }
                catch (UserFriendlyException ex)
                {
                    Logger.Warn($"Skipped generation #{i + 1}: {ex.Message}");
                }
            }

            return new GeneratedActivityTypeResultDto
            {
                Items = results
            };
        }

    }

}
