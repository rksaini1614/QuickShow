
const express = require("express");
const { createBoking, getOccupiedSeats } = require("../controllers/bookingController");
const router = express.Router();


router.post("/create",createBoking);
router.get("/seats/:shosId",getOccupiedSeats);


module.exports = router;