using Microsoft.EntityFrameworkCore;
using MovieApp.Data;
using MovieApp.Models;
using MovieApp.Repositories.Models;

namespace MovieApp.Repositories;

public class MovieRepository(AppDbContext dbContext) : IMovieRepository
{
    private readonly AppDbContext _context = dbContext;

    public async Task<Movie?> GetByIdWithRatingsAsync(int id)
    {
        return await _context.Movies
            .Include(m => m.Ratings)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<PagedResult<Movie>> GetPagedMoviesAsync(int page, int pageSize, string sortBy, string sortOrder)
    {
        var query = _context.Movies.Include(m => m.Ratings).AsQueryable();

        query = sortBy.ToLower() switch
        {
            "year" => sortOrder == "desc" ? query.OrderByDescending(m => m.Year) : query.OrderBy(m => m.Year),
            "rating" => sortOrder == "desc"
                ? query.OrderByDescending(m => m.Ratings.Any() ? m.Ratings.Average(r => r.Value) : 0)
                : query.OrderBy(m => m.Ratings.Any() ? m.Ratings.Average(r => r.Value) : 0),
            "title" => sortOrder == "desc" ? query.OrderByDescending(m => m.Title) : query.OrderBy(m => m.Title),
            _ => query.OrderBy(m => m.Title)
        };

        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<Movie>
        {
            Items = items,
            TotalCount = total
        };
    }

    public async Task AddRatingAsync(Rating rating)
    {
        await _context.Ratings.AddAsync(rating);
    }

    public async Task AddMovieAsync(Movie movie)
    {
        await _context.Movies.AddAsync(movie);
    }
    
    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}