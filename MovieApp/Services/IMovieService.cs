using MovieApp.DTOs;

namespace MovieApp.Services;

public interface IMovieService
{
    Task<PagedResultDto<MovieDto>> GetMoviesAsync(int page, int pageSize, string sortBy, string sortOrder, int? userId);
    Task<MovieDto?> GetMovieByIdAsync(int id);
    Task<MovieDto> CreateMovieAsync(CreateMovieDto createMovie);
    Task<MovieDto?> RateMovieAsync(int movieId, int ratingValue, int userId);
}