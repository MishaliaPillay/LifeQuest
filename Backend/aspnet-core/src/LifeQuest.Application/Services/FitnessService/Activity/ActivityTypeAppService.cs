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
                input.Calories,
                input.Duration,
                input.Description
            );

            return new ActivityTypeResponseDto
            {
                Id = created.Id,
                Category = created.Category,
                Calories = created.Calories,
                Description = created.Description,
                Duration = created.Duration
            };
        }

        public async Task<List<ActivityTypeResponseDto>> GetAllActivityTypesAsync()
        {
            var items = await _activityTypeManager.GetAllAsync();

            return items.Select(a => new ActivityTypeResponseDto
            {
                Id = a.Id,
                Category = a.Category,
                Calories = a.Calories,
                Description = a.Description,
                Duration = a.Duration
            }).ToList();
        }

        public async Task<ActivityTypeResponseDto> UpdateActivityTypeAsync(UpdateActivityTypeDto input)
        {
            var updated = await _activityTypeManager.UpdateActivityTypeAsync(
                input.Id,
                input.Category,
                input.Calories,
                input.Description,
                input.Duration

            );

            return new ActivityTypeResponseDto
            {
                Id = updated.Id,
                Category = updated.Category,
                Calories = updated.Calories,
                Description = updated.Description,
                Duration = updated.Duration
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
                var apiKey = "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";
                //Environment.GetEnvironmentVariable("OPENROUTER_API_KEY");

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
                        activityType.Calories,
                        activityType.Description,
                        activityType.Duration
                    );

                    return new ActivityTypeResponseDto
                    {
                        Id = created.Id,
                        Category = created.Category,
                        Calories = created.Calories,
                        Description = created.Description,
                        Duration =created.Duration
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
            var sb = new StringBuilder("Generate one personalized exercise for a fitness app. Avoid repeating previous exercises. Use the following user profile:\n");

            if (input.Age > 0)
                sb.Append($"- Age: {input.Age}\n");

            if (!string.IsNullOrWhiteSpace(input.BodyType))
                sb.Append($"- Body Type: {input.BodyType}\n");

            if (!string.IsNullOrWhiteSpace(input.Gender))
                sb.Append($"- Gender: {input.Gender}\n");

            if (!string.IsNullOrWhiteSpace(input.FitnessLevel))
                sb.Append($"- Fitness Level: {input.FitnessLevel}\n");

            if (input.CurrentWeight > 0)
                sb.Append($"- Current Weight (kg): {input.CurrentWeight}\n");

            if (!string.IsNullOrWhiteSpace(input.Limitations))
                sb.Append($"- Limitations: {input.Limitations}\n");

            if (!string.IsNullOrWhiteSpace(input.PreferredExerciseTypes))
                sb.Append($"- Preferred Exercise Types: {input.PreferredExerciseTypes}\n");

            if (input.AvailableEquipment?.Any() == true)
                sb.Append($"- Available Equipment: {string.Join(", ", input.AvailableEquipment)}\n");
            else
                sb.Append($"- Available Equipment: none\n");

            sb.Append("\nPlease return a **raw JSON object** with the following structure:\n");
            sb.Append("{\n");
            sb.Append("  \"category\": \"string\",                // e.g., 'Cardio', 'Strength', 'Flexibility'\n");
            sb.Append("  \"description\": \"string\",             // Short description of the exercise\n");
            sb.Append("  \"duration\": \"string\",                // Duration (e.g., '15 minutes', '3 sets of 10 reps')\n");
            sb.Append("  \"calories\": number                    // Estimated calories burned by this user for this activity\n");
            sb.Append("}\n");

            sb.Append("Estimate calorie burn based on user's weight, age, gender, and fitness level. ");
            sb.Append("Do not include markdown, code blocks, or extra text — only valid JSON starting with '{' and ending with '}'.");

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
