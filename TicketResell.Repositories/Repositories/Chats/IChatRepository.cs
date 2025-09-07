using Repositories.Core.Entities;

namespace Repositories.Repositories.Chats;

public interface IChatRepository : IRepository<Chat>
{
    Task<Chat> CreateChatAsync(Chat chat);
    Task<string?> GetLatestChatboxIdAsync(string senderId, string receiverId);
    Task<IEnumerable<Chat>> GetChatsBySenderIdToReceiverIdAsync(string senderId, string receiverId);
    Task<Chat?> GetLatestChatByChatboxIdAsync(string senderId, string receiverId,string chatboxId);
    Task<bool> UpdateChatAsync(Chat chat);
    Task<IEnumerable<Chat>> GetChatsByUserIdAsync(string userId);
    Task<IEnumerable<Chat>> GetChatsByUserIdAndChatboxStatusAsync(string userId, int status);

    Task<IEnumerable<Chat>> GetChatsByChatboxIdAsync(string chatboxId);
}