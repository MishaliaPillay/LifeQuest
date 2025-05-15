using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace LifeQuest.Services.PersonService.Dtos
{
    public class PersonDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public string UserName { get; set; } // Flattened from AppUser
        public int Xp { get; set; }
        public int Level { get; set; }
        public string Avatar { get; set; }
    }


}
