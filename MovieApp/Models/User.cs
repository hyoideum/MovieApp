using System.ComponentModel.DataAnnotations;
using MovieApp.Enums;

namespace MovieApp.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public byte[] PasswordHash { get; set; }
    [Required]
    public byte[] PasswordSalt { get; set; }
    public Role Role { get; set; } = Role.User;
}