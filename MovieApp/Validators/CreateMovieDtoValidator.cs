using System.Data;
using FluentValidation;
using MovieApp.DTOs;

namespace MovieApp.Validators;

public class CreateMovieDtoValidator : AbstractValidator<CreateMovieDto>
{
    public CreateMovieDtoValidator()
    {
        var currentYear = DateTime.Now.Year;
        
        RuleFor(m => m.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title must not exceed 100 characters");

        RuleFor(m => m.Genre)
            .NotEmpty().WithMessage("Genre is required");

        RuleFor(m => m.Year)
            .NotEmpty().WithMessage("Year is required")
            .InclusiveBetween(1900, currentYear)
            .WithMessage($"Release year must be between 1900 and {currentYear}");
    }
}


   
