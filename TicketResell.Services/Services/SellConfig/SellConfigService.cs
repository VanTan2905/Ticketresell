using AutoMapper;
using Repositories.Core.Dtos.SellConfig;
using Repositories.Core.Entities;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class SellConfigService : ISellConfigService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SellConfigService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ResponseModel> CreateSellConfigAsync(SellConfigCreateDto dto, bool saveAll)
    {
        var sellConfig = _mapper.Map<SellConfig>(dto);
        await _unitOfWork.SellConfigRepository.CreateAsync(sellConfig);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully create sell config", sellConfig);
    }

    public async Task<ResponseModel> DeleteSellConfigAsync(string id, bool saveAll)
    {
        var sellConfig = await _unitOfWork.SellConfigRepository.GetByIdAsync(id);
        _unitOfWork.SellConfigRepository.Delete(sellConfig);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully delete sell config", sellConfig);
    }

    public async Task<ResponseModel> GetAllSellConfigAsync()
    {
        var sellConfigList = await _unitOfWork.SellConfigRepository.GetAllAsync();
        var convertedSellConfigs = _mapper.Map<IEnumerable<SellConfigReadDto>>(sellConfigList);
        return ResponseModel.Success("Successfully read sell config", convertedSellConfigs);
    }

    public async Task<ResponseModel> GetSellConfigByIdAsync(string id)
    {
        var sellConfig = await _unitOfWork.SellConfigRepository.GetByIdAsync(id);
        return ResponseModel.Success("Successfully get sell config", sellConfig);
    }


    public async Task<ResponseModel> UpdateSellConfigAsync(string id, SellConfigUpdateDto dto, bool saveAll)
    {
        var sellConfig = await _unitOfWork.SellConfigRepository.GetByIdAsync(id);
        _mapper.Map(dto, sellConfig);
        _unitOfWork.SellConfigRepository.Update(sellConfig);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Success update sell config", sellConfig);
    }
}