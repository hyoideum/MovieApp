using System.ComponentModel.DataAnnotations;

namespace MovieApp.DTOs;

public class CreateMovieDto
{
    [Required, MaxLength(250)]
    public string Title { get; set; } = string.Empty;
    
    [Required, MaxLength(100)]
    public string Genre { get; set; } = string.Empty;
    
    [Range(1900, 2100)]
    public int Year { get; set; }
}