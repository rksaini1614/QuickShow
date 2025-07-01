const Booking = require("../models/Booking");
const Show = require("../models/Show")



// function to check availability of selected seats
exports.checkSeatAvailability = async (showId,selectedSeats) => {
    try{

        const showData = Show.findById(showId);
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some((seat)=> occupiedSeats[seat]);

        return !isAnySeatTaken;
    }
    catch(error){
        console.log("Error in check availability:",error.message);
        return false;
    }
}


// function to create a booking
exports.createBoking = async(req,res) => {
    try{
        const {userId} = req.auth().userId;
        const {showId, selectedSeats} = req.body;

        const {origin} = req.headers;

        // check if the seat is available for the selected show
        const isAvailable = await this.checkSeatAvailability(showId,selectedSeats);

        if(!isAvailable) {
            return res.json(
                {
                    success:false,
                    message : "Selected seats are not available"
                }
            )
        }

        // get the show details
        const showData = await Show.findById(showId).populate("movie");

        // create booking
        const booking = await Booking.create(
            {
                user : userId,
                show :showId,
                amount : showData.showPrice * selectedSeats.length,
                bookedSeats : selectedSeats
            }
        )

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified("occupiedSeats");

        await showData.save();

        // stripe Gateway Initialize


        return res.json(
            {
                success : true,
                message : "Booked Successfully"
            }
        );
    }
    catch(error) {
        console.log("Error in createBooking:",error.message);
        return res.json(
            {success : true, message:error.message}
        );
    }
}

// function to get occcupied seats
exports.getOccupiedSeats = async(req,res) => {
    try{

        const {showId} = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);

        return res.json(
            {success : true, occupiedSeats}
        );
    }
    catch(error) {
        console.log("Error in getOccupiedSeats:",error.message);
        return res.json(
            {success : true, message:error.message}
        );
    }
}