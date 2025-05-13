using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public class ExerciseGenerationRequestDto
    {
        [Required]
        [Range(5, 120, ErrorMessage = "Age must be between 5 and 120 years")]
        public int Age { get; set; }
        [Required]
        public string Gender { get; set; }
        public string BodyType { get; set; }
        [Required]
        public string FitnessLevel { get; set; }
        public int CurrentWeight { get; set; }
        public string Limitations { get; set; }
        public string PreferredExerciseTypes { get; set; }
        public string[] AvailableEquipment { get; set; }
    }
}
