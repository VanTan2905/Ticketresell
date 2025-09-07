using TicketResell.Repositories.Constants;

namespace TicketResell.Repositories.Core.Helper
{
    public static class ReportHelper
    {
        public static string GetStatusString(int status)
        {
            return status switch
            {
                (int)ChatboxStatus.Requesting => "Đã gửi yêu cầu",
                (int)ChatboxStatus.Accepted => "Đã được chấp nhận",
                (int)ChatboxStatus.Blocking => "Đã khóa hộp thoại",
                (int)ChatboxStatus.NonSuitReport => "Không phù hợp",
                (int)ChatboxStatus.OverpriceReport => "Giá không phù hợp",
                (int)ChatboxStatus.ViolenceReport => "Nội dung bạo lực",
                (int)ChatboxStatus.FakeTicketReport => "Lừa đảo",
                (int)ChatboxStatus.Closed => "Đã hoàn tất",
                _ => "Unknown"
            };
        }
    }
}