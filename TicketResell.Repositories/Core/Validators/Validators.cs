using System.Linq.Expressions;
using FluentValidation;

namespace Repositories.Core.Validators;

public class Validators<T> : AbstractValidator<T>
{
    public IRuleBuilderOptions<T, TProperty> AddNotNull<TProperty>(Expression<Func<T, TProperty>> expression,
        string message = "This field is required.")
    {
        return RuleFor(expression).NotNull().WithMessage(message);
    }

    public IRuleBuilderOptions<T, TProperty> AddRequired<TProperty>(Expression<Func<T, TProperty>> expression,
        string message = "This field cannot empty.")
    {
        return AddNotNull(expression).NotEmpty().WithMessage(message);
    }

    public IRuleBuilderOptions<T, string> AddEmailAddress(Expression<Func<T, string?>> expression,
        string message = "Invalid email address.")
    {
        return AddRequired(expression).EmailAddress().WithMessage(message);
    }

    public IRuleBuilderOptions<T, string> AddMinimumLength(Expression<Func<T, string?>> expression,
        int minLength, string? message = null)
    {
        message = message ?? $"Minimum length of {minLength} is required.";
        return AddRequired(expression).MinimumLength(minLength).WithMessage(message);
    }

    public IRuleBuilderOptions<T, string> AddMatches(Expression<Func<T, string?>> expression, string pattern,
        string message = "The field does not match the required pattern.")
    {
        return AddRequired(expression).Matches(pattern).WithMessage(message);
    }

    public IRuleBuilderOptions<T, string> AddMaximumLength(Expression<Func<T, string?>> expression,
        int maxLength, string? message = null)
    {
        message = message ?? $"Maximum length of {maxLength} is allowed.";
        return AddRequired(expression).MaximumLength(maxLength).WithMessage(message);
    }

    public IRuleBuilderOptions<T, TProperty> AddInclusiveBetween<TProperty>(Expression<Func<T, TProperty>> expression,
        TProperty from, TProperty to, string? message = null)
        where TProperty : struct, IComparable<TProperty>, IComparable
    {
        message = message ?? $"The value must be between {from} and {to}.";
        return AddRequired(expression).InclusiveBetween(from, to).WithMessage(message);
    }

    public IRuleBuilderOptions<T, TProperty> AddGreaterThan<TProperty>(Expression<Func<T, TProperty>> expression,
        TProperty value, string? message = null)
        where TProperty : struct, IComparable<TProperty>, IComparable
    {
        message = message ?? $"The value must be greater than {value}.";
        return AddRequired(expression).GreaterThan(value).WithMessage(message);
    }

    public IRuleBuilderOptions<T, TProperty?> AddEqualOrGreaterThan<TProperty>(
        Expression<Func<T, TProperty?>> expression,
        TProperty value, string? message = null)
        where TProperty : struct, IComparable<TProperty>, IComparable
    {
        message = message ?? $"The value must be equal or greater than {value}.";
        return AddRequired(expression).GreaterThanOrEqualTo(value).WithMessage(message);
    }

    public IRuleBuilderOptions<T, TProperty?> AddLessThan<TProperty>(Expression<Func<T, TProperty?>> expression,
        TProperty value, string? message = null)
        where TProperty : struct, IComparable<TProperty>, IComparable
    {
        message = message ?? $"The value must be less than {value}.";
        return AddRequired(expression).LessThan(value).WithMessage(message);
    }

    public IRuleBuilderOptions<T, TProperty?> AddEqualOrLessThan<TProperty>(Expression<Func<T, TProperty?>> expression,
        TProperty value, string? message = null)
        where TProperty : struct, IComparable<TProperty>, IComparable
    {
        message = message ?? $"The value must be equal or less than {value}.";
        return AddRequired(expression).LessThanOrEqualTo(value).WithMessage(message);
    }

    public IRuleBuilderOptions<T, TProperty?> AddEqual<TProperty>(Expression<Func<T, TProperty?>> expression,
        TProperty value, string? message = null)
        where TProperty : struct, IComparable<TProperty>, IComparable
    {
        message = message ?? $"The value must be equal to {value}.";
        return AddRequired(expression).Equal(value).WithMessage(message);
    }

    public IRuleBuilderOptions<T, TProperty?> AddNotEqual<TProperty>(Expression<Func<T, TProperty?>> expression,
        TProperty value, string? message = null)
        where TProperty : struct, IComparable<TProperty>, IComparable
    {
        message = message ?? $"The value must not be equal to {value}.";
        return AddRequired(expression).NotEqual(value).WithMessage(message);
    }
}