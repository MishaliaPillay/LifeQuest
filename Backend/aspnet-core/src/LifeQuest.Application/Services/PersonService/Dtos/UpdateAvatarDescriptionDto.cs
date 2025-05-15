
using System;
using System.ComponentModel.DataAnnotations;

namespace LifeQuest.Services.PersonService.Dtos
{
    public class UpdateAvatarDescriptionDto
    {
        [Required]
        public Guid PersonId { get; set; }

        [Required]
        public string AvatarDescription { get; set; }
    }
}
