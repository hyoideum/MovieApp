using MovieApp.DTOs;
using MovieApp.Models;

namespace MovieApp.Repositories;

public interface IMovieRepository
{
    Task<Movie?> GetByIdWithRatingsAsync(int id);
    Task<PagedResultDto<Movie>> GetPagedMoviesAsync(int page, int pageSize, string sortBy, string sortOrder);
    Task AddRatingAsync(Rating rating);
    Task SaveChangesAsync();
    Task AddMovieAsync(Movie movie);
}