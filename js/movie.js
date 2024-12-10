// Tokens and keys
const apiKey = '2d9421d34e27b0950f7fb295d98ec028';
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDk0MjFkMzRlMjdiMDk1MGY3ZmIyOTVkOThlYzAyOCIsIm5iZiI6MTczMzcxMzE4OC40ODQsInN1YiI6IjY3NTY1ZDI0MDk4MmI0NjI2NzhhMWU1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pGWPwreBh9nlrlcSaA-ecjpA3uuoReyGLQn5FZ6HnDs';

const form = document.getElementById('movie-search-form');
const titleSearch = document.getElementById('title-search');

// // ------ TEST -------
console.log('connected');

const add = (num1,num2) => {
    return num1 + num2;
};

// const movieId = 929590;
// const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}`;

// const apiUrl = `https://api.themoviedb.org/3/discover/movie?with_companies=41077&sort_by=vote_average.desc&vote_count.gte=50&language=en-US`;

// fetch(apiUrl, {
//     method: 'GET',
//     headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//     },
// })
//     .then((response) => {
//         if (!response.ok) {
//             throw new Error(`HTTP error: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then((movieData) => {
//         console.log('Movie Data:', movieData);
//     })
//     .catch((error) => {
//         console.error('Error fetching movie data:', error);
//     });
// // -------------------

// ====================================================================
//                              MAPS
// ====================================================================


// ------------ Genre IDs to Names ----------------
const getGenres = (genreIds) => {
    const genreMap = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
    };

    return genreIds.map((id) => genreMap[id] || 'Unknown');
};

// ------------ Certification IDs to rating ----------------
const getCertification = (order) => certMap[order] ?? 'Unknown';
const certMap = {
    4: 'R',
    2: 'PG',
    5: 'NC-17',
    1: 'G',
    0: 'NR',
    3: 'PG-13'
};


// ====================================================================
//                              FUNCTIONS
// ====================================================================


// ------------------------ formatString function ------------------------
const formatString = (string) => {
    return string.trim().replace(/\s+/g,'+');
};


// ------------------------ renderMovieCard Function ------------------------
const renderMovieCard = (movie) => {
    // Create main card container
    const card = document.createElement('div');
    card.classList.add('row', 'mb-4', 'border', 'rounded', 'p-3', 'bg-light');

    // Create poster column
    const posterCol = document.createElement('div');
    posterCol.classList.add('col-md-4', 'd-flex', 'align-items-center', 'justify-content-center');
    const posterImg = document.createElement('img');
    posterImg.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : 'https://via.placeholder.com/200x300?text=No+Image'; // Placeholder image
    posterImg.alt = `${movie.title} Poster`;
    posterImg.classList.add('img-fluid', 'rounded');
    posterCol.appendChild(posterImg);

    // Create details column
    const detailsCol = document.createElement('div');
    detailsCol.classList.add('col-md-8');
    detailsCol.innerHTML = `
        <h3>${movie.title}</h3>
        <p><strong>Year Released:</strong> ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
        <p><strong>Genre:</strong> ${movie.genre_ids ? getGenres(movie.genre_ids).join(', ') : 'N/A'}</p>
        <p><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</p>
        <p><strong>Description:</strong> ${movie.overview || 'No description available.'}</p>
        <button class="btn btn-secondary add-to-watchlist" data-movie-id="${movie.id}" data-movie-title="${movie.title}">Add to Watch List</button>
    `;

    // Append columns to the card
    card.appendChild(posterCol);
    card.appendChild(detailsCol);

    return card;
};


// ------------------------ displayMovies Function ------------------------
const displayMovies = (movies) => {
    const moviesContainer = document.getElementById('movies-container');
    moviesContainer.innerHTML = ''; // Clear previous results

    if (!movies || movies.length === 0) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach((movie) => {
        const movieCard = renderMovieCard(movie);
        moviesContainer.appendChild(movieCard);
    });

    // Add event listeners to "add to watch list" buttons
    document.querySelectorAll('.add-to-watchlist').forEach((button) => {
        button.addEventListener('click', (e) => {
            const movieId = e.target.getAttribute('data-movie-id');
            const movieTitle = e.target.getAttribute('data-movie-title');
            addToWatchList(movieId, movieTitle);
        });
    });
};

// ------------------------ Popup ------------------------
setTimeout(() => {
    const popup = document.getElementById('popup');
    popup.style.display = 'flex'; // Center
}, 3000);

// Close the popup
document.getElementById('close-popup').addEventListener('click', () => {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
});


// ====================================================================
//                              FORMS
// ====================================================================


// ------------- SEARCH FORM -------------------------

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    //if (e.submitter !== document.getElementById('search-button')) return;

    const title = formatString(titleSearch.value);
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        displayMovies(data.results);
        console.log(data);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
});



// ====================================================================
//                              WATCH LIST
// ====================================================================


// ------------- Add Movie to Watch List ------------------
const addToWatchList = (movieId, movieTitle) => {
    try {
        // Get watch list
        const watchList = JSON.parse(localStorage.getItem('watchList')) || [];

        // Add movie to watch list
        const newMovie = { id: movieId, title: movieTitle };
        watchList.push(newMovie);

        // Save updated watch list to localStorage
        localStorage.setItem('watchList', JSON.stringify(watchList));

        alert(`"${movieTitle}" has been added to your Watch List.`);
    } catch (error) {
        console.error('Error adding movie to Watch List:', error);
        alert('An error occurred while adding the movie to your Watch List. Please try again.');
    }
};

// Event listener for "view watch list" button
document.getElementById('view-watchlist').addEventListener('click', (e) => {
    e.preventDefault();

    const watchListContainer = document.getElementById('movies-container');

    watchListContainer.innerHTML = '';

    // get watch list from localStorage
    const watchList = JSON.parse(localStorage.getItem('watchList')) || [];

    if (watchList.length === 0) {
        watchListContainer.innerHTML = '<p>Your Watch List is empty.</p>';
        return;
    }

    watchList.forEach((movie) => {
        const movieRow = document.createElement('div');
        movieRow.classList.add('row', 'mb-3', 'p-2', 'bg-light', 'rounded', 'border');
        movieRow.innerHTML = `
            <div class="col-12 d-flex justify-content-between align-items-center">
                <h5>${movie.title}</h5>
                <button class="btn btn-danger remove-from-watchlist" data-movie-id="${movie.id}">Remove</button>
            </div>
        `;
        watchListContainer.appendChild(movieRow);
    });

    // Add event listeners to "remove" buttons
    document.querySelectorAll('.remove-from-watchlist').forEach((button) => {
        button.addEventListener('click', (e) => {
            const movieId = e.target.getAttribute('data-movie-id');
            removeFromWatchList(movieId);
        });
    });

    const removeFromWatchList = (movieId) => {
        const updatedWatchList = watchList.filter((movie) => movie.id !== movieId); // Filters array and removes deleted movieID
        console.log(movieId);
        localStorage.setItem('watchList', JSON.stringify(updatedWatchList));
        document.getElementById('view-watchlist').click(); // Opens watch list after deleting one movie
    };
});

// ====================================================================
//                              BROWSE BAR
// ====================================================================

// BROWSE BY GENRE

document.querySelectorAll('.browse-genre').forEach((link) => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();

        const genreId = e.target.getAttribute('data-genre');

        const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&language=en-US`;

        try {
            // Fetch movies for the selected genre
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Make sure accessToken is defined
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Movies for Genre ${genreId}:`, data.results);

            // Display the movies
            displayMovies(data.results);
        } catch (error) {
            console.error(`Error fetching movies for genre ${genreId}:`, error);
        }
    });
});

// BROWSE BY TOP RATED

document.querySelectorAll('.browse-top-rated').forEach((link) => {
    link.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default link behavior

        const type = e.target.getAttribute('data-type');
        let url;

        // Determine the URL based on the type
        if (type === 'trending') {
            url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
        } else if (type === 'all-time-highest') {
            url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US';
        } else if (type === 'best-a24') {
            url = `https://api.themoviedb.org/3/discover/movie?with_companies=41077&sort_by=vote_average.desc&vote_count.gte=50&language=en-US`;
        } else {
            console.log(`No handler defined for type: ${type}`);
            return;
        }

        try {
            // Fetch movies from the URL
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            console.log(`${type} Movies Data:`, data.results);

            // Display the movies
            displayMovies(data.results);
        } catch (error) {
            console.error(`Error fetching ${type} movies:`, error);
        }
    });
});


// BROWSE BY YEAR

document.querySelectorAll('.browse-year').forEach((link) => {
    link.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default link behavior

        // Get the year or category from the clicked link
        const year = e.target.getAttribute('data-year');
        let url;

        // API URL based on the selection
        if (year === 'soon-to-theaters') {
            url = `https://api.themoviedb.org/3/movie/upcoming?language=en-US`;
        } else {
            url = `https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&sort_by=popularity.desc&language=en-US`;
        }

        try {

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Movies for Year/Category "${year}":`, data.results);

            // Display the movies
            displayMovies(data.results);
        } catch (error) {
            console.error(`Error fetching movies for year/category "${year}":`, error);
        }
    });
});