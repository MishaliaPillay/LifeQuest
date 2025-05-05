using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.Steps.Dtos
{
    public class CreateStepEntryDto
    {
        public Guid PersonId { get; set; }
        public int Steps { get; set; }
        public DateTime Date { get; set; }
        public string? Note { get; set; }
    }
}
