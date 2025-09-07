using AutoMapper;
using Repositories.Core.Dtos.Role;
using Repositories.Core.Entities;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class RoleService : IRoleService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RoleService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ResponseModel> CreateRoleAsync(RoleCreateDto dto, bool saveAll)
    {
        var role = _mapper.Map<Role>(dto);
        await _unitOfWork.RoleRepository.CreateAsync(role);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully create sell config", role);
    }

    public async Task<ResponseModel> DeleteRoleAsync(string id, bool saveAll)
    {
        var role = await _unitOfWork.RoleRepository.GetByIdAsync(id);
        _unitOfWork.RoleRepository.Delete(role);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully delete sell config", role);
    }

    public async Task<ResponseModel> GetAllRoleAsync()
    {
        var roleList = await _unitOfWork.RoleRepository.GetAllAsync();
        var convertedRoles = _mapper.Map<IEnumerable<RoleReadDto>>(roleList);
        return ResponseModel.Success("Successfully read sell config", convertedRoles);
    }

    public async Task<ResponseModel> GetRoleByIdAsync(string id)
    {
        var role = await _unitOfWork.RoleRepository.GetByIdAsync(id);
        return ResponseModel.Success("Successfully get sell config", role);
    }

    public async Task<ResponseModel> UpdateRoleAsync(string id, RoleUpdateDto dto, bool saveAll)
    {
        var role = await _unitOfWork.RoleRepository.GetByIdAsync(id);
        _mapper.Map(dto, role);
        _unitOfWork.RoleRepository.Update(role);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Success update sell config", role);
    }
}