using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.FitnessService.FitnessPath.Dtos
{
    public class CreateFitnessPathDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public Guid PersonId { get; set; }
    }
}
