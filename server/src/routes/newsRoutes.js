const express = require("express");
const router = express.Router();

const { getAsianetNews } = require("../controllers/newsController");
const { getManoramaNews } = require("../controllers/newsController");
const { getManoramaSports } = require("../controllers/newsController");
const { getAllNews } = require("../controllers/newsController");

router.get("/asianet", getAsianetNews);
router.get("/manorama", getManoramaNews);
router.get("/manorama/sports", getManoramaSports);
router.get("/all", getAllNews);

module.exports = router;