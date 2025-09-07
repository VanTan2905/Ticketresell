using FluentValidation;
using Repositories.Core.Entities;

namespace Repositories.Core.Validators;

public class UserValidator : Validators<User>
{
    public UserValidator()
    {
        AddRequired(user => user.UserId);
        AddRequired(user => user.Username);
        AddEmailAddress(user => user.Gmail);

        RuleFor(user => user.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.")
            .Matches("[0-9]").WithMessage("Password must contain a number.");
    }
}