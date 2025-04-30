using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using LifeQuest.Domain.Person;
using Microsoft.DotNet.Scaffolding.Shared;

namespace LifeQuest.Services.PersonService.Dtos
{
    [AutoMap(typeof(Person))]
    public class PersonResponseDto : EntityDto<Guid>
    {
        public UserResponseDto User { get; set; }

        public int Xp { get; set; }

        public int Level { get; set; }

        public string? Avatar { get; set; }

        // Adjust the type `Plan` to your actual plan entity
        //  public virtual ICollection<Plan> Plan { get; set; } = new List<Plan>();
    }
}
