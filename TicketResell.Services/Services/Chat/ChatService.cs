using AutoMapper;
using Azure;
using Microsoft.IdentityModel.Tokens;
using Repositories.Core.Entities;
using TicketResell.Repositories.Core.Dtos.Chat;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class ChatService : IChatService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppLogger _logger;
    public ChatService(IUnitOfWork unitOfWork, IMapper mapper, IAppLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ResponseModel> CreateChatAsync(Chat chat)
    {
        chat.ChatId = DateTime.Now.Ticks.ToString();
        chat.Date = DateTime.Now;
        // string chatboxId = await _unitOfWork.ChatRepository.GetLatestChatboxIdAsync(chat.SenderId, chat.ReceiverId);
        // await _unitOfWork.ChatboxRepository.CreateChatboxAsync(chatboxId, )
        // chat.ChatboxId = chatboxId;
        var chatSent = await _unitOfWork.ChatRepository.CreateChatAsync(chat);
        await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Created chat successfully", chatSent);
    }
    public async Task<ResponseModel> CreateChatDtoAsync(ChatReadDto chat)
    {
        chat.ChatId = DateTime.Now.Ticks.ToString();
        chat.Date = DateTime.Now;
        // string chatboxId = await _unitOfWork.ChatRepository.GetLatestChatboxIdAsync(chat.SenderId, chat.ReceiverId);
        // await _unitOfWork.ChatboxRepository.CreateChatboxAsync(chatboxId, )
        // chat.ChatboxId = chatboxId;
        var newchat = _mapper.Map<Chat>(chat);
        var chatSent = await _unitOfWork.ChatRepository.CreateChatAsync(newchat);
        var newSentChat = _mapper.Map<ChatReadDto>(chatSent);
        await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Created chat successfully", newSentChat);
    }
    public async Task<ResponseModel> GetAllChatById(string id){
        var chats = await _unitOfWork.ChatRepository.GetChatsByUserIdAsync(id);
        var results = _mapper.Map<IEnumerable<ChatReadDto>>(chats);
        return ResponseModel.Success($"Success get all chats of user {id}", results);
    }
    public async Task<ResponseModel> UpdateChat(ChatReadDto? chatDto)
    {
        try
        {
            if (chatDto == null)
                return ResponseModel.Error("Chat data is required");

            var existingChat = await _unitOfWork.ChatRepository.GetByIdAsync(chatDto.ChatId);
            if (existingChat == null)
                return ResponseModel.NotFound($"Chat with ID {chatDto.ChatId} not found");

            var updatedChat = _mapper.Map<Chat>(chatDto);

            // Update the chat
            await _unitOfWork.ChatRepository.UpdateChatAsync(updatedChat);
            await _unitOfWork.CompleteAsync();

            // Map back to DTO for response
            var responseDto = _mapper.Map<ChatReadDto>(updatedChat);
            return ResponseModel.Success("Successfully updated chat", responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating chat {chatDto?.ChatId}: {ex.Message}");
            return ResponseModel.Error($"Failed to update chat: {ex.Message}");
        }
    }
    public async Task<ResponseModel> GetLatestChatBySenderAndReceiverAsync(string senderId, string receiverId,string chatboxId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(senderId) || string.IsNullOrWhiteSpace(receiverId))
                return ResponseModel.Error("Sender ID and Receiver ID are required");

            var latestChat = await _unitOfWork.ChatRepository.GetLatestChatByChatboxIdAsync(senderId, receiverId,chatboxId);

            if (latestChat == null)
                return ResponseModel.NotFound("No chat history found between these users");

            var chatDto = _mapper.Map<ChatReadDto>(latestChat);
            return ResponseModel.Success("Successfully retrieved latest chat", chatDto);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error retrieving latest chat for sender {senderId} and receiver {receiverId}: {ex.Message}");
            return ResponseModel.Error($"Failed to retrieve latest chat: {ex.Message}");
        }
    }

    public async Task<ResponseModel> GetChatsBySenderIdToReceiverIdAsync(string senderId, string receiverId)
    {
        if (senderId == receiverId)
        {
            return ResponseModel.Success("You cant send message to yourseft", null);
        }

        var chatReadDtos = _mapper.Map<IEnumerable<ChatReadDto>>(
            await _unitOfWork.ChatRepository.GetChatsBySenderIdToReceiverIdAsync(senderId, receiverId));
        return ResponseModel.Success("Get chat lists successfully", chatReadDtos);
    }

    public async Task<ResponseModel> GetValidChatByUserId(string userId){
        var chats = await _unitOfWork.ChatRepository.GetChatsByUserIdAndChatboxStatusAsync(userId, 2);
        if(chats.IsNullOrEmpty())
            return ResponseModel.NotFound("Not found chat");
        
        var results = _mapper.Map<IEnumerable<ChatReadDto>>(chats);
        return ResponseModel.Success("Success",results);
    }
    public async Task<ResponseModel> GetChatsByChatboxIdAsync(string chatboxId){
        var chats = await _unitOfWork.ChatRepository.GetChatsByChatboxIdAsync(chatboxId);
        if(chats.IsNullOrEmpty())
            return ResponseModel.NotFound("Not found chat");
        
        var results = _mapper.Map<IEnumerable<ChatReadDto>>(chats);
        return ResponseModel.Success("Success",results);
    }

}