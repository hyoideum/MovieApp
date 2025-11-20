using AutoMapper;
using MovieApp.DTOs;
using MovieApp.Models;
using MovieApp.Repositories;

namespace MovieApp.Services;

public class MoviesService(IMovieRepository repo, IMapper mapper) : IMovieService
{
    public async Task<PagedResultDto<MovieDto>> GetMoviesAsync(int page, int pageSize, string sortBy, string sortOrder, int? userId)
    {
        var data = await repo.GetPagedMoviesAsync(page, pageSize, sortBy, sortOrder);
        var dto = mapper.Map<List<MovieDto>>(data.Items);

        if (userId != null)
        {
            foreach (var movieDto in dto)
            {
                var movie = data.Items.First(m => m.Id == movieDto.Id);
                var rating = movie.Ratings.FirstOrDefault(r => r.UserId == userId);
                movieDto.UserRating = rating?.Value;
            }
        }

        return new PagedResultDto<MovieDto>
        {
            Items = dto,
            TotalCount = data.TotalCount
        };
    }

    public async Task<MovieDto?> GetMovieByIdAsync(int id)
    {
        var movie = await repo.GetByIdWithRatingsAsync(id);
        return movie == null ? null : mapper.Map<MovieDto>(movie);
    }

    public async Task<MovieDto> CreateMovieAsync(CreateMovieDto createMovie)
    {
        var movie = mapper.Map<Movie>(createMovie);
        await repo.AddMovieAsync(movie);
        await repo.SaveChangesAsync();
        return mapper.Map<MovieDto>(movie);
    }

    public async Task<MovieDto?> RateMovieAsync(int movieId, int ratingValue, int userId)
    {
        var movie = await repo.GetByIdWithRatingsAsync(movieId);
        if (movie == null) return null;

        var existing = movie.Ratings.FirstOrDefault(r => r.UserId == userId);
        if (existing != null)
            existing.Value = ratingValue;
        else
        {
            var rating = new Rating
            {
                MovieId = movieId,
                UserId = userId,
                Value = ratingValue
            };
            await repo.AddRatingAsync(rating);
        }

        await repo.SaveChangesAsync();
        return mapper.Map<MovieDto>(movie);
    }
}