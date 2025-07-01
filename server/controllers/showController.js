// import axios from 'axios';
// import dotenv from "dotenv";
// dotenv.config();

const axios = require("axios");
const Movie = require("../models/Movie");
const Show = require("../models/Show");
require("dotenv").config();


// to get now playing movies from TMDB api
exports.getNowPlayingMovies = async(req,res) => {
    try{
        const {data} = await axios.get("https://api.themoviedb.org/3/movie/now_playing",
            {
                headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
            }
        );

        const movies = data.results;
        res.status(200).json(
            {
                success : true,
                movies : movies
            }
        )
    }
    catch(error){
        console.log("error in now playing backend :",error.message);
        return res.json(
            {
                success : false,
                message : error.message
            }
        )
    }
}

// api to add a new show to database
exports.addShow = async(req,res) => {
    try{
        const {movieId, showsInput, showPrice} = req.body;
        let movie = await Movie.findById(movieId);
        if(!movie) {
            // fetch movie details and credits from TMDB 
            const [movieDetailsResponse,movieCreditsResponse] = await Promise.all(
                [axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
                headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}}),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
                headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}})
                ]
            );

            const movieApiData = movieDetailsResponse.data;
            const movieCreditData = movieCreditsResponse.data;

            const movieDetails = {
                _id : movieId,
                title : movieApiData.title,
                overview : movieApiData.overview,
                poster_path : movieApiData.poster_path,
                backdrop_path : movieApiData.backdrop_path,
                genres : movieApiData.genres,
                casts : movieCreditData.cast,
                release_date : movieApiData.release_date,
                original_language : movieApiData.original_language,
                tagline : movieApiData.tagline || "",
                vote_average : movieApiData.vote_average,
                runtime : movieApiData.runtime,
            }

            // add movie to database
            movie = await Movie.create(movieDetails);

        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push(
                    {
                        movie : movieId,
                        showDateTime : new Date(dateTimeString),
                        showPrice,
                        occupiedSeats :{}
                    }
                )
            })
        });

        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
        }

        return res.status(200).json(
            {
                success : true,
                message : "Show added successfully"
            }
        )
    }
    catch(error){
        console.log("Error in addShow:",error.message);
        return res.json(
            {
                succes : false,
                message : error.message
            }

        );
    }
}


// api to get all shows from database
exports.getShows = async(req,res) => {
    try{
        const shows = await Show.find({showDateTime : {$gte: new Date()}})
        .populate("movie").sort({showDateTime : 1});

        // filter unique shows
        const uniqueShows = new Set(shows.map(show => show.movie));

        return res.json(
            {
                success : true,
                shows : Array.from(uniqueShows)
            }
        )
    }
    catch(error){
        console.log("error in getShows backend:",error.message);
        return res.json(
            {
                succes : false,
                message : error.message
            }

        );
    }
}


// get a single show from the database
exports.getShow = async(req,res)=> {
    try{
        const {movieId} = req.params;
        // get all upcoming shows for the movie
        const shows = await Show.find({movie : movieId, showDateTime: {$gte: new Date()}});

        const movie = await Movie.findById(movieId);

        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]) {
                dateTime[date] = [];
            }

            dateTime[date].push(
                {
                    time : show.showDateTime,
                    showId : show._id
                }
            )

            return res.status(200).json(
                {
                    success : true,
                    movie,
                    dateTime
                }
            )
        })
    }
    catch(error){
        console.log("Error in getShow Backend:",error.message);
        return res.json(
            {
                succes : false,
                message : error.message
            }

        );
    }
}