using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MovieApp.Data;
using MovieApp.DTOs;
using MovieApp.Models;

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
    public IActionResult GetMovies()
    {
        var movies = _context.Movies
            .Include(movie => movie.Ratings)
            .ToList();
        var moviesDto = _mapper.Map<List<MovieDto>>(movies);
        return Ok(moviesDto);
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
    public IActionResult PostMovie(MovieDto createMovie)
    {
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
        var movie = _context.Movies.Include(movie => movie.Ratings).FirstOrDefault(m => m.Id == id);
        if (movie == null)
            return NotFound();
        
        var rating = _mapper.Map<Rating>(ratingDto);
        rating.MovieId = movie.Id;
        
        _context.Ratings.Add(rating);
        _context.SaveChanges();
        
        var average = movie.Ratings.Average(r =>  r.Value);
        
        var movieDto = _mapper.Map<MovieDto>(movie);
        return Ok(new {Movie = movieDto, AverageRating = average});
    }
}