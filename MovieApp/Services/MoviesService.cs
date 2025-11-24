using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using MovieApp.DTOs;
using MovieApp.Models;
using MovieApp.Repositories;

namespace MovieApp.Services;

public class MoviesService(IMovieRepository repo, IMapper mapper) : IMovieService
{
    public async Task<PagedResultDto<MovieDto>> GetMoviesAsync(int page, int pageSize, string sortBy, string sortOrder, int? userId)
    {
        
        var data = await repo.GetPagedMoviesAsync(page, pageSize, sortBy, sortOrder);

        var dtoList = mapper.Map<List<MovieDto>>(data.Items);

        foreach (var movieDto in dtoList)
        {
            var movie = data.Items.First(m => m.Id == movieDto.Id);

            movieDto.AverageRating = CalculateAverageRating(movie);

            movieDto.UserRating = GetUserRating(movie, userId);
        }

        var result = new PagedResultDto<MovieDto>
        {
            Items = dtoList,
            TotalCount = data.TotalCount,
            PageSize = pageSize,
            CurrentPage = page
        };
            
        return result;
    }

    public async Task<MovieDto?> GetMovieByIdAsync(int id)
    {
        var movie = await repo.GetByIdWithRatingsAsync(id);
        if (movie == null) return null;

        var dto = mapper.Map<MovieDto>(movie);

        dto.AverageRating = CalculateAverageRating(movie);

        return dto;
    }

    public async Task<MovieDto> CreateMovieAsync(CreateMovieDto createMovie)
    {
        var movie = mapper.Map<Movie>(createMovie);
        await repo.AddMovieAsync(movie);
        await repo.SaveChangesAsync();

        var dto = mapper.Map<MovieDto>(movie);
        dto.AverageRating = 0;
        return dto;
    }

    public async Task<MovieDto?> RateMovieAsync(int movieId, int ratingValue, int userId)
    {
        var movie = await repo.GetByIdWithRatingsAsync(movieId);
        if (movie == null) return null;

        var existing = movie.Ratings.FirstOrDefault(r => r.UserId == userId);

        if (existing != null)
        {
            existing.Value = ratingValue;
        }
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
        

        var dto = mapper.Map<MovieDto>(movie);

        dto.AverageRating = CalculateAverageRating(movie);

        dto.UserRating = GetUserRating(movie, userId);

        return dto;
    }
    
    private double CalculateAverageRating(Movie movie) =>
        movie.Ratings.Any() ? Math.Round(movie.Ratings.Average(r => r.Value), 2) : 0;
    
    private int? GetUserRating(Movie movie, int? userId) =>
        userId != null ? movie.Ratings.FirstOrDefault(r => r.UserId == userId)?.Value : null;
    
}


