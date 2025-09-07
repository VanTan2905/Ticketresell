using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Org.BouncyCastle.Asn1;
using TicketResell.Repositories.Core.Dtos.Chat;
using TicketResell.Repositories.Core.Dtos.Chatbox;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.Chatbox
{
    public class ChatboxService : IChatboxService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IAppLogger _logger;

        public ChatboxService(IUnitOfWork unitOfWork, IMapper mapper, IAppLogger logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ResponseModel> GetLatestChatbox(string senderId, string receiverId)
        {
            // First, try to get the latest chatbox ID from their chat history
            var existingChatboxId = await _unitOfWork.ChatRepository.GetLatestChatboxIdAsync(senderId, receiverId);
            _logger.LogError(existingChatboxId);
            // If found and active, return the existing chatbox
            if (!string.IsNullOrEmpty(existingChatboxId))
            {
                var existingChatbox = await _unitOfWork.ChatboxRepository.GetByIdAsync(existingChatboxId);
                if (existingChatbox.Status == 1)
                {
                    var existingChatboxDto = _mapper.Map<ChatboxReadDto>(existingChatbox);
                    return ResponseModel.Success("Retrieved existing chatbox", existingChatboxDto);
                }
            }
            return ResponseModel.Error("No last chatboxId that has status 1");
        }
        
        
        public async Task<ResponseModel> CreateChatboxAsync(ChatboxCreateDto dto, string userId, bool saveAll = true)
        {
            try
            {   
                bool canCreateRequest = await _unitOfWork.ChatboxRepository.CheckChatboxHasValidStatusAsync(userId);
                if(canCreateRequest == true){
                    // Attempt to create or get existing chatbox
                    var chatbox = await _unitOfWork.ChatboxRepository.CreateChatboxAsync(
                        dto.ChatboxId,
                        dto.Title,
                        dto.Description
                    );

                    if (saveAll) await _unitOfWork.CompleteAsync();

                    var chatboxDto = _mapper.Map<ChatboxReadDto>(chatbox);
                    return ResponseModel.Success("Successfully created/retrieved chatbox", chatboxDto);
                }else{
                    return ResponseModel.Error("Request already created");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating chatbox: {ex.Message}");
                return ResponseModel.Error($"Failed to create chatbox: {ex.Message}");
            }
        }

        public async Task<ResponseModel> CreateReportAsync(ChatboxCreateDto dto, string userId, bool saveAll = true)
        {
            try
            {   
                bool canCreateRequest = await _unitOfWork.ChatboxRepository.CheckChatboxHasValidReportAsync(userId);
                if(canCreateRequest == true){
                    // Attempt to create or get existing chatbox
                    var chatbox = await _unitOfWork.ChatboxRepository.CreateReportAsync(
                        dto.ChatboxId,
                        dto.Title,
                        dto.Description,
                        dto.Status
                    );

                    if (saveAll) await _unitOfWork.CompleteAsync();

                    var chatboxDto = _mapper.Map<ChatboxReadDto>(chatbox);
                    return ResponseModel.Success("Successfully created/retrieved chatbox", chatboxDto);
                }else{
                    return ResponseModel.Error("Request already created");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating chatbox: {ex.Message}");
                return ResponseModel.Error($"Failed to create chatbox: {ex.Message}");
            }
        }

        public async Task<ResponseModel> GetChatboxesAsync()
        {
            try
            {
                var chatboxes = await _unitOfWork.ChatboxRepository.GetAllAsync();
                var chatboxDtos = _mapper.Map<IEnumerable<ChatboxReadDto>>(chatboxes);
                return ResponseModel.Success("Successfully retrieved chatboxes", chatboxDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving chatboxes: {ex.Message}");
                return ResponseModel.Error($"Failed to retrieve chatboxes: {ex.Message}");
            }
        }

        public async Task<ResponseModel> GetChatboxByIdAsync(string id)
        {
            try
            {
                var chatbox = await _unitOfWork.ChatboxRepository.GetByIdAsync(id);
                var chatboxDto = _mapper.Map<ChatboxReadDto>(chatbox);
                return ResponseModel.Success("Successfully retrieved chatbox", chatboxDto);
            }
            catch (KeyNotFoundException)
            {
                return ResponseModel.Error($"Chatbox with ID {id} not found");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving chatbox: {ex.Message}");
                return ResponseModel.Error($"Failed to retrieve chatbox: {ex.Message}");
            }
        }

        public async Task<ResponseModel> GetChatboxsByUserId(string userId){
            var chats = await _unitOfWork.ChatRepository.GetChatsByUserIdAsync(userId);
            if (chats == null || !chats.Any()){
                return ResponseModel.Error("No chat found");
            }
            // Get distinct chatbox IDs from the chats
            var chatboxIds = chats
                .Where(c => !string.IsNullOrWhiteSpace(c.ChatboxId))
                .Select(c => c.ChatboxId)
                .Distinct();

            // Fetch the chatboxes with those IDs
            var chatboxes = await _unitOfWork.ChatboxRepository.GetChatboxesByIdsAsync(chatboxIds);
            var results = _mapper.Map<IEnumerable<ChatboxReadDto>>(chatboxes);
            return ResponseModel.Success("Success get all chatbox",results);
        }   


        public async Task<ResponseModel> UpdateChatboxStatusAsync(string id, int status, bool saveAll = true)
        {
            try
            {
                await _unitOfWork.ChatboxRepository.UpdateChatboxStatusAsync(id, status);
                if (saveAll) await _unitOfWork.CompleteAsync();
                return ResponseModel.Success($"Successfully updated chatbox status to {status}");
            }
            catch (KeyNotFoundException)
            {
                return ResponseModel.Error($"Chatbox with ID {id} not found");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating chatbox status: {ex.Message}");
                return ResponseModel.Error($"Failed to update chatbox status: {ex.Message}");
            }
        }

        public async Task<ResponseModel> GetChatboxesBySenderAndReceiverAsync(string senderId, string receiverId)
        {
            try
            {
                var chatboxes = await _unitOfWork.ChatboxRepository
                    .GetChatboxesBySenderAndReceiverAsync(senderId, receiverId);
                var chatboxDtos = _mapper.Map<IEnumerable<ChatboxReadDto>>(chatboxes);
                return ResponseModel.Success("Successfully retrieved chatboxes", chatboxDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving chatboxes by sender and receiver: {ex.Message}");
                return ResponseModel.Error($"Failed to retrieve chatboxes: {ex.Message}");
            }
        }

        public async Task<ResponseModel> GetActiveChatboxesBySenderAndReceiverAsync(string senderId, string receiverId)
        {
            try
            {
                var chatboxes = await _unitOfWork.ChatboxRepository
                    .GetActiveChatboxesBySenderAndReceiverAsync(senderId, receiverId);
                var chatboxDtos = _mapper.Map<IEnumerable<ChatboxReadDto>>(chatboxes);
                return ResponseModel.Success("Successfully retrieved active chatboxes", chatboxDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving active chatboxes: {ex.Message}");
                return ResponseModel.Error($"Failed to retrieve active chatboxes: {ex.Message}");
            }
        }

        public async Task<ResponseModel> GetChatboxesBySenderIdAsync(string senderId)
        {
            try
            {
                var chatboxes = await _unitOfWork.ChatboxRepository.GetChatboxesBySenderIdAsync(senderId);
                var chatboxDtos = _mapper.Map<IEnumerable<ChatboxReadDto>>(chatboxes);
                return ResponseModel.Success("Successfully retrieved chatboxes for sender", chatboxDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving chatboxes by sender: {ex.Message}");
                return ResponseModel.Error($"Failed to retrieve chatboxes: {ex.Message}");
            }
        }

        public async Task<ResponseModel> GetChatboxesByReceiverIdAsync(string receiverId)
        {
            try
            {
                var chatboxes = await _unitOfWork.ChatboxRepository.GetChatboxesByReceiverIdAsync(receiverId);
                var chatboxDtos = _mapper.Map<IEnumerable<ChatboxReadDto>>(chatboxes);
                return ResponseModel.Success("Successfully retrieved chatboxes for receiver", chatboxDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving chatboxes by receiver: {ex.Message}");
                return ResponseModel.Error($"Failed to retrieve chatboxes: {ex.Message}");
            }
        }
    }
}