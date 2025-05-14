using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using LifeQuest.Domain.Health.Meal;
using LifeQuest.Services.Health.Meal.Dtos;
using LifeQuest.Domain.Health.Ingredient;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text.Json;
using System.Formats.Asn1;
using System.Xml.Linq;
using LifeQuest.Services.Health.Ingredient.Dtos;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Services.Health.Meal
{
    public class MealAppService : ApplicationService, IMealAppService
    {
        private readonly MealManager _mealManager;
        private readonly IngredientManager _ingredientManager;
        private readonly IRepository<Domain.Health.Ingredient.Ingredient, Guid> _ingredientRepository;
        private readonly IRepository<Domain.Health.Meal.Meal, Guid> _mealRepository;

        public MealAppService(IRepository<Domain.Health.Meal.Meal, Guid> mealRepository,
            MealManager mealManager,
            IRepository<Domain.Health.Ingredient.Ingredient, Guid> ingredientRepository,
            IngredientManager ingredientManager)
        {
            _mealManager = mealManager;
            _ingredientRepository = ingredientRepository;
            _mealRepository = mealRepository;
            _ingredientManager = ingredientManager;
        }


        public async Task<MealDto> CreateMealAsync(CreateMealDto input)
        {
            var meal = new Domain.Health.Meal.Meal
            {
                Name = input.Name,
                Description = input.Description,
                Calories = input.Calories,
                MealIngredients = input.IngredientIds.Select(id => new Domain.Health.MealIngredient { IngredientId = id }).ToList(),
                Score = 0
            };

            var created = await _mealManager.CreateMealAsync(meal);

            // 👇 Add this to ensure the DB has committed the entity
            await CurrentUnitOfWork.SaveChangesAsync();

            var loaded = await _mealRepository
                .GetAll()
                .Include(m => m.MealIngredients)
                .ThenInclude(mi => mi.Ingredient)
                .FirstOrDefaultAsync(m => m.Id == created.Id);

            if (loaded == null)
            {
                throw new UserFriendlyException($"Meal with ID {created.Id} not found after creation.");
            }

            return new MealDto
            {
                Id = loaded.Id,
                Name = loaded.Name,
                Description = loaded.Description,
                Calories = loaded.Calories,
                Ingredients = loaded.MealIngredients.Select(mi => new IngredientDto
                {
                    Id = mi.IngredientId,
                    Name = mi.Ingredient?.Name ?? "Unknown",
                    ServingSize = mi.Ingredient?.ServingSize ?? 0,
                    Calories = mi.Ingredient?.Calories ?? 0,
                    Protein = mi.Ingredient?.Protein ?? 0,
                    Carbohydrates = mi.Ingredient?.Carbohydrates ?? 0,
                    Fats = mi.Ingredient?.Fats ?? 0
                }).ToList(),
                Score = loaded.Score,
            };
        }



        public async Task<List<MealDto>> GetAllMealsAsync()
        {
            var meals = await _mealManager.GetAllMealsAsync();

            return meals.Select(m => new MealDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Calories = m.Calories,
                IngredientIds = m.MealIngredients.Select(mi => mi.IngredientId).ToList(),
                Score = m.Score,
            }).ToList();
        }
        public async Task<List<MealDto>> GetByMealPlanIdAsync(Guid mealPlanId)
        {
            var meals = await _mealManager.GetByMealPlanIdAsync(mealPlanId);

            return meals
                .Select(m => new MealDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    Calories = m.Calories,
                    IngredientIds = m.MealIngredients.Select(mi => mi.IngredientId).ToList(),
                    Score = m.Score,


                }).ToList();
        }
        public async Task<MealDto> UpdateMealAsync(UpdateMealDto input)
        {
            var meal = await _mealManager.GetAllMealsAsync()
                .ContinueWith(t => t.Result.FirstOrDefault(m => m.Id == input.Id));

            if (meal == null)
                throw new UserFriendlyException("Meal not found.");

            meal.Name = input.Name;
            meal.Description = input.Description;
            meal.Calories = input.Calories;
            meal.Score = input.Score;

            meal.MealIngredients = input.IngredientIds.Select(id => new Domain.Health.MealIngredient { IngredientId = id, MealId = meal.Id }).ToList();

            var updated = await _mealManager.UpdateMealAsync(meal);

            return new MealDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description,
                Calories = updated.Calories,
                IngredientIds = updated.MealIngredients.Select(mi => mi.IngredientId).ToList(),
                Score = updated.Score,
            };
        }

        private string ExtractJsonFromMarkdown(string markdown)
        {
            if (string.IsNullOrWhiteSpace(markdown)) return "{}";

            // Check for code block syntax
            var start = markdown.IndexOf("```");
            if (start >= 0)
            {
                var end = markdown.LastIndexOf("```");
                if (end > start)
                {
                    // Remove the language specifier if present
                    var content = markdown.Substring(start + 3, end - start - 3).Trim();
                    var firstLineEnd = content.IndexOf('\n');
                    if (firstLineEnd > 0 && firstLineEnd < 20) // Short first line could be a language specifier
                    {
                        var firstLine = content.Substring(0, firstLineEnd).Trim();
                        if (firstLine == "json")
                        {
                            content = content.Substring(firstLineEnd).Trim();
                        }
                    }
                    return content;
                }
            }

            return markdown.Trim(); // fallback
        }

        public async Task DeleteMealAsync(Guid id)
        {
            await _mealManager.DeleteMealAsync(id);
        }

        public async Task<MealDto> GenerateAIMealAsync(GenerateAIMealInputDto input)
        {
            try
            {
                var httpClient = new HttpClient();
                var apiKey = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY_new");

                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    throw new Exception("OpenRouter API key is not configured. Please set OPENROUTER_API_KEY.");
                }

                var dietaryNote = !string.IsNullOrWhiteSpace(input.DietaryRequirement)
                    ? $"Make sure the meal satisfies the following dietary requirement: {input.DietaryRequirement}."
                    : "";

                var prompt = $@"
Generate a healthy {input.MealType} meal in JSON format. Include atleast 2 ingredients.
Include no more than 3 ingredients.
{(input.MaxCalories > 0 ? $"Max {input.MaxCalories} calories." : "")}
{(!string.IsNullOrWhiteSpace(input.DietaryRequirement) ? $"Meet dietary requirement: {input.DietaryRequirement}." : "")}
{(!string.IsNullOrWhiteSpace(input.PreferredCuisine) ? $"Use {input.PreferredCuisine} style." : "")}
Respond only with JSON inside a code block.
Format:
{{
  ""name"": ""Grilled Chicken Salad"",
  ""description"": ""A healthy mix of grilled chicken and fresh vegetables."",
  ""calories"": 450,
  ""ingredients"": [
    {{
      ""name"": ""Grilled Chicken Breast"",
      ""servingSize"": 150,
      ""calories"": 250,
      ""protein"": 30,
      ""carbohydrates"": 0,
      ""fats"": 10
    }},
    {{
      ""name"": ""Lettuce"",
      ""servingSize"": 50,
      ""calories"": 15,
      ""protein"": 1,
      ""carbohydrates"": 2,
      ""fats"": 0
    }}
  ]
}}";

                var requestBody = new
                {
                    model = "deepseek/deepseek-prover-v2:free",
                    messages = new[] { new { role = "user", content = prompt } }
                };

                var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions")
                {
                    Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
                };
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                var response = await httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();
                var jsonResponse = await response.Content.ReadAsStringAsync();

                var messageContent = JsonDocument.Parse(jsonResponse)
                    .RootElement.GetProperty("choices")[0]
                    .GetProperty("message").GetProperty("content").GetString();

                var cleanedJson = ExtractJsonFromMarkdown(messageContent);

                Logger.Debug("Raw AI message content: " + messageContent);
                Logger.Debug("Extracted JSON: " + cleanedJson);

                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    WriteIndented = true
                };

                var mealWithIngredients = JsonSerializer.Deserialize<CreateMealWithIngredientsDto>(cleanedJson, jsonOptions)
                    ?? throw new Exception("Failed to deserialize meal data - result was null");

                if (mealWithIngredients.Ingredients == null || mealWithIngredients.Ingredients.Count == 0)
                    throw new Exception("No ingredients found in the AI response");

                var ingredientIds = new List<Guid>();

                foreach (var ingredientDto in mealWithIngredients.Ingredients)
                {
                    var ingredient = await _ingredientManager.CreateIngredientAsync(
                        ingredientDto.Name,
                        ingredientDto.ServingSize,
                        ingredientDto.Calories,
                        ingredientDto.Protein,
                        ingredientDto.Carbohydrates,
                        ingredientDto.Fats
                    );

                    ingredientIds.Add(ingredient.Id);
                }

                var newMeal = new Domain.Health.Meal.Meal
                {
                    Name = mealWithIngredients.Name,
                    Description = mealWithIngredients.Description,
                    Calories = mealWithIngredients.Calories,
                    MealIngredients = ingredientIds.Select(id => new Domain.Health.MealIngredient { IngredientId = id }).ToList(),
                    Score = 0
                };

                var createdMeal = await _mealManager.CreateMealAsync(newMeal);

                return new MealDto
                {
                    Id = createdMeal.Id,
                    Name = createdMeal.Name,
                    Description = createdMeal.Description,
                    Calories = createdMeal.Calories,
                    IngredientIds = createdMeal.MealIngredients.Select(mi => mi.IngredientId).ToList(),
                    Score = createdMeal.Score
                };
            }
            catch (JsonException jsonEx)
            {
                Logger.Error($"JSON parsing error: {jsonEx.Message}", jsonEx);
                throw new UserFriendlyException("Failed to parse AI response.");
            }
            catch (HttpRequestException httpEx)
            {
                Logger.Error($"HTTP error: {httpEx.Message}", httpEx);
                throw new UserFriendlyException("Could not connect to meal AI service.");
            }
            catch (Exception ex)
            {
                Logger.Error($"AI meal generation failed: {ex.Message}", ex);
                throw new UserFriendlyException("Could not generate AI meal: " + ex.Message);
            }
        }
        public async Task<GeneratedMealBatchResultDto> GenerateAIMealBatchAsync(GenerateAIMealBatchInputDto input)
        {
            if (input.Count <= 0)
            {
                throw new UserFriendlyException("Meal count must be greater than 0.");
            }

            var meals = new List<MealDto>();
            var seenNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            int attempts = 0;
            int maxAttempts = input.Count * 3; // To avoid infinite loop if AI keeps duplicating

            while (meals.Count < input.Count && attempts < maxAttempts)
            {
                attempts++;

                try
                {
                    var meal = await GenerateAIMealAsync(input.BaseRequest);

                    if (!seenNames.Contains(meal.Name.Trim()))
                    {
                        meals.Add(meal);
                        seenNames.Add(meal.Name.Trim());
                    }
                    else
                    {
                        Logger.Debug($"Duplicate meal skipped: {meal.Name}");
                    }
                }
                catch (Exception ex)
                {
                    Logger.Warn($"Meal generation failed (attempt {attempts}): {ex.Message}");
                }
            }

            if (meals.Count < input.Count)
            {
                Logger.Warn($"Only {meals.Count} unique meals generated out of requested {input.Count}.");
            }

            return new GeneratedMealBatchResultDto
            {
                Items = meals
            };
        }


    }
}