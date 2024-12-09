// Tokens and keys
const apiKey = '2d9421d34e27b0950f7fb295d98ec028';
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDk0MjFkMzRlMjdiMDk1MGY3ZmIyOTVkOThlYzAyOCIsIm5iZiI6MTczMzcxMzE4OC40ODQsInN1YiI6IjY3NTY1ZDI0MDk4MmI0NjI2NzhhMWU1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pGWPwreBh9nlrlcSaA-ecjpA3uuoReyGLQn5FZ6HnDs';


// ------ TEST -------
console.log('connected');

const add = (num1,num2) => {
    return num1 + num2;
};

// Movie details
fetch(`https://api.themoviedb.org/3/movie/550`, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(movie => {
        console.log('Full Movie Details:', movie);
    })
    .catch(error => console.error('Error:', error));
// -------------------


// formatString function
const formatString = (string) => {
    return string.trim().replace(/\s+/g,'+');
};

// ------------- FORM -------------------------

const form = document.getElementById('movie-search-form');
const titleSearch = document.getElementById('title-search');

// Event Listener for the Form Submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log('Submit event triggered');

    // Check if the submitter is the search button
    const searchButton = document.getElementById('search-button');

    if (e.submitter !== searchButton) {
        console.log('Form submitted, but not via the search button.');
        return;
    }

    // Format user input
    const title = formatString(titleSearch.value);

    // Build the query URL
    let url = `https://api.themoviedb.org/3/search/movie?query=${title}`;
    
    try {
    // Fetch Movies
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
    console.log('Movies Data:', data.results);
    
    // Render Movie Cards
    const moviesContainer = document.getElementById('movies-container');
    moviesContainer.innerHTML = ''; // Clear previous results

    if (!data.results || data.results.length === 0) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    data.results.forEach((movie) => {
        // Create the main card container
        const card = document.createElement('div');
        card.classList.add('row', 'mb-4', 'border', 'rounded', 'p-3', 'bg-light');

        // Create the poster column
        const posterCol = document.createElement('div');
        posterCol.classList.add('col-md-4', 'd-flex', 'align-items-center', 'justify-content-center');
        const posterImg = document.createElement('img');
        posterImg.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image'; // Placeholder if no image
        posterImg.alt = `${movie.title} Poster`;
        posterImg.classList.add('img-fluid', 'rounded');
        posterCol.appendChild(posterImg);

        // Create the details column
        const detailsCol = document.createElement('div');
        detailsCol.classList.add('col-md-8');
        detailsCol.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Year Released:</strong> ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
            <p><strong>Genre:</strong> ${movie.genre_ids ? getGenres(movie.genre_ids).join(', ') : 'N/A'}</p>
            <p><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</p>
            <p><strong>Description:</strong> ${movie.overview || 'No description available.'}</p>
            <button class="btn btn-primary view-details" data-movie-id="${movie.id}">View Details</button>
            <button class="btn btn-secondary add-to-watchlist" data-movie-id="${movie.id}" data-movie-title="${movie.title}">Add to Watch List</button>
        `;

        // Append the columns to the card
        card.appendChild(posterCol);
        card.appendChild(detailsCol);

        // Append the card to the container
        moviesContainer.appendChild(card);
    });

        // Add event listeners to "Add to Watch List" buttons
        document.querySelectorAll('.add-to-watchlist').forEach((button) => {
            button.addEventListener('click', (e) => {
                const movieId = e.target.getAttribute('data-movie-id');
                const movieTitle = e.target.getAttribute('data-movie-title');
                addToWatchList(movieId, movieTitle);
            });
        });

    }
    catch (error) {
    console.error('Error fetching movies:', error);
    }
});


// ---------- Watch List ---------------------

// Add Movie to Watch List
const addToWatchList = (movieId, movieTitle) => {
    try {
        // Retrieve the existing watch list or initialize an empty array
        const watchList = JSON.parse(localStorage.getItem('watchList')) || [];

        // Add the new movie to the watch list
        const newMovie = { id: movieId, title: movieTitle };
        watchList.push(newMovie);

        // Save the updated watch list to localStorage
        localStorage.setItem('watchList', JSON.stringify(watchList));

        // Provide feedback to the user
        alert(`"${movieTitle}" has been added to your Watch List.`);
    } catch (error) {
        console.error('Error adding movie to Watch List:', error);
        alert('An error occurred while adding the movie to your Watch List. Please try again.');
    }
};

// Event listener for "View Watch List" button
document.getElementById('view-watchlist').addEventListener('click', (e) => {
    e.preventDefault();

    const watchListContainer = document.getElementById('movies-container');

    watchListContainer.innerHTML = '';

    // Retrieve watch list from localStorage
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

    // Add event listeners to "Remove" buttons
    document.querySelectorAll('.remove-from-watchlist').forEach((button) => {
        button.addEventListener('click', (e) => {
            const movieId = e.target.getAttribute('data-movie-id');
            removeFromWatchList(movieId);
        });
    });

    const removeFromWatchList = (movieId) => {
        const watchList = JSON.parse(localStorage.getItem('watchList')) || [];
        const updatedWatchList = watchList.filter((movie) => movie.id !== movieId); // Filters array and removes deleted movieID
        console.log(movieId);
        localStorage.setItem('watchList', JSON.stringify(updatedWatchList));
        document.getElementById('view-watchlist').click(); // Opens watch list after deleting one movie
    };
});

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
