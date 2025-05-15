using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.PersonService.Dtos
{
    public class GenerateAvatarDto
    {
        public Guid PersonId { get; set; }
        public string Prompt { get; set; } = "Chibi labrador dog";
    }
}
