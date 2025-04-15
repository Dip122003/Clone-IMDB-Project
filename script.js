// Search API Link: http://www.omdbapi.com/?s=spiderman&apikey=94397865
// Details API Link: http://www.omdbapi.com/?i=tt2705436&apikey=94397865

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const searchBtn = document.querySelector('.search-btn');
const resultGrid = document.getElementById('result-flex');

// load movies from API Async
async function loadMovies(searchTerm){
    await fetch(`https://omdbapi.com/?s=${searchTerm}&page=1&apikey=94397865`)
        .then((response) => response.json())
        .then((data) => {
            if(data.Response == "True")  displayMovieList(data.Search);
        });
}

function searchBoxBoderTrigger() {
    if(movieSearchBox.value.length > 0) {
        movieSearchBox.style.borderBottomLeftRadius = "0px";
        searchBtn.style.borderBottomRightRadius = "0px";    
    } else {
        movieSearchBox.style.borderBottomLeftRadius = "25px";
        searchBtn.style.borderBottomRightRadius = "25px";
    }
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchBoxBoderTrigger();
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.poster = movies[idx].Poster;
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        
        // Hits another API where Actors working in the film are stored
        fetch(`http://www.omdbapi.com/?i=${movies[idx].imdbID}&apikey=94397865`)
        .then((response) => response.json())
        .then((data) => {
            if(movies[idx].Poster != "N/A")
                moviePoster = movies[idx].Poster;
            else 
                moviePoster = "notfound.png";
                
            movieListItem.innerHTML = `
                <div class = "search-item-thumbnail shadow-md">
                    <img class="rounded" src = "${moviePoster}">
                </div>
                <div class = "search-item-info" onclick="info()">
                    <h3>${movies[idx].Title}</h3>
                    <p>${movies[idx].Year}</p>
                    <p>${data.Actors}</p>
                </div>
                <p class="heart" onclick="fav(this)"><i class="fa-solid fa-heart text-2xl"></i></p>
                `;
            });
        searchList.appendChild(movieListItem);
    }
}

function info() {
    console.log('clicked info');
    resetBar();
    loadMovieDetails();
    searchList.classList.add('hide-search-list');
}

function fav(data) {
    console.log('clicked fav');
    // console.log(data.parentNode.dataset.poster); very important thing learned
    makeFavList(data.parentNode.dataset.poster);
}

let isEntering = false;

function favButtonStyle() {
    if(isEntering) {
        document.querySelector('.footer').style.backgroundColor = "transparent";
        document.querySelector('.footer').style.border = "1px solid white";
        document.querySelector('.footer').style.borderRadius = "7px";
        document.querySelector('.footer').style.opacity = "0.5";
    }
    else {
        document.querySelector('.footer').style.backgroundColor = "black";
        document.querySelector('.footer').style.opacity = "1";
        document.querySelector('.footer').style.border = "none";
    }
}

function enterFavPage() {
    console.log(isEntering);
    if(isEntering) {
        favButtonStyle();
        isEntering = false;
        exitFavPage();
    }
    else {
        favButtonStyle();
        isEntering = true;
        showFavList();
    }
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', () => {
            fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=94397865`)
            .then((response) => response.json())
            .then((data) => {
                document.querySelector('.nav-brand-logo').style.display = "flex";
                document.querySelector('.settings').style.display = "none";
                document.querySelector('.searchbar-logo').style.display = "none";
                displayMovieDetails(data);
            });
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div id = "movie-image">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "notfound.png"}" alt = "movie poster" class="rounded shadow-2xl">
    </div>
    <div id = "movie-info">
        <h1 class = "movie-title">${details.Title}</h1>
	  <p>Year: ${details.Year} &nbsp;<span class=" bg-yellow-500 p-1 rounded">Rating: ${details.Rated}</span> &nbsp;Released: ${details.Released}</p>
	  <p class="rounded shadow-md bg-zinc-700 p-1.5 w-fit"><span>Genere:</span> ${details.Genre}</p>
	  <p><span>Writer:</span> ${details.Writer}</p>
	  <p><span>Actors:</span> ${details.Actors}</p>
        <p><span>Plot:</span> ${details.Plot}</p>
	  <p class="italic mv-lang"><span>Language: </span>${details.Language}</p>
	  <p><span><i class="fa-solid fa-award"></i></span>&nbsp;&nbsp;  ${details.Awards}</p>
    </div>
    `;
}


// Function to reset searchbar to it's initial state
function resetBar() {
    movieSearchBox.value = "";
    movieSearchBox.placeholder = "Search IMDB"
    movieSearchBox.style.borderBottomLeftRadius = "25px";
    searchBtn.style.borderBottomRightRadius = "25px";
}

// After serach on nav bar logo hides when clicked
document.querySelector('.nav-brand-logo').addEventListener('click', () => {
    document.querySelector('.settings').style.display = "flex";
    document.querySelector('.nav-brand-logo').style.display = "none";
    document.querySelector('.searchbar-logo').style.display = "flex";
    resultGrid.innerHTML = '';
});


// FAVOURITE LIST FUNCTIONALITIES

function makeFavList(params) {
    if(localStorage.length == 0) {
        movies = [];
        movies.push(params);
        localStorage.setItem("movies", JSON.stringify(movies));
    } else {
        movies = JSON.parse(localStorage.getItem("movies"));
        movies.push(params);
        localStorage.setItem("movies", JSON.stringify(movies));
    }    
}


function showFavList(){
    let arr = JSON.parse(localStorage.getItem("movies"));
    // console.log(arr);
    if(arr == null || arr.length == 0) {
        window.alert("You've not added any movie into the list yet.");
        return;
    }

    for (var i = 0; i < arr.length; i++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = i;
        movieListItem.classList.add('fav-res-img');
        movieListItem.style.backgroundImage = `url(${arr[i]})`;
        movieListItem.classList.add('rounded-lg');
        movieListItem.classList.add('flex');
        movieListItem.classList.add('items-end');
        movieListItem.innerHTML = `
        <button class="remove-fav" onclick="removeMovie(${i})">
            <p class="shadow-2xl p-2"><i class="fa-solid fa-trash text-xl"></i></p>
        </button>
        `;
        document.querySelector('.fav-list').appendChild(movieListItem);
        document.querySelector('#favourite-result').style.opacity = "1";
    }
}

function exitFavPage() {
    let arr = JSON.parse(localStorage.getItem("movies"));
    if(arr == null || arr.length == 0) {
        window.alert("You've not added any movie into the list yet.");
        return;
    }
    document.querySelector('#favourite-result').style.opacity = "0";
    document.querySelector('.fav-list').innerHTML = "";
}

function clearList() {
    exitFavPage();
    localStorage.clear();
}

function removeMovie(idx) {
    let arr = JSON.parse(localStorage.getItem("movies"));
    arr.splice(idx, 1);
    localStorage.setItem("movies", JSON.stringify(arr));
    document.querySelector('.fav-list').innerHTML = "";
    if(arr.length == 0) {
        document.querySelector('.fav-list').innerHTML = "";
        document.querySelector('#favourite-result').style.opacity = "0";
        exitFavPage();
    }
    showFavList();
}