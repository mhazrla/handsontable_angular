var express = require("express");
var router = express.Router();
const ProfileController = require("../../controller/master_controller/ProfileController");

// Authorization
router.put("/:id", ProfileController.updateProfile);
router.put("/change-password/:id", ProfileController.changePassword);
router.delete("/delete-profile/:id", ProfileController.updateProfile);

module.exports = router;
