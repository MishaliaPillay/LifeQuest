using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.PersonService.Dtos
{
    public class UpdatePersonDto : UserRequestDto

    {

        public Guid Id { get; set; }
        public int? Xp { get; set; }
        public int? Level { get; set; }
        public string? Avatar { get; set; }

    }
}
