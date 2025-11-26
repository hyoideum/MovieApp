using MovieApp.DTOs;
using MovieApp.Models;

namespace MovieApp.Services;

public interface IAuthService
{
    Task<User?> RegisterAsync(UserDto.RegisterDto dto);
    Task<string?> LoginAsync(UserDto.LoginDto dto);
}