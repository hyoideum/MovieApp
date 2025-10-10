using System.Text;
using Microsoft.AspNetCore.Mvc;
using MovieApp.Data;
using MovieApp.DTOs;
using MovieApp.Models;
using MovieApp.Services;

namespace MovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, IConfiguration configuration, TokenService tokenService)
    {
        _context = context;
        _configuration = configuration;
        _tokenService = tokenService;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] UserDto.RegisterDto dto)
    {
        if (_context.Users.Any(u => u.Username == dto.Username))
        {
            return BadRequest("Username already exists");
        }
        
        CreatePasswordHash(dto.Password, out byte[] passwordHash, out byte[] passwordSalt);

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            UserRole = Models.User.Role.User
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered.");
    }
    
    [HttpPost("login")]
    public IActionResult Login(UserDto.LoginDto dto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == dto.Username);
        if (user == null || !VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized("Invalid credentials.");

        var token = _tokenService.GenerateToken(user);

        return Ok(new { token });
    }
    
    //Helpers
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