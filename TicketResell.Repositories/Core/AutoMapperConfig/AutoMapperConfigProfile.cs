using AutoMapper;
using Repositories.Core.Dtos.Category;
using Repositories.Core.Dtos.Revenue;
using Repositories.Core.Dtos.Order;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Entities;
using Repositories.Core.Dtos.User;
using Repositories.Core.Dtos.SellConfig;
using Repositories.Core.Dtos.Role;
using Repositories.Core.Dtos.Ticket;
using TicketResell.Repositories.Core.Dtos.Authentication;
using TicketResell.Repositories.Core.Dtos.Cart;
using TicketResell.Repositories.Core.Dtos.Order;
using TicketResell.Repositories.Core.Dtos.Chat;
using Category = Repositories.Core.Entities.Category;
using TicketResell.Repositories.Core.Dtos.Ticket;
using TicketResell.Repositories.Core.Dtos.Rating;
using TicketResell.Repositories.Core.Dtos.Chatbox;

namespace Repositories.Core.AutoMapperConfig
{
    public class AutoMapperConfigProfile : Profile
    {
        public AutoMapperConfigProfile()
        {
            CreateMap<UserCreateDto, User>();
            CreateMap<UserUpdateDto, User>();
            CreateMap<UserUpdateByAdminDto, User>().ReverseMap();
            CreateMap<User, UserReadDto>();
            CreateMap<User, SellerTicketReadDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Fullname, opt => opt.MapFrom(src => src.Fullname));
            CreateMap<SellerRegisterDto, User>()
                .ForMember(dest => dest.Username, opt => opt.Ignore())
                .ForMember(dest => dest.Password, opt => opt.Ignore());
            CreateMap<User, BuyerOrderReadDto>();
            

            //Rating
            CreateMap<Rating, RatingReadDto>();
            CreateMap<RatingCreateDto, Rating>();
            CreateMap<RatingUpdateDto, Rating>();

            //Chatbox
            CreateMap<Chatbox, ChatboxReadDto>();
            CreateMap<ChatboxReadDto, Chatbox>();
            CreateMap<ChatboxCreateDto, Chatbox>();
            CreateMap<ChatboxUpdateStatusDto, Chatbox>();


            //Revenue
            CreateMap<RevenueCreateDto, Revenue>();
            CreateMap<Revenue, RevenueReadDto>();
            CreateMap<RevenueUpdateDto, Revenue>();

            //SQL
            CreateMap<Order, OrderDto>();
            CreateMap<OrderDto, Order>();
            CreateMap<CartItemDto, OrderDetailDto>();
            CreateMap<Order, OrderTransactionDto>()
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.user, opt => opt.MapFrom(src => src.Buyer));
            CreateMap<Order, OrderBuyerDto>();

            //OrderDetail
            CreateMap<VirtualOrderDetailDto, OrderDetail>();
            CreateMap<OrderDetailDto, OrderDetail>();
            CreateMap<OrderDetail, OrderDetailDto>();
            CreateMap<OrderDetail, VirtualOrderDetailDto>();
            CreateMap<OrderDetail, OrderDetailTransactionDto>()
                .ForMember(dest => dest.OrderDetailId, opt => opt.MapFrom(src => src.OrderDetailId))
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Ticket, opt => opt.MapFrom(src => src.Ticket))
                .ForMember(dest => dest.order, opt => opt.MapFrom(src => src.Order));


            //Chat
            CreateMap<Chat, ChatReadDto>();
            CreateMap<ChatReadDto, Chat>();
            CreateMap<ChatboxReadDto, Chatbox>();
            CreateMap<Chatbox, ChatboxReadDto>();
            
            //Cart
            CreateMap<Order, CartDto>();

            CreateMap<SellConfigCreateDto, SellConfig>();
            CreateMap<SellConfig, SellConfigReadDto>();
            CreateMap<SellConfigUpdateDto, SellConfig>();
            CreateMap<RoleCreateDto, Role>();
            CreateMap<Role, RoleReadDto>();
            CreateMap<RoleUpdateDto, Role>();
            //Ticket
            CreateMap<TicketCreateDto, Ticket>();
            CreateMap<Ticket, TicketReadDto>();
            CreateMap<Ticket, TicketTopDto>();
            CreateMap<TicketUpdateDto, Ticket>();
            CreateMap<TicketQrDto, Ticket>()
                .ForMember(dest => dest.Qr, opt => opt.Ignore());
            CreateMap<Ticket, TicketTransactionDto>();

            //Category
            CreateMap<CategoryCreateDto, Category>();
            CreateMap<Category, CategoryReadDto>();
            CreateMap<CategoryUpdateDto, Category>();
            CreateMap<Category, TicketReadDto>();

            //Authentication
            CreateMap<LoginDto, User>();
            CreateMap<RegisterDto, User>();
        }
    }
}