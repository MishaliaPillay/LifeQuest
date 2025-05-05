using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace LifeQuest.Services.Steps.Dtos
{
    public class StepEntryDto : EntityDto<Guid>
    {
        public Guid PersonId { get; set; }
        public int Steps { get; set; }
        public DateTime Date { get; set; }
        public string? Note { get; set; }
        public int CaloriesBurned { get; set; }
    }
}
