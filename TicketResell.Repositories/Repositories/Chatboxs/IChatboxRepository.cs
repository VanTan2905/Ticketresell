using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Repositories.Core.Entities;
using Repositories.Repositories;

namespace TicketResell.Repositories.Repositories.Chatboxs
{
    public interface IChatboxRepository: IRepository<Chatbox>
    {
        Task<Chatbox> CreateChatboxAsync(string chatboxId, string title, string description);
        Task<Chatbox> CreateReportAsync(string chatboxId, string title, string description, int status);
        Task UpdateChatboxStatusAsync(string chatboxId, int status);
        Task<IEnumerable<Chatbox>> GetChatboxesBySenderAndReceiverAsync(string senderId, string receiverId);
        Task<IEnumerable<Chatbox>> GetActiveChatboxesBySenderAndReceiverAsync(string senderId, string receiverId);
        Task<IEnumerable<Chatbox>> GetChatboxesBySenderIdAsync(string senderId);
        Task<IEnumerable<Chatbox>> GetChatboxesByReceiverIdAsync(string receiverId);
        Task<IEnumerable<Chatbox>> GetChatboxesByIdsAsync(IEnumerable<string> chatboxIds);
        Task<bool> CheckChatboxHasValidStatusAsync(string userId);
        Task<bool> CheckChatboxHasValidReportAsync(string userId);
    }
}