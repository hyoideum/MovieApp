using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MovieApp.Data;
using MovieApp.DTOs;
using MovieApp.Models;
using System.Security.Claims;

namespace MovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public MoviesController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    // GET: api/movies
    [HttpGet]
    public IActionResult GetMovies([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string sortBy = "title", [FromQuery] string sortOrder = "asc")
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        
        var query = _context.Movies
            .Include(m => m.Ratings)
            .AsQueryable();
        
        query = sortBy.ToLower() switch
        {
            "year" => sortOrder == "desc"
                ? query.OrderByDescending(m => m.Year)
                : query.OrderBy(m => m.Year),

            "rating" => sortOrder == "desc"
                ? query.OrderByDescending(m => m.Ratings.Any() ? m.Ratings.Average(r => r.Value) : 0)
                : query.OrderBy(m => m.Ratings.Any() ? m.Ratings.Average(r => r.Value) : 0),

            "title" => sortOrder == "desc"
                ? query.OrderByDescending(m => m.Title)
                : query.OrderBy(m => m.Title),

            _ => query.OrderBy(m => m.Title)
        };

        var totalCount = query.Count();
        
        var movies = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var moviesDto = _mapper.Map<List<MovieDto>>(movies);

        var result = new PagedResultDto<MovieDto>
        {
            Items = moviesDto,
            TotalCount = totalCount
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public IActionResult GetMovie(int id)
    {
        var movie = _context.Movies
            .Include(movie => movie.Ratings)
            .FirstOrDefault(m => m.Id == id);
        
        if (movie == null)
            return NotFound();
        
        var movieDto = _mapper.Map<MovieDto>(movie);
        return Ok(movieDto);
    }
    
    [HttpPost]
    [Authorize]
    public IActionResult PostMovie([FromBody] CreateMovieDto createMovie)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var movie = _mapper.Map<Movie>(createMovie);
        _context.Movies.Add(movie);
        _context.SaveChanges();
        
        var movieDto = _mapper.Map<MovieDto>(movie);
        return CreatedAtAction(nameof(GetMovies), new { id= movie.Id }, movieDto);
    }

    [HttpPost("{id}/ratings")]
    [Authorize]
    public IActionResult PostRating(int id, RatingDto ratingDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();
        
        var userId = int.Parse(userIdClaim.Value);

        var movie = _context.Movies.Include(movie => movie.Ratings).FirstOrDefault(m => m.Id == id);
        if (movie == null)
            return NotFound();
        
        var existingRating = movie.Ratings.FirstOrDefault(r => r.UserId == userId);
        if (existingRating != null)
        {
            return BadRequest("Već ste ocijenili ovaj film.");
        }
        
        var rating = _mapper.Map<Rating>(ratingDto);
        rating.MovieId = movie.Id;
        rating.UserId = userId;
        
        _context.Ratings.Add(rating);
        _context.SaveChanges();
        
        // movie = _context.Movies
        //     .Include(m => m.Ratings)
        //     .FirstOrDefault(m => m.Id == id);
        
        var movieDto = _mapper.Map<MovieDto>(movie);
        return Ok(movieDto);
    }
}