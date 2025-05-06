using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.Path.Dtos
{
    public class PathTypeDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string PathType { get; set; } // <- This is the discriminator
    }
}
