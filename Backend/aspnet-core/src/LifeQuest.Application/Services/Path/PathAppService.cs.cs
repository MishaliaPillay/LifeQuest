using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Application.Services;
using AutoMapper;
using LifeQuest.Domain.Paths;
using LifeQuest.Services.Path.Dtos;

namespace LifeQuest.Services.Path
{
    public class PathAppService : IPathAppService
    {
        private readonly PathManager _pathManager;
        private readonly IMapper _mapper;

        public PathAppService(PathManager pathManager, IMapper mapper)
        {
            _pathManager = pathManager;
            _mapper = mapper;
        }

        public async Task<PathTypeDto> GetAsync(Guid id)
        {
            var path = await _pathManager.GetPathAsync(id);
            return _mapper.Map<PathTypeDto>(path);
        }

        public async Task<ListResultDto<PathTypeDto>> GetAllAsync()
        {
            var paths = await _pathManager.GetAllPathsAsync();
            return new ListResultDto<PathTypeDto>(
                _mapper.Map<List<PathTypeDto>>(paths)
            );
        }
    }
}
