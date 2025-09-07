using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories.Chats;

public class ChatRepository : GenericRepository<Chat>, IChatRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public ChatRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Chat> CreateChatAsync(Chat chat)
    {
        await _context.Chats.AddAsync(chat);
        return chat;
    }
    public async Task<bool> UpdateChatAsync(Chat chat)
    {
        if (chat == null)
        {
            _logger.LogError("Update failed: Chat object is null.");
            return false;
        }

        try
        {
            var existingChat = await _context.Chats.FindAsync(chat.ChatId); // assuming ChatId is the primary key
            if (existingChat == null)
            {
                _logger.LogError($"Update failed: Chat with ID {chat.ChatId} not found.");
                return false;
            }

            // Update properties as needed
            existingChat.Message = chat.Message;
            existingChat.SenderId = chat.SenderId;
            existingChat.ReceiverId = chat.ReceiverId;

            _context.Chats.Update(existingChat);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating chat with ID {chat.ChatId}: {ex.Message}");
            return false;
        }
    }
    public async Task<string?> GetLatestChatboxIdAsync(string senderId, string receiverId)
    {
        if (string.IsNullOrWhiteSpace(senderId) || string.IsNullOrWhiteSpace(receiverId))
            return null;
        _logger.LogError(senderId);
        _logger.LogError(receiverId);
        try
        {
            var latestChat = await _context.Chats
                .Where(c => (c.SenderId == senderId && c.ReceiverId == receiverId) ||
                           (c.ReceiverId == senderId && c.SenderId == receiverId))
                .OrderByDescending(c => c.Date)
                .FirstOrDefaultAsync();
            _logger.LogError("Latest chat" + latestChat?.ChatboxId);
            return latestChat?.ChatboxId;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting latest chatbox ID for sender {senderId} and receiver {receiverId}: {ex.Message}");
            return null;
        }
    }

    public async Task<Chat?> GetLatestChatByChatboxIdAsync(string senderId, string receiverId,string chatboxId)
    {
        if (string.IsNullOrWhiteSpace(senderId) || string.IsNullOrWhiteSpace(receiverId))
            return null;
        _logger.LogError(senderId);
        _logger.LogError(receiverId);
        try
        {
            var latestChat = await _context.Chats
                .Where(c => ((c.SenderId == senderId && c.ReceiverId == receiverId ) ||
                           (c.ReceiverId == senderId && c.SenderId == receiverId)) && c.ChatboxId == chatboxId)
                .OrderByDescending(c => c.Date)
                .FirstOrDefaultAsync();
            _logger.LogError("Latest chat" + latestChat?.ChatboxId);
            if (latestChat == null)
            {
                _logger.LogError($"NULL {senderId} {receiverId}");
            }
            return latestChat;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting latest chatbox ID for sender {senderId} and receiver {receiverId}: {ex.Message}");
            return null;
        }
    }

    public async Task<IEnumerable<Chat>> GetChatsByUserIdAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return [];

        var chats = await _context.Chats
            .Where(c => c.SenderId == userId || c.ReceiverId == userId)
            .Include(c => c.Receiver)
            .Include(c => c.Sender)
            .OrderBy(c => c.Date)
            .ToListAsync();

        return chats;
    }

    public async Task<IEnumerable<Chat>> GetChatsByUserIdAndChatboxStatusAsync(string userId, int status)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return [];

        var chats = await _context.Chats
            .Include(c => c.Receiver)
            .Include(c => c.Sender)
            .Include(c => c.Chatbox) // Include chatbox to check its status
            .Where(c =>
                (c.SenderId == userId || c.ReceiverId == userId) &&
                c.Chatbox != null &&
                c.Chatbox.Status == status)
            .OrderBy(c => c.Date)
            .ToListAsync();

        return chats;
    }
    public async Task<IEnumerable<Chat>> GetChatsByChatboxIdAsync(string chatboxId)
    {
        if (string.IsNullOrWhiteSpace(chatboxId))
            return [];

        var chats = await _context.Chats
            .Include(c => c.Receiver)
            .Include(c => c.Sender)
            .Include(c => c.Chatbox)
            .Where(c => c.ChatboxId == chatboxId)
            .OrderBy(c => c.Date)
            .ToListAsync();

        return chats;
    }

    public async Task<IEnumerable<Chat>> GetChatsBySenderIdToReceiverIdAsync(string senderId, string receiverId)
    {
        if (string.IsNullOrWhiteSpace(senderId) || string.IsNullOrWhiteSpace(receiverId))
            return [];

        var chats = await _context.Chats.Where(c => (c.SenderId == senderId && c.ReceiverId == receiverId) || (c.ReceiverId ==
            senderId && c.SenderId == receiverId)).Include(c => c.Receiver).OrderBy(c => c.Date).ToListAsync();

        return chats;
    }
}