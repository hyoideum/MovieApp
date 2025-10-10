using System.ComponentModel.DataAnnotations;

namespace MovieApp.Models;

public class User
{
    public enum Role
    {
        User,
        Admin,
        Moderator,
        Guest
    }
    
    public int Id { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public byte[] PasswordHash { get; set; }
    [Required]
    public byte[] PasswordSalt { get; set; }
    public Role UserRole { get; set; } = Role.User;
}