using System;
using Abp.Application.Services.Dto;
using LifeQuest.Domain.Paths;
using LifeQuest.Domain.Paths.FitnessPath;

namespace LifeQuest.Services.PersonService.Dtos
{
    public class PersonResponseDto : EntityDto<Guid>
    {
        public UserResponseDto User { get; set; }

        public int Xp { get; set; }

        public int Level { get; set; }

        public string? Avatar { get; set; }

        // Include the SelectedPath details
        public PathResponseDto SelectedPath { get; set; }
    }

    // DTO to represent the selected path (you can extend this with more properties if needed)
    public class PathResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string PathType { get; set; }  // Can be "FitnessPath", "HealthPath", etc.
    }
}
