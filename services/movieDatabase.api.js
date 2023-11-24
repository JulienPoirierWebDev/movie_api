const requestOneMovieFromTMDBApi = async (id) => {
  try {
    const TOKEN = process.env.TMDB_TOKEN;
    const url = `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const request = await response.json();

    return request;
  } catch (error) {
    return { error: error.message };
  }
};

const requestSearchMovieFromTMDBApi = async (page, search) => {
  const TOKEN = process.env.TMDB_TOKEN;
  const urlPage = page ? page : 1;
  const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=fr-FR&page=${urlPage}&query=${search}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const response = await fetch(url, options);
  const request = await response.json();
  return request;
};

module.exports = {
  requestOneMovieFromTMDBApi,
  requestSearchMovieFromTMDBApi,
};
