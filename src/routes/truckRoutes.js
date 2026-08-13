const express = require("express");
const router = express.Router();
const truckController = require("../controllers/truckController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

router
  .route("/")
  .post(truckController.createTruck)
  .get(truckController.getTruck);

router
  .route("/:id")
  .get(truckController.getTruckById)
  .put(truckController.updateTruck)
  .delete(truckController.deleteTruck);

module.exports = router;
