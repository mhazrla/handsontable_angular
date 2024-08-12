var express = require("express");
var router = express.Router();
const FB60Controller = require("../../controller/journal/fb60.controller");
const FB50Controller = require("../../controller/journal/fb50.controller");
const F02Controller = require("../../controller/journal/f02.controller");

// FB60
// router.get("/fb60", FB60Controller.getAllFb60);
// router.get("/fb60/:id", FB60Controller.getFb60);
// router.post("/fb60", FB60Controller.insertFb60);
// router.post("/fb60/detail", FB60Controller.insertFb60Detail);
// router.put("/fb60/:id", FB60Controller.updateFb60);
// // router.put("/fb60/detail/:id", FB60Controller.updateFb60Detail);
// router.put("/fb60/reverse/:id", FB60Controller.reverseFb60);
// router.delete("/fb60/:id", FB60Controller.deleteFb60);

// // FB50
// router.get("/fb50", FB50Controller.getAllFb50);
// router.get("/fb50/:id", FB50Controller.getFb50);
// router.post("/fb50", FB50Controller.insertFb50);
// router.post("/fb50/detail", FB50Controller.insertFb50Detail);
// router.put("/fb50/:id", FB50Controller.updateFb50);
// // router.put("/fb50/detail/:id", FB50Controller.updateFb50Detail);'
// router.put("/fb50/reverse/:id", FB50Controller.reverseFb50);
// router.delete("/fb50/:id", FB50Controller.deleteFb50);

// // F02
// router.get("/f02", F02Controller.getAllF02);
// router.get("/f02/:id", F02Controller.getF02);
// router.post("/f02", F02Controller.insertF02);
// router.post("/f02/detail", F02Controller.insertF02Detail);
// router.put("/f02/:id", F02Controller.updateF02);
// // router.put("/f02/detail/:id", F02Controller.updateF02Detail);
// router.put("/f02/reverse/:id", F02Controller.reverseF02);
// router.delete("/f02/:id", F02Controller.deleteF02);

module.exports = router;
