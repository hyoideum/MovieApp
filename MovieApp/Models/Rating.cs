namespace MovieApp.Models;

public class Rating
{
    public int Id { get; set; }
    public int Value { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = null!;
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}