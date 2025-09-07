using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Repositories.Constants;
using TicketResell.Repositories.Core.Dtos.Chat;
using TicketResell.Repositories.Helper;
using TicketResell.Services.Services.Chatbox;

namespace TicketResell.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IChatService _chatService;
        private readonly IChatboxService _chatboxService;

        public ChatController(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            _chatboxService = serviceProvider.GetRequiredService<IChatboxService>();
            _chatService = serviceProvider.GetRequiredService<IChatService>();
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateChat([FromBody] Chat chat)
        {
            if (!HttpContext.IsUserIdAuthenticated(chat.SenderId))
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to create chat"));

            return ResponseParser.Result(await _chatService.CreateChatAsync(chat));
        }

        [HttpPost("get/{senderId}/{receiverId}")]
        public async Task<IActionResult> GetChatsBySenderIdToReceiverId(string senderId, string receiverId)
        {
            if (!HttpContext.IsUserIdAuthenticated(senderId))
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get chat"));

            return ResponseParser.Result(await _chatService.GetChatsBySenderIdToReceiverIdAsync(senderId, receiverId));
        }
        [HttpPost("get/{userId}")]
        public async Task<IActionResult> GetAllChatById(string userId)
        {
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            {

                if (!HttpContext.IsUserIdAuthenticated(userId))
                    return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get chat"));
            }

            return ResponseParser.Result(await _chatService.GetAllChatById(userId));
        }

        [HttpPost("maprequest/{receiverId}/{chatboxId}")]
        public async Task<IActionResult> GetLatestChat(string receiverId,string chatboxId)
        {
            var senderId = HttpContext.GetUserId();
            if (string.IsNullOrEmpty(senderId))
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get latest chat"));

            if (!HttpContext.IsUserIdAuthenticated(senderId))
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get latest chat"));
            var response = await _chatService.GetLatestChatBySenderAndReceiverAsync(receiverId, receiverId,chatboxId);
            ChatReadDto latestChat = (ChatReadDto)response.Data;
            latestChat.ReceiverId = senderId;
            await _chatboxService.UpdateChatboxStatusAsync(latestChat.ChatboxId, 2);
            await _chatService.UpdateChat(latestChat);
            return ResponseParser.Result(ResponseModel.Success("Success", latestChat));
        }

        [HttpGet("getValidChats/{userId}")]
        public async Task<IActionResult> GetValidChatByUserId(string userId)
        {
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            {

                if (!HttpContext.IsUserIdAuthenticated(userId))
                    return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get chat"));
            }
            var chats = await _chatService.GetValidChatByUserId(userId);
            return ResponseParser.Result(chats);
        }
        [HttpGet("getChatsByBoxchatId/{boxchatId}")]
        public async Task<IActionResult> GetChatsByBoxchatId(string boxchatId)
        {
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            {

                var userId = HttpContext.GetUserId();
                if (!HttpContext.IsUserIdAuthenticated(userId))
                    return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get chat"));
            }
            var chats = await _chatService.GetChatsByChatboxIdAsync(boxchatId);
            return ResponseParser.Result(chats);
        }

        [HttpPut("processing/{chatboxId}")]
        public async Task<IActionResult> Processing(string chatboxId)
        {
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff) && !HttpContext.HasEnoughtRoleLevel(UserRole.Admin))
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view chatboxes"));

            return ResponseParser.Result(await _chatboxService.UpdateChatboxStatusAsync(chatboxId, 2));
        }
    }
}