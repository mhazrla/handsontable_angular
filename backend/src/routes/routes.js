var express = require("express");
var router = express.Router();
const path = require("path");

const masterRoutes = require("./master_routes/master.routes");
const auth_routes = require("./utility_routes/auth.routes");
const adminRoutes = require("./master_routes/admin.routes");
const journalRoutes = require("./journal/index.routes");

const { verifyToken } = require("../services/auth.service");
const { hasAccess } = require("../services/permission.service");
// not found route
router.get("/not-found", function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "../views/not-found.html"));
});

// authentication routes usage
router.use("/auth/", auth_routes);
// router.use("/admin", verifyToken, hasAccess("MSTR-CRUD"), adminRoutes);
router.use("/admin/", adminRoutes);

router.use("/journal/", journalRoutes);
// master data routes usage
router.use("/master/", verifyToken, masterRoutes);

//kecuali master, seharusnya routes dipisah per-table

module.exports = router;
