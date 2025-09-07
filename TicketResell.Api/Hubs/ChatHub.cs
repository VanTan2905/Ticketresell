using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ganss.Xss;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Repositories.Constants;
using TicketResell.Repositories.Core.Dtos.Chat;
using TicketResell.Repositories.Core.Dtos.Chatbox;
using TicketResell.Repositories.Helper;
using TicketResell.Repositories.Logger;
using TicketResell.Services.Services.Chatbox;

namespace TicketResell.Api.Hubs;

public class ChatHub : Hub
{
    private static Dictionary<string, string> Users = new Dictionary<string, string>();

    private readonly IServiceProvider _serviceProvider;
    private readonly IAppLogger _logger;

    public ChatHub(IServiceProvider serviceProvider, IAppLogger logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.Client(Context.ConnectionId)
            .SendAsync("Welcome", "Welcome to ChatHub. Please login first to send messages.");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = Users.FirstOrDefault(x => x.Value == Context.ConnectionId);

        if (!string.IsNullOrEmpty(user.Key))
        {
            Users.Remove(user.Key);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, user.Key); // Remove connection from group
        }

        if (exception != null)
            Console.WriteLine($"Connection {Context.ConnectionId} disconnected with error: {exception.Message}");
        else
            Console.WriteLine($"Connection {Context.ConnectionId} disconnected gracefully.");

        await base.OnDisconnectedAsync(exception);
    }

    public async Task UnblockChatbox(string chatboxId, string receiverID)
    {
        var httpContext = Context.GetHttpContext();
        if (!httpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return;
        var chatboxService = _serviceProvider.GetRequiredService<IChatboxService>();
        if (Users.TryGetValue(receiverID, out var receiverConnectionId))
        {
            await Clients.Client(receiverConnectionId).SendAsync("UnblockEvent", chatboxId, "Chat is unblock");
            await chatboxService.UpdateChatboxStatusAsync(chatboxId, 2);
        }
    }

        public async Task AcceptRequest(string chatboxId, string receiverID)
    {
        var httpContext = Context.GetHttpContext();
        if (!httpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return;
        var chatboxService = _serviceProvider.GetRequiredService<IChatboxService>();
        if (Users.TryGetValue(receiverID, out var receiverConnectionId))
        {
            await Clients.Client(receiverConnectionId).SendAsync("AcceptEvent", chatboxId);
        }
    }
    public async Task CompleteRequest(string chatboxId, string receiverID)
    {
        var httpContext = Context.GetHttpContext();
        if (!httpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return;
        var chatboxService = _serviceProvider.GetRequiredService<IChatboxService>();
        if (Users.TryGetValue(receiverID, out var receiverConnectionId))
        {
            await Clients.Client(receiverConnectionId).SendAsync("CompleteEvent", chatboxId);
        }
    }
    public async Task RejectRequest(string chatboxId, string receiverID)
    {
        var httpContext = Context.GetHttpContext();
        if (!httpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return;
        var chatboxService = _serviceProvider.GetRequiredService<IChatboxService>();
        if (Users.TryGetValue(receiverID, out var receiverConnectionId))
        {
            await Clients.Client(receiverConnectionId).SendAsync("RejectEvent", chatboxId);
        }
    }

    public async Task BlockChatbox(string chatboxId, string receiverID)
    {
        var httpContext = Context.GetHttpContext();
        if (!httpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return;
        var chatboxService = _serviceProvider.GetRequiredService<IChatboxService>();
        if (Users.TryGetValue(receiverID, out var receiverConnectionId))
        {
            await Clients.Client(receiverConnectionId).SendAsync("BlockedChatEvent", chatboxId);
            await chatboxService.UpdateChatboxStatusAsync(chatboxId, 3);
        }
    }
    
    public async Task LoginAsync(string userId, string accessKey)
    {
        var httpContext = Context.GetHttpContext();
        httpContext.SetAccessKey(accessKey);
        httpContext.SetUserId(userId);

        await Clients.Client(Context.ConnectionId).SendAsync("Authenticating", $"Authenticating user {userId}.");
        var authenticate = await httpContext.CheckAuthenTicatedDataAsync(_serviceProvider);

        if (authenticate.IsAuthenticated)
        {
            if (Users.ContainsKey(userId))
            {
                // Remove the old connection if the user reconnects
                var oldConnectionId = Users[userId];
                await Groups.RemoveFromGroupAsync(oldConnectionId, userId);
                Users[userId] = Context.ConnectionId;
            }
            else
            {
                Users.Add(userId, Context.ConnectionId);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, userId); // Add to group after checking
            await Clients.Client(Context.ConnectionId).SendAsync("Logged", $"You are logged in as {userId}.");
        }
        else
        {
            await Clients.Client(Context.ConnectionId).SendAsync("LoginFail", "Login failed.");
        }
    }

    public async Task SendMessageAsync(string receiverID, string message, string boxchatId)
    {
        if (string.IsNullOrWhiteSpace(message) || message.Length > 500)
        {
            await Clients.Client(Context.ConnectionId)
                .SendAsync("InvalidMessage", "Message cannot be empty or too long.");
            return;
        }

        var httpContext = Context.GetHttpContext();

        if (!httpContext.GetIsAuthenticated())
        {
            await Clients.Client(Context.ConnectionId).SendAsync("Unauthorized", "Please login first....");
            return;
        }

        var senderID = httpContext.GetUserId();
        var chatService = _serviceProvider.GetRequiredService<IChatService>();
        var userService = _serviceProvider.GetRequiredService<IUserService>();
        var chatboxService = _serviceProvider.GetRequiredService<IChatboxService>();

        var sanitizer = new HtmlSanitizer();
        var sanitizedMessage = sanitizer.Sanitize(message);

        var newChat = new ChatReadDto()
        {
            SenderId = senderID,
            ReceiverId = receiverID,
            Message = sanitizedMessage,
            ChatboxId = boxchatId
        };

        bool isStaff = (bool)(await userService.CheckUserRole(receiverID, RoleConstant.roleStaff)).Data;
        bool isAdmin = (bool)(await userService.CheckUserRole(receiverID, RoleConstant.roleAdmin)).Data;

        if ((httpContext.HasEnoughtRoleLevel(UserRole.Staff) || httpContext.HasEnoughtRoleLevel(UserRole.Admin)) && (isStaff || isAdmin))
        {
            newChat.ChatboxId = null;
        }

        if (newChat.ChatboxId != null)
        {
            var chatbox = (ChatboxReadDto)(await chatboxService.GetChatboxByIdAsync(boxchatId)).Data;
            if ((chatbox.Status != 3 && chatbox.Status != 1 && chatbox.Status != 0) || httpContext.HasEnoughtRoleLevel(UserRole.Staff) || httpContext.HasEnoughtRoleLevel(UserRole.Admin))
            {
                _logger.LogError("IS");
                var sentChat = await chatService.CreateChatDtoAsync(newChat);
                _logger.LogError("WHERE");
                if (Users.TryGetValue(receiverID, out var receiverConnectionId))
                {
                    _logger.LogError("ERROR");
                    await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", senderID, message);
                    await Clients.Client(Context.ConnectionId).SendAsync("MessageSent", receiverID, sentChat);
                    await Clients.Client(Context.ConnectionId).SendAsync("Unblock", senderID, "Chat is unblock");
                }
                else
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("UserNotFound", $"User {receiverID} is not connected.");
                }
                
                // if (!(httpContext.HasEnoughtRoleLevel(UserRole.Admin) || httpContext.HasEnoughtRoleLevel(UserRole.Staff)))
                // {
                //     if (!string.IsNullOrEmpty(receiverConnectionId))
                //     {
                //         await Clients.Client(receiverConnectionId).SendAsync("BlockedChatEvent", chatbox.ChatboxId);
                //     }
                //     await chatboxService.UpdateChatboxStatusAsync(boxchatId, 3);
                // }
            }
            else
            {
                await Clients.Client(Context.ConnectionId).SendAsync("Block", senderID, "Chat is block");
            }
        }
        else
        {
            var sentChat = await chatService.CreateChatDtoAsync(newChat);
            if (Users.TryGetValue(receiverID, out var receiverConnectionId))
            {
                await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", senderID, message);
                await Clients.Client(Context.ConnectionId).SendAsync("MessageSent", receiverID, sentChat);
                await Clients.Client(Context.ConnectionId).SendAsync("Unblock", senderID, "Chat is unblock");
            }
            else
            {
                await Clients.Client(Context.ConnectionId).SendAsync("UserNotFound", $"User {receiverID} is not connected.");
            }
        }
    }
}