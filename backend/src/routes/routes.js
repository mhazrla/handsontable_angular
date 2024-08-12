var express = require("express");
var router = express.Router();
const path = require("path");

const auth_routes = require("./utility_routes/auth.routes");
const profile_routes = require("./profile/profile.routes");
const master_routes = require("./master_routes/master.routes");
const journalRoutes = require("./journal/index.routes");

const { verifyToken } = require("../services/auth.service");
const { hasAccess } = require("../services/permission.service");
// not found route
router.get("/not-found", function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "../views/not-found.html"));
});

// authentication routes usage
router.use("/auth/", auth_routes);

// Profile route
router.use("/profile/", profile_routes);

// router.use("/admin", verifyToken, hasAccess("MSTR-CRUD"), adminRoutes);
router.use("/master/", verifyToken, hasAccess("MSTR-CRUD"), master_routes);

router.use("/journal/", journalRoutes);
// master data routes usage

//kecuali master, seharusnya routes dipisah per-table

module.exports = router;
