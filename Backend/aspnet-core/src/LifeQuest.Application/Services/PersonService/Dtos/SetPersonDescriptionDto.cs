using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.ComponentModel.DataAnnotations;

namespace LifeQuest.Services.PersonService.Dtos
{
    public class SetPersonDescriptionDto
    {
        [Required]
        public Guid PersonId { get; set; }

        [Required]
        public string PersonDescription { get; set; }
    }
}
