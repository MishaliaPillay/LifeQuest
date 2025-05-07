namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public partial class ActivityResponseDto
    {
        public class ExerciseGenerationBatchRequestDto
        {
            public int Count { get; set; } = 10; // default 10
            public ExerciseGenerationRequestDto BaseRequest { get; set; }
        }
    }

}
