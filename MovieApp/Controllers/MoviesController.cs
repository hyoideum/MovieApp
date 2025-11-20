using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MovieApp.Data;
using MovieApp.DTOs;
using MovieApp.Models;
using System.Security.Claims;
using MovieApp.Services;

namespace MovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _service;

    public MoviesController(IMovieService service)
    {
        _service = service;
    }

    // GET: api/movies
    [HttpGet]
    public async Task<IActionResult> GetMovies([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string sortBy = "title", [FromQuery] string sortOrder = "asc")
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userId = int.TryParse(userIdString, out var id) ? id : 0;
        
        var result = await _service.GetMoviesAsync(page, pageSize, sortBy, sortOrder, userId);
        
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMovie(int id)
    {
        var result = await _service.GetMovieByIdAsync(id);
        
        return Ok(result);
    }
    
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> PostMovie([FromBody] CreateMovieDto createMovie)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var movie = await _service.CreateMovieAsync(createMovie);
        return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
    }

    [HttpPost("{id}/ratings")]
    [Authorize]
    public async Task<IActionResult> PostRating(int id, RatingDto ratingDto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userId = int.TryParse(userIdString, out var uid) ? uid : 0;
        
        var result = await  _service.RateMovieAsync(id, ratingDto.Value, userId);
        
        return Ok(result);
    }
}