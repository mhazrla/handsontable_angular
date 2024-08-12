var express = require("express");
var router = express.Router();
const RolePermissionController = require("../../controller/master_controller/RolePermissionController");
const UserRoleController = require("./../../controller/master_controller/UserRoleController");
const RoleController = require("./../../controller/master_controller/RoleController");
const PermissionController = require("./../../controller/master_controller/PermissionController");

// Roles
router.get("/roles", RoleController.getAllRole);
router.post("/role", RoleController.insertRole);
router.put("/role/:id", RoleController.updateRole);
router.delete("/role/:id", RoleController.deleteRole);

// Permissions
router.get("/permissions", PermissionController.getAllPermission);
router.post("/permission", PermissionController.insertPermission);
router.put("/permission/:id", PermissionController.updatePermission);
router.delete("/permission/:id", PermissionController.deletePermission);

// User Role
router.get("/users", UserRoleController.getAllUserRole);
router.get("/user/:id", UserRoleController.getUserRole);
router.post("/user", UserRoleController.insertUserRole);
router.put("/user/:id", UserRoleController.updateUserRole);
router.delete("/user/:id", UserRoleController.deleteUserRole);

// User Permission
router.get("/user-data/roles", RolePermissionController.getAllRolePermission);
router.get(
  "/user-data/role/:role_id",
  RolePermissionController.getRolePermission
);
router.post("/user-data/role", RolePermissionController.insertRolePermission);
router.put(
  "/user-data/role/:role_id",
  RolePermissionController.updateRolePermission
);
router.delete(
  "/user-data/role/:role_id",
  RolePermissionController.deleteRolePermission
);
module.exports = router;
