using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Domain.Paths
{
    public class PathManager : DomainService
    {
        private readonly IRepository<Path, Guid> _pathRepository;

        public PathManager(IRepository<Path, Guid> pathRepository)
        {
            _pathRepository = pathRepository;
        }

        public async Task<Path> GetPathAsync(Guid id)
        {
            // Validate input
            if (id == Guid.Empty)
            {
                throw new ArgumentException("Path ID cannot be empty", nameof(id));
            }

            try
            {
                var path = await _pathRepository
                    .GetAll()
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (path == null)
                {
                    throw new UserFriendlyException($"Path with ID {id} not found");
                }

                return path;
            }
            catch (Exception ex) when (!(ex is UserFriendlyException))
            {
                // Log the exception here if you have a logging mechanism
                throw new UserFriendlyException("An error occurred while retrieving the path", ex);
            }
        }

        public async Task<List<Path>> GetAllPathsAsync()
        {
            try
            {
                return await _pathRepository.GetAllListAsync();
            }
            catch (Exception ex)
            {
                // Log the exception here if you have a logging mechanism
                throw new UserFriendlyException("An error occurred while retrieving paths", ex);
            }
        }

        public async Task<bool> PathExistsAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                return false;
            }

            try
            {
                return await _pathRepository
                    .GetAll()
                    .AnyAsync(p => p.Id == id);
            }
            catch
            {
                return false;
            }
        }
    }
}