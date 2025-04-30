using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.PersonService.Dtos
{
    public class CreateUpdatePersonDto
    {

        [Required]
        public long UserId { get; set; }

        public int Xp { get; set; } = 0;
        public int Level { get; set; } = 1;
        public string Avatar { get; set; }

    }
}
