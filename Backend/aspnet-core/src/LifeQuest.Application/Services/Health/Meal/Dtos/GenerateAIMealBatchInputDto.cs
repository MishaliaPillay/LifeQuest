namespace LifeQuest.Services.Health.Meal.Dtos
{
    public class GenerateAIMealBatchInputDto
    {
        public int Count { get; set; } = 5;
        public GenerateAIMealInputDto BaseRequest { get; set; }
    }

}
