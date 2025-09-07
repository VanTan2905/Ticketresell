using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using Repositories.Repositories;
using TicketResell.Repositories.Logger;

namespace TicketResell.Repositories.Repositories.Chatboxs
{
    public class ChatboxRepository : GenericRepository<Chatbox>, IChatboxRepository
    {
        private readonly TicketResellManagementContext _context;
        private readonly IAppLogger _logger;

        public ChatboxRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Chatbox> CreateChatboxAsync(string chatboxId, string title, string description)
        {
            // Try to find existing chatbox
            var existingChatbox = await _context.Chatboxes
                .FirstOrDefaultAsync(c => c.ChatboxId == chatboxId);

            // If chatbox exists and is active (status 1), return it
            if (existingChatbox != null && existingChatbox.Status == 1)
            {
                _logger.LogInformation($"Returning existing active chatbox with ID: {chatboxId}");
                return existingChatbox;
            }

            // If chatbox doesn't exist or has status 0, create new one
            if (existingChatbox == null || existingChatbox.Status == 0)
            {
                var newChatbox = new Chatbox
                {
                    ChatboxId = chatboxId,
                    Title = title,
                    Description = description,
                    Status = 1,
                    CreateDate = DateTime.UtcNow
                };

                await CreateAsync(newChatbox);
                _logger.LogInformation($"Created new chatbox with ID: {chatboxId}");
                return newChatbox;
            }

            // This case shouldn't occur given the above conditions, but included for completeness
            throw new InvalidOperationException($"Unable to create or return chatbox with ID: {chatboxId}");
        }
        public async Task<Chatbox> CreateReportAsync(string chatboxId, string title, string description, int status)
        {
            // Try to find existing chatbox
            var existingChatbox = await _context.Chatboxes
                .FirstOrDefaultAsync(c => c.ChatboxId == chatboxId);

            // If chatbox exists and is active (status 1), return it
            if (existingChatbox != null)
            {
                _logger.LogInformation($"Returning existing active chatbox with ID: {chatboxId}");
                return existingChatbox;
            }

            // If chatbox doesn't exist or has status 0, create new one
            if (existingChatbox == null)
            {
                var newChatbox = new Chatbox
                {
                    ChatboxId = chatboxId,
                    Title = title,
                    Description = description,
                    Status = status,
                    CreateDate = DateTime.UtcNow
                };

                await CreateAsync(newChatbox);
                _logger.LogInformation($"Created new chatbox with ID: {chatboxId}");
                return newChatbox;
            }

            // This case shouldn't occur given the above conditions, but included for completeness
            throw new InvalidOperationException($"Unable to create or return chatbox with ID: {chatboxId}");
        }

        public async Task<IEnumerable<Chatbox>> GetChatboxesByIdsAsync(IEnumerable<string> chatboxIds)
        {
            if (chatboxIds == null || !chatboxIds.Any())
                return [];

            return await _context.Chatboxes
                .Include(c => c.Chats)
                .Where(c => chatboxIds.Contains(c.ChatboxId))
                .OrderByDescending(c => c.CreateDate)
                .ToListAsync();
        }

        public async Task<bool> CheckChatboxHasValidStatusAsync(string userId)
        {
            var chatboxes = await _context.Chatboxes
                .Include(c => c.Chats)
                .Where(c => c.Chats.Any(chat => chat.SenderId == userId || chat.ReceiverId == userId))
                .ToListAsync();

            if (!chatboxes.Any())
                return true;

            // Return true if there is NO chatbox with status 1 or 2
            return !chatboxes.Any(c => c.Status == 1 || c.Status == 2 || c.Status == 3);
        }

        public async Task<bool> CheckChatboxHasValidReportAsync(string userId)
        {
            var chatboxes = await _context.Chatboxes
                .Include(c => c.Chats)
                .Where(c => c.Chats.Any(chat => chat.SenderId == userId || chat.ReceiverId == userId))
                .ToListAsync();

            if (!chatboxes.Any())
                return true;

            // Return true if there is NO chatbox with status 1 or 2
            return !chatboxes.Any(c => c.Status == 4 || c.Status == 5 || c.Status == 6 || c.Status == 7);
        }

        public async Task UpdateChatboxStatusAsync(string chatboxId, int status)
        {
            var chatbox = await GetByIdAsync(chatboxId);
            if (chatbox == null)
            {
                throw new KeyNotFoundException($"Chatbox with ID {chatboxId} not found");
            }

            chatbox.Status = status;
            Update(chatbox);
        }

        public async Task<IEnumerable<Chatbox>> GetChatboxesBySenderAndReceiverAsync(string senderId, string receiverId)
        {
            return await _context.Chatboxes
                .Include(c => c.Chats)
                .Where(chatbox => chatbox.Chats.Any(chat =>
                    (chat.SenderId == senderId && chat.ReceiverId == receiverId) ||
                    (chat.SenderId == receiverId && chat.ReceiverId == senderId)))
                .ToListAsync();
        }

        public async Task<IEnumerable<Chatbox>> GetActiveChatboxesBySenderAndReceiverAsync(string senderId, string receiverId)
        {
            return await _context.Chatboxes
                .Include(c => c.Chats)
                .Where(chatbox =>
                    chatbox.Status == 1 &&
                    chatbox.Chats.Any(chat =>
                        (chat.SenderId == senderId && chat.ReceiverId == receiverId) ||
                        (chat.SenderId == receiverId && chat.ReceiverId == senderId)))
                .ToListAsync();
        }

        public async Task<IEnumerable<Chatbox>> GetChatboxesBySenderIdAsync(string senderId)
        {
            return await _context.Chatboxes
                .Include(c => c.Chats)
                .Where(chatbox => chatbox.Chats.Any(chat => chat.SenderId == senderId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Chatbox>> GetChatboxesByReceiverIdAsync(string receiverId)
        {
            return await _context.Chatboxes
                .Include(c => c.Chats)
                .Where(chatbox => chatbox.Chats.Any(chat => chat.ReceiverId == receiverId))
                .ToListAsync();
        }
    }
}