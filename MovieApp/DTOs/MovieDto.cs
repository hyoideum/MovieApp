namespace MovieApp.DTOs;

public class MovieDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public int Year { get; set; }
    public double AverageRating { get; set; }
    public List<int> Ratings { get; set; } = new();
    public int? UserRating { get; set; }
}