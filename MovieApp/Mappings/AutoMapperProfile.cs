using AutoMapper;
using MovieApp.DTOs;
using MovieApp.Models;

namespace MovieApp.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Movie -> MovieDto
        CreateMap<Movie, MovieDto>()
            .ForMember(d => d.AverageRating,
                o => o.MapFrom(m =>
                    m.Ratings.Count != 0 
                        ? m.Ratings.Average(r => r.Value) 
                        : 0))
            .ForMember(d => d.RatingCount,
                o => o.MapFrom(m => m.Ratings.Count))
            .ForMember(d => d.UserRating,
                o => o.Ignore());

        CreateMap<MovieDto, Movie>()
            .ForMember(dest => dest.Ratings, opt => opt.Ignore());

        CreateMap<Movie, CreateMovieDto>();
        
        CreateMap<CreateMovieDto, Movie>();
        
        CreateMap<Rating, RatingDto>().ReverseMap();
    }
}
