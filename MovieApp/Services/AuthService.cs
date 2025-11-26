using System.Text;
using Microsoft.EntityFrameworkCore;
using MovieApp.Data;
using MovieApp.DTOs;
using MovieApp.Enums;
using MovieApp.Models;

namespace MovieApp.Services;

public class AuthService(AppDbContext context, TokenService tokenService) : IAuthService
{
    private readonly AppDbContext _context = context;
    private readonly TokenService _tokenService = tokenService;

    public async Task<User?> RegisterAsync(UserDto.RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            return null;
                
        CreatePasswordHash(dto.Password, out byte[] passwordHash, out byte[] passwordSalt);

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            Role = Role.User
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<string?> LoginAsync(UserDto.LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
        if (user == null || !VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt))
            return null;

        return _tokenService.GenerateToken(user);
    }
    
    private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
    {
        using var hmac =  new System.Security.Cryptography.HMACSHA512();
        salt = hmac.Key;    
        hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }
    
    private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
    {
        using var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computedHash.SequenceEqual(storedHash);
    }
}