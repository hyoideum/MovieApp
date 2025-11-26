using System.Text;
using Microsoft.AspNetCore.Mvc;
using MovieApp.Data;
using MovieApp.DTOs;
using MovieApp.Models;
using MovieApp.Services;
using MovieApp.Enums;

namespace MovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] UserDto.RegisterDto dto)
    {
        var user = await authService.RegisterAsync(dto);
        if (user == null)
            return BadRequest("Username already exists");

        return Ok(new { message = "Registration successful" });
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserDto.LoginDto dto)
    {
        var token = await authService.LoginAsync(dto);
        if (token == null)
            return Unauthorized("Invalid credentials");

        return Ok(new { token });
    }
    
}