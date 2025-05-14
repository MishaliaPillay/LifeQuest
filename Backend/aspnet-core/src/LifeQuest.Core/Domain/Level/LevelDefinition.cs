using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;

namespace LifeQuest.Domain.Level
{
    public class LevelDefinition : Entity<int>
    {
        public int Level { get; set; }
        public int RequiredXp
        {
            get; set;
        }
    }
}