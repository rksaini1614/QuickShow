
const express = require("express");
const { getUserBookings, updateFavourite, getFavourites } = require("../controllers/userController");
const router = express.Router();


// define user routes
router.get("/bookings",getUserBookings);
router.post("/update-favourite",updateFavourite);
router.get("/favourites",getFavourites);


module.exports = router;