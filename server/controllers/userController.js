const { clerkClient,auth} = require("@clerk/express");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Movie = require("../models/Movie");




// api controller function to get user bookings
exports.getUserBookings = async(req,res) => {
    try{
        const {userId} = req.auth();

        const bookings = await Booking.find({userId}).populate(
            {
                path : "show",
                populate : {
                    path : "movie"
                }
            }
        ).sort({createdAt : -1});

        return res.json(
            {
                success : true,
                bookings
            }
        )
    }
    catch(error){
        console.log("Error in getUserBooking :",error.message);
        return res.json(
            {
                success : false,
                message : error.message
            }
        );
    }
}


// api controller function to update favourite movie in clerk user metadata
exports.updateFavourite = async(req,res) => {
    try{
        const {movieId} = req.body;
        const {userId} = req.auth().userId;

        const user = await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favourites) {
            user.privateMetadata.favourites = [];
        }

        if(!user.privateMetadata.favourites.includes(movieId)){
            user.privateMetadata.favourites.push(movieId);
        }else{
            user.privateMetadata.favourites = user.privateMetadata.favourites.filter(
                (item) => item !== movieId
            )
        }

        await clerkClient.users.updateUserMetadata(userId,{privateMetadata: user.privateMetadata});

        return res.json(
            {
                succss : true,
                message : "Favourite movie updated successfully"
            }
        );
    }
    catch(error){
        console.log("Error in update favourite:",error.message);
        return res.json(
            {
                success : false,
                message : error.message
            }
        );
    }
}


// api controller function to get favorites movies
exports.getFavourites = async(req,res)=> {
    try{
        console.log("Auth:",req.auth);
        const {userId} = req.auth();
        console.log( "userId   : ",userId);
        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites;

        // getting moviesfrom database
        const movies = await Movie.find({_id : {$in : favorites}});

        return res.json(
            {
                success :true,
                movies
            }
        )
    }
    catch(error){
       console.log("Error in favotites movies backend :",error.message);
        return res.json(
            {
                success : false,
                message : error.message
            }
        ); 
    }


}
