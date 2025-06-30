const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
    {
        movie : {
            type : {
                type : String,
                required : true,
                ref : "Movie"
            }
        },
        showDateTime : {
            type : Date,
            required : true
        },
        showPrice : {
            type : Number,
            required:true
        },
        occupiedSeats : {
            type : Object,
            default : {}
        }   
    }
)


module.exports = mongoose.model("Show",showSchema);