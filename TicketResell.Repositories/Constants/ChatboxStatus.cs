using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Constants
{
    public enum ChatboxStatus
    {
        Closed = 0,
        Requesting = 1,
        Accepted = 2,
        Blocking = 3,
        NonSuitReport = 4,
        ViolenceReport = 5,
        OverpriceReport = 6,
        FakeTicketReport = 7,
        Rejected = 8,
    }
}