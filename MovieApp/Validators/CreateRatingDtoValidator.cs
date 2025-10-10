using FluentValidation;
using FluentValidation.AspNetCore;
using MovieApp.DTOs;

namespace MovieApp.Validators;

public class CreateRatingDtoValidator : AbstractValidator<RatingDto>
{
    public CreateRatingDtoValidator()
    {
        RuleFor(r => r.Value)
            .NotEmpty().WithMessage("Value is required")
            .InclusiveBetween(1, 10).WithMessage("Value must be between 1 and 10");
    }
}