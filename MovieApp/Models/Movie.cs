using System.ComponentModel.DataAnnotations;

namespace MovieApp.Models;

public class Movie
{
    public int Id { get; set; }
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Genre { get; set; } = string.Empty;
    public int Year { get; set; } 
    
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
}