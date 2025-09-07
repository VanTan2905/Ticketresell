using AutoMapper;
using Repositories.Core.Dtos.Ticket;
using Repositories.Core.Entities;
using Repositories.Core.Validators;
using TicketResell.Repositories.Core.Dtos.Ticket;
using TicketResell.Repositories.UnitOfWork;
using TicketResell.Services.Services.Tickets;

namespace TicketResell.Services.Services;

public class TicketService : ITicketService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidatorFactory _validatorFactory;


    public TicketService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
    }

    public async Task<ResponseModel> GetTicketRemainingAsync(string id)
    {
        var count = await _unitOfWork.TicketRepository.GetTicketRemainingAsync(id);
        return ResponseModel.Success($"Successfully get Category of Ticket with id: {id}", count);
    }

    public async Task<ResponseModel> GetTicketsStartingWithinTimeRangeAsync(int ticketAmount, TimeSpan timeRange)
    {
        var tickets =
            await _unitOfWork.TicketRepository.GetTicketsStartingWithinTimeRangeAsync(ticketAmount, timeRange);

        if (tickets == null || !tickets.Any())
            return ResponseModel.NotFound("No tickets found in the specified time range.");

        var ticketDtos = _mapper.Map<List<TicketTopDto>>(tickets);
        return ResponseModel.Success($"Successfully retrieved {tickets.Count} tickets", ticketDtos);
    }

    public async Task<ResponseModel> GetTicketsByCategoryAndDateAsync(string categoryName, int amount)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketsByCategoryAndDateAsync(categoryName, amount);
        if (tickets.Count == 0) return ResponseModel.NotFound($"Not found any ticket with category {categoryName}");

        return ResponseModel.Success("Successfully get ticket by category name", tickets);
    }

    public async Task<ResponseModel> CreateTicketAsync(TicketCreateDto dto, bool saveAll)
    {
        var validatorTicket = _validatorFactory.GetValidator<Ticket>();
        var newTicket = _mapper.Map<Ticket>(dto);
        var validationResult = validatorTicket.Validate(newTicket);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        if (dto.CategoriesId.Count > 0)
            foreach (var id in dto.CategoriesId)
            {
                var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);

                if (category == null) return ResponseModel.BadRequest("category not found");
            }

        byte[] qrCodeBytes = null;
        if (dto.Qrcode != null)
            try
            {
                var mimeTypes = new Dictionary<string, string>
                {
                    { "data:image/png;base64,", ".png" },
                    { "data:image/jpeg;base64,", ".jpg" },
                    { "data:image/webp;base64,", ".webp" }
                };

                foreach (var mimeType in mimeTypes.Keys)
                    if (dto.Qrcode.StartsWith(mimeType))
                    {
                        dto.Qrcode = dto.Qrcode.Substring(mimeType.Length);
                        break;
                    }

                qrCodeBytes = Convert.FromBase64String(dto.Qrcode);
            }
            catch (FormatException)
            {
                return ResponseModel.BadRequest("Invalid QR code format");
            }

        newTicket.Qr = qrCodeBytes;
        newTicket.CreateDate = DateTime.UtcNow;
        newTicket.ModifyDate = DateTime.UtcNow;
        await _unitOfWork.TicketRepository.CreateTicketAsync(newTicket, dto.CategoriesId);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully created Ticket");
    }

    public async Task<ResponseModel> GetTicketByNameAsync(string name)
    {
        var ticket = await _unitOfWork.TicketRepository.GetTicketByNameAsync(name);

        var ticketDtos = _mapper.Map<List<TicketReadDto>>(ticket);
        return ResponseModel.Success($"Successfully get ticket: {ticketDtos}", ticketDtos);
    }

    public async Task<ResponseModel> GetTicketsByOrderIdWithStatusZeroAsync(string userId, int status)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketsByOrderIdWithStatusAsync(userId, status);

        if (tickets == null || !tickets.Any())
            return ResponseModel.Error("No tickets found for orders with status zero.");

        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        return ResponseModel.Success("Successfully retrieved tickets for orders with status zero.", ticketDtos);
    }


    public async Task<ResponseModel> GetTopTicket(int amount)
    {
        var ticket = await _unitOfWork.TicketRepository.GetTopTicketBySoldAmount(amount);
        var ticketDtos = _mapper.Map<List<TicketReadDto>>(ticket);

        return ResponseModel.Success("Successfully get top ticket", ticketDtos);
    }

    public async Task<ResponseModel> GetQrImageAsBase64Async(string ticketId)
    {
        var baseId = ticketId.Split('_')[0];
        var qr = await _unitOfWork.TicketRepository.GetQrImageAsBase64Async(baseId);
        return ResponseModel.Success("Successfully get qr", qr);
    }

    public async Task<ResponseModel> GetMultiQrImageAsBase64Async(string ticketId, int quantity)
    {
        var qr = await _unitOfWork.TicketRepository.GetMultiQrImagesAsBase64Async(ticketId, quantity);
        return ResponseModel.Success("Successfully get list qr", qr);
    }

    public async Task<ResponseModel> GetTicketsAsync()
    {
        var tickets = await _unitOfWork.TicketRepository.GetAllAsync();

        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        return ResponseModel.Success("Successfully get ticket", ticketDtos);
    }
    public async Task<ResponseModel> ActivateTicketsByBaseIdAsync(string ticketId, bool saveAll)
    {
        var baseId = ticketId.Contains("_") ? ticketId.Split('_')[0] : ticketId;

        await _unitOfWork.TicketRepository.ActivateTicketsByBaseIdAsync(baseId);
        if (saveAll) await _unitOfWork.CompleteAsync();

        return ResponseModel.Success($"Successfully activated tickets with base ID: {baseId}");
    }
    
 public async Task<ResponseModel> DisableTicketsByBaseIdAsync(string ticketId, bool saveAll)
    {
        var baseId = ticketId.Contains("_") ? ticketId.Split('_')[0] : ticketId;

        await _unitOfWork.TicketRepository.DisableTicketsByBaseIdAsync(baseId);
        if (saveAll) await _unitOfWork.CompleteAsync();

        return ResponseModel.Success($"Successfully activated tickets with base ID: {baseId}");
    }

    public async Task<ResponseModel> GetRealAllAsync()
    {
        var tickets = await _unitOfWork.TicketRepository.GetRealAllAsync(false);

        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        return ResponseModel.Success("Successfully get ticket", ticketDtos);
    }

    public async Task<ResponseModel> GetTicketRangeAsync(int start, int count)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketRangeAsync(start, count);

        if (tickets == null || !tickets.Any()) return ResponseModel.NotFound("No tickets found in the specified range");

        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        return ResponseModel.Success($"Successfully retrieved {tickets.Count} tickets", ticketDtos);
    }

    public async Task<ResponseModel> GetTicketByDateAsync(DateTime date)
    {
        var ticket = await _unitOfWork.TicketRepository.GetTicketByDateAsync(date);


        var ticketDtos = _mapper.Map<List<TicketReadDto>>(ticket);
        return ResponseModel.Success($"Successfully get ticket: {ticketDtos}", ticketDtos);
    }

    public async Task<ResponseModel> GetTicketByBaseIdAsync(string id)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketsByBaseIdAsync(id);
        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        var index = 0;
        foreach (var ticket in tickets)
        {
            if (ticket.Qr != null)
                ticketDtos[index].Qrcode = Convert.ToBase64String(ticket.Qr);
            index++;
        }

        return ResponseModel.Success($"Successfully get ticket:{ticketDtos}", ticketDtos);
    }


    public async Task<ResponseModel> GetTicketByIdAsync(string id)
    {
        var tickets = await _unitOfWork.TicketRepository.GetByIdAsync(id);
        var ticketDtos = _mapper.Map<TicketReadDto>(tickets);

        return ResponseModel.Success($"Successfully get ticket:{ticketDtos}", ticketDtos);
    }

    public async Task<ResponseModel> UpdateTicketsByBaseIdAsync(string ticketId, TicketUpdateDto? dto,
        List<string> categoryIds, bool saveAll)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketsByBaseIdAsync(ticketId);

        if (tickets == null || !tickets.Any()) return ResponseModel.BadRequest("No tickets found with the base ID.");


        foreach (var ticket in tickets)
        {
            ticket.ModifyDate = DateTime.UtcNow;
            _mapper.Map(dto, ticket);
            var validator = _validatorFactory.GetValidator<Ticket>();

            var validationResult = validator.Validate(ticket);
            if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation error", validationResult.Errors);


            await _unitOfWork.TicketRepository.UpdateTicketAsync(ticket.TicketId, ticket, dto.CategoriesId);
        }


        if (saveAll) await _unitOfWork.CompleteAsync();

        return ResponseModel.Success($"Successfully updated all tickets with base ID: {ticketId}");
    }

    public async Task<ResponseModel> DeleteManyTicketAsync(string ticketId, List<string> ticketIds, bool saveAll)
    {
        await _unitOfWork.TicketRepository.DeleteManyTicket(ticketId, ticketIds);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted Ticket(s) with id: {ticketId}");
    }

    public async Task<ResponseModel> DeleteTicketByBaseId(string ticketId, bool saveAll)
    {
        await _unitOfWork.TicketRepository.DeleteTicketByBaseId(ticketId);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted Ticket(s) with id: {ticketId}");
    }


    public async Task<ResponseModel> UpdateQrTicketByIdAsync(string ticketId, TicketQrDto dto, bool saveAll)
    {
        var ticket = await _unitOfWork.TicketRepository.GetByIdAsync(ticketId);

        if (ticket == null) return ResponseModel.BadRequest("No tickets found with the base ID.");

        ticket.ModifyDate = DateTime.UtcNow;
        _mapper.Map(dto, ticket);

        var validator = _validatorFactory.GetValidator<Ticket>();

        var validationResult = validator.Validate(ticket);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation error", validationResult.Errors);

        byte[] qrCodeBytes = null;
        if (dto.Qr != null)
            try
            {
                var mimeTypes = new Dictionary<string, string>
                {
                    { "data:image/png;base64,", ".png" },
                    { "data:image/jpeg;base64,", ".jpg" },
                    { "data:image/webp;base64,", ".webp" }
                };

                foreach (var mimeType in mimeTypes.Keys)
                    if (dto.Qr.StartsWith(mimeType))
                    {
                        dto.Qr = dto.Qr.Substring(mimeType.Length);
                        break;
                    }

                qrCodeBytes = Convert.FromBase64String(dto.Qr);

                ticket.Qr = qrCodeBytes;
            }


            catch (FormatException)
            {
                return ResponseModel.BadRequest("Invalid QR code format");
            }

        _unitOfWork.TicketRepository.Update(ticket);
        if (saveAll) await _unitOfWork.CompleteAsync();

        return ResponseModel.Success($"Successfully updated all tickets with ID: {ticketId}");
    }


    public async Task<ResponseModel> DeleteTicketAsync(string id, bool saveAll)
    {
        await _unitOfWork.TicketRepository.DeleteTicketAsync(id);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted Ticket(s) with id: {id}");
    }

    public async Task<ResponseModel> GetTicketByCategoryAsync(string id)
    {
        var cate = await _unitOfWork.TicketRepository.GetTicketCateByIdAsync(id);
        return ResponseModel.Success($"Successfully get Category of Ticket with id: {id}", cate);
    }

    public async Task<ResponseModel> GetTicketBySellerId(string id)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketBySellerId(id);
        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        return ResponseModel.Success($"Successfully get ticket : {ticketDtos}", ticketDtos);
    }

    public async Task<ResponseModel> CheckExistId(string id)
    {
        var check = await _unitOfWork.TicketRepository.CheckExist(id);
        if (!check) return ResponseModel.BadRequest("Id is not Existed");

        return ResponseModel.Success("Id is existed");
    }

    public async Task<ResponseModel> GetTicketByCategoryIdAsync(string ticketid, string[] categoryId)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketByCateIdAsync(ticketid, categoryId);
        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        return ResponseModel.Success("Successfully get tickets", ticketDtos);
    }

    public async Task<ResponseModel> GetTicketNotByCategoryIdAsync(string[] categoryId)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketNotByCateIdAsync(categoryId);
        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        return ResponseModel.Success("Successfully get tickets", ticketDtos);
    }

    public async Task<ResponseModel> GetTicketByListCategoryIdAsync(string[] categoryId)
    {
        var tickets = await _unitOfWork.TicketRepository.GetTicketByListCateIdAsync(categoryId);
        var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
        return ResponseModel.Success("Successfully get tickets", ticketDtos);
    }
}