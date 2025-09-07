using System;
using System.Collections.Generic;

namespace Repositories.Core.Entities;

public partial class Role
{
    public string RoleId { get; set; } = null!;

    public string? Rolename { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
