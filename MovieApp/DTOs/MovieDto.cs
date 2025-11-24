namespace MovieApp.DTOs;

public class MovieDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public int Year { get; set; }
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }
    public int? UserRating { get; set; }
}