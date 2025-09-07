using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketResell.Repositories.Core.Dtos.Chatbox;

namespace TicketResell.Services.Services.Chatbox
{
    public interface IChatboxService
    {
        Task<ResponseModel> CreateReportAsync(ChatboxCreateDto dto, string userId, bool saveAll = true);
        Task<ResponseModel> CreateChatboxAsync(ChatboxCreateDto dto, string userId, bool saveAll = true);
        Task<ResponseModel> GetChatboxesAsync();
        Task<ResponseModel> GetChatboxByIdAsync(string id);
        Task<ResponseModel> UpdateChatboxStatusAsync(string id, int status, bool saveAll = true);
        Task<ResponseModel> GetChatboxesBySenderAndReceiverAsync(string senderId, string receiverId);
        Task<ResponseModel> GetActiveChatboxesBySenderAndReceiverAsync(string senderId, string receiverId);
        Task<ResponseModel> GetChatboxesBySenderIdAsync(string senderId);
        Task<ResponseModel> GetChatboxesByReceiverIdAsync(string receiverId);
        Task<ResponseModel> GetLatestChatbox(string senderId, string receiverId);
        Task<ResponseModel> GetChatboxsByUserId(string userId);
    }
}