using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.Weight.Dtos
{
    public class CreateWeightEntryDto
    {
        public Guid PersonId { get; set; }
        public float Weight { get; set; }
        public DateTime Date { get; set; }
        public string? Note { get; set; }
    }
}
