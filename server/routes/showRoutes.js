const express = require("express");
const { getNowPlayingMovies, addShow, getShows, getShow } = require("../controllers/showController");
const { default: protectAdmin } = require("../middlewares/auth");
const router = express.Router();


// show routes
router.get("/now-playing",protectAdmin,getNowPlayingMovies);
router.post("/add",protectAdmin,addShow);
router.get("/all",getShows);
router.get("/:movieId",getShow);


module.exports = router;