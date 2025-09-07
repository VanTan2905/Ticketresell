using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Repositories.Constants;
using TicketResell.Repositories.Core.Dtos.Chatbox;
using TicketResell.Repositories.Core.Helper;
using TicketResell.Repositories.Helper;
using TicketResell.Repositories.Logger;
using TicketResell.Services.Services.Chatbox;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatboxController : ControllerBase
    {
        private readonly IChatboxService _chatboxService;
        private readonly IChatService _chatService;
        private readonly IServiceProvider _serviceProvider;
        private readonly IAppLogger _logger;

        public ChatboxController(IServiceProvider serviceProvider, IAppLogger logger)
        {
            _logger = logger;
            _chatboxService = serviceProvider.GetRequiredService<IChatboxService>(); ;
            _serviceProvider = serviceProvider;
            _chatService = serviceProvider.GetRequiredService<IChatService>();
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateChatbox([FromBody] ChatboxCreateDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to create a chatbox"));

            var userId = HttpContext.GetUserId();
            if (string.IsNullOrEmpty(userId))
                return ResponseParser.Result(
                    ResponseModel.BadRequest("User ID not found in the authentication context"));

            // var chatboxId = await _chatboxService.GetLatestChatbox(userId,)
            // var chatbox = await _chatboxService.GetChatboxByIdAsync(id);
            ChatboxReadDto? latestRequest = (ChatboxReadDto?)(await _chatboxService.GetLatestChatbox(userId, userId)).Data;
            
            if (latestRequest == null)
            {
                dto.ChatboxId = "CB" + Guid.NewGuid();
                var response = await _chatboxService.CreateChatboxAsync(dto, userId);
                Chat newChat = new Chat
                {
                    SenderId = userId,
                    ReceiverId = userId,
                    Message = dto.Description ?? "Default",
                    ChatboxId = dto.ChatboxId
                };
                if(response.StatusCode == 200)
                    await _chatService.CreateChatAsync(newChat);
                return ResponseParser.Result(response);
            }
            else
            {
                return ResponseParser.Result(ResponseModel.Error("Request already exist"));
            }

        }


        [HttpPost("{id}")]
        public async Task<IActionResult> GetChatbox(string id)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view chatbox"));

            var chatbox = await _chatboxService.GetChatboxByIdAsync(id);

            return ResponseParser.Result(chatbox);
        }

        [HttpPost("createreport/{status}/{sellerId}")]
        public async Task<IActionResult> CreateReport(int status, string sellerId)
        {   
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to create a report"));
            if (status < 4)
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You not have permission to set status less than 3"));
            var userId = HttpContext.GetUserId();
            ChatboxCreateDto dto = new ChatboxCreateDto(){
                ChatboxId = "CB"+ Guid.NewGuid(),
                Title="Report",
                Description= ReportHelper.GetStatusString(status)+$", người bị tố cáo: {sellerId}",
                Status = status
            };
            var response = await _chatboxService.CreateReportAsync(dto, userId);
            Chat newChat = new Chat
                {
                    SenderId = userId,
                    ReceiverId = userId,
                    Message = dto.Description ?? "Default",
                    ChatboxId = dto.ChatboxId
                };
            if(response.StatusCode == 200)
                await _chatService.CreateChatAsync(newChat);
            return ResponseParser.Result(response);
        }

        [HttpPost]
        public async Task<IActionResult> GetAllChatboxes()
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view chatboxes"));
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
                return ResponseParser.Result(
                    ResponseModel.Forbidden("Access denied: You don't have permission to view all chatboxes"));

            return ResponseParser.Result(await _chatboxService.GetChatboxesAsync());
        }

        [HttpGet("getall/{userId}")]
        public async Task<IActionResult> GetChatboxsByUserId(string userId)
        {
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff) && !HttpContext.HasEnoughtRoleLevel(UserRole.Admin))
            {
                if (!HttpContext.IsUserIdAuthenticated(userId))
                    return ResponseParser.Result(
                        ResponseModel.Unauthorized("You need to be authenticated to view chatboxes"));
            }
            return ResponseParser.Result(await _chatboxService.GetChatboxsByUserId(userId));
        }

        [HttpPut("closeboxchat/{chatboxId}")]
        public async Task<IActionResult> CloseBoxChat(string chatboxId)
        {
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff) && !HttpContext.HasEnoughtRoleLevel(UserRole.Admin))
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view chatboxes"));
            
            return ResponseParser.Result(await _chatboxService.UpdateChatboxStatusAsync(chatboxId, 0));
        }
        
        
        [HttpPut("rejectchat/{chatboxId}")]
        public async Task<IActionResult> RejectChat(string chatboxId)
        {
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff) && !HttpContext.HasEnoughtRoleLevel(UserRole.Admin))
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view chatboxes"));
            
            return ResponseParser.Result(await _chatboxService.UpdateChatboxStatusAsync(chatboxId, 8));
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