using System.ComponentModel.DataAnnotations;

namespace MovieApp.DTOs;

public class RatingDto
{
    [Range(1, 10)]
    public int Value { get; set; }
}