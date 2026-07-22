

function mapMovieData(movieData, creditsData) {
  const director = creditsData.crew.find((member) => member.job === "Director");

  const topCast = creditsData.cast.slice(0, 5).map((actor) => actor.name);

  return {
    tmdbId: movieData.id,
    title: movieData.title,
    overview: movieData.overview,
    posterUrl: movieData.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
      : null,
    backdropUrl: movieData.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
      : null,
    genres: movieData.genres.map((genre) => genre.name),
    releaseDate: movieData.release_date,
    runtime: movieData.runtime,
    director: director ? director.name : null,
    cast: topCast,
  };
}

export default mapMovieData;
