using FluentValidation;

namespace Repositories.Core.Validators;

public interface IValidatorFactory
{
    IValidator<T> GetValidator<T>();
}