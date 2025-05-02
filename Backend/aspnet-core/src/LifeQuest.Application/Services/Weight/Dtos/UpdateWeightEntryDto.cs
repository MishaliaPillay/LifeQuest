using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace LifeQuest.Services.Weight.Dtos
{
    public class UpdateWeightEntryDto : EntityDto<Guid>
    {
        public float Weight { get; set; }
        public DateTime Date { get; set; }
        public string? Note { get; set; }
    }
}
