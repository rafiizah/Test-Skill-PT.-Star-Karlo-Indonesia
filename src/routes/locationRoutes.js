const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);
router.get("/distance", locationController.getDistance);

module.exports = router;
