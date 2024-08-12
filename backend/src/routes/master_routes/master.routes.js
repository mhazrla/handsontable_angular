var express = require("express");
var router = express.Router();
const RolePermissionController = require("../../controller/master_controller/RolePermissionController");
const UserController = require("../../controller/master_controller/UserController");
const RoleController = require("../../controller/master_controller/RoleController");
const AuthorizationController = require("../../controller/master_controller/AuthorizationController");
const PermissionController = require("../../controller/master_controller/PermissionController");

// Authorization
router.get("/authorizations", AuthorizationController.getAllAuthorization);
router.post("/authorization", AuthorizationController.insertAuthorization);
router.put("/authorization/:nik", AuthorizationController.updateAuthorization);
router.delete(
  "/authorization/:nik",
  AuthorizationController.deleteAuthorization
);

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

// User
router.get("/users", UserController.getAllUser);
router.get("/user/:id", UserController.getUser);
router.post("/user", UserController.insertUser);
router.put("/user/:id", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);

// User Permission
router.get("/role-permissions", RolePermissionController.getAllRolePermission);
router.get(
  "/role-permissions/:role_id",
  RolePermissionController.getRolePermission
);
router.post("/role-permissions", RolePermissionController.insertRolePermission);
router.put(
  "/role-permissions/:role_id",
  RolePermissionController.updateRolePermission
);
router.delete(
  "/role-permissions/:role_id",
  RolePermissionController.deleteRolePermission
);
module.exports = router;
