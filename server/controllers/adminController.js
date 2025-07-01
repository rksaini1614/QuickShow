const Booking = require("../models/Booking");
const Show = require("../models/Show");


// api to check is user is admin or not
exports.isAdmin = async(req,res) => {
    return res.json(
        {
            success : true,
            message : "User is Admin"
        }
    )
}

// to get admin dashboard data
exports.getDashboardData = async(req,res) => {
    try{
        const bookings = await Booking.find({isPaid : true});
        const activeShows = await Show.find({showDateTime : {$gte : new Date()}}).populate("movie").exec();

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings : bookings.length,
            totalRevenue: bookings.reduce((acc,booking) => acc + booking.amount,0),
            activeShows,
            totalUser
        }

        return res.json(
            {
                success : true,
                dashboardData
            }
        )

    }
    catch(error) {
        console.log("error in getDashboard:",error.message);
        return res.json(
            {
                success : false,
                message : error.message
            }
        )
    }
}


// api to get all shows
exports.getAllShows = async(req,res) => {
    try{

        const shows = await Show.find({showDateTime : {$gte : new Date()}}).sort({showDateTime : 1})
        .populate("movie");

        return res.json({
            success : true,
            shows
        }
        );
    }
    catch(error){
        console.log("Error in getting all shows:",error.message);
        return res.json(
            {
                success : false,
                message : error.message
            }
        )
    }
}

// api to get all bookings
exports.getAllBookings = async(req,res) => {
    try{
        const bookings = await Booking.find({}).populate("user").populate(
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
        console.log("Error in getting all Bookings:",error.message);
        return res.json(
            {
                success : false,
                message : error.message
            }
        )
    }
}