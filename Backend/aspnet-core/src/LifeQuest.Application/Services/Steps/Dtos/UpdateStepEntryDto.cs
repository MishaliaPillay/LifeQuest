using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace LifeQuest.Services.Steps.Dtos
{
    public class UpdateStepEntryDto : EntityDto<Guid>
    {
        public int Steps { get; set; }
        public DateTime Date { get; set; }
        public string? Note { get; set; }
    }
}
