const {
  groupAndConcatPermissions,
  groupAndConcatSingleRolePermissions,
} = require("../../services/permission.service");
const model = require("../../model/role_permissions.model");
const permissionModel = require("../../model/permission.model");
const roleModel = require("../../model/role.model");
const api = require("../../tools/common");

const getAllRolePermission = async (req, res) => {
  let data = await model.getAllRolePermissions();
  const result = groupAndConcatPermissions(data);

  return api.ok(res, result);
};

const getRolePermission = async (req, res) => {
  const { role_id } = req.params;
  let data = await model.getRolePermission(role_id);
  const result = groupAndConcatSingleRolePermissions(data);
  return api.ok(res, result);
};

const validateRoleName = (roleName) => {
  return (
    roleName &&
    typeof roleName === "string" &&
    /^[a-zA-Z0-9\s-]+$/.test(roleName)
  );
};

const findOrCreateRole = async (roleName, roleDetail) => {
  // Delete spaces in role_name at user input
  const formattedRoleName = roleName
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "")
    .trim();
  const roles = await roleModel.getAllRoles();
  let roleId;

  const roleExists = roles.some((role) => {
    // Delete spaces in role_name at db
    const formattedExistingRoleName = role.role_name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "")
      .trim();
    roleId = role.id;
    return formattedExistingRoleName === formattedRoleName;
  });

  if (!roleExists) {
    const insertedRole = await roleModel.insertRole({
      role_name: roleName,
      detail: roleDetail,
    });
    return insertedRole[0];
  } else {
    await model.deleteRolePermission(roleId);
    return roleId;
  }
};

const insertRolePermissions = async (roleId, permissionIds) => {
  const uniquePermissionIds = new Set(permissionIds);
  for (let pid of uniquePermissionIds) {
    await model.insertRolePermission({
      role_id: roleId,
      permission_id: pid,
    });
  }
};

const insertRolePermission = async (req, res) => {
  const { role_name, permission_id, role_detail } = req.body;
  const isValidated = validateRoleName(role_name);

  if (!isValidated)
    return api.error(
      res,
      "Invalid role name. Role name can only contain letters, numbers, hyphens (-), and spaces.",
      400
    );

  const roleId = await findOrCreateRole(role_name, role_detail);

  const checkPermissions = await permissionModel.getAllPermissions();
  const permissionIds = checkPermissions.map((perm) => perm.id);

  const allPermissionsExist = permission_id.every((pid) => {
    return permissionIds.includes(pid);
  });

  if (!allPermissionsExist) {
    return api.error(res, "Some permission codes not found", 404);
  }

  await insertRolePermissions(roleId, permission_id);

  const data = await model.getRolePermission(roleId);
  const result = groupAndConcatSingleRolePermissions(data);

  return api.ok(res, result);
};

const updateRolePermission = async (req, res) => {
  const { role_id } = req.params;
  const { permission_id } = req.body;
  const uniquePermissionIds = new Set(permission_id);

  const role = await roleModel.getRole(role_id);
  if (role.length === 0) {
    return api.error(res, "Role not found", 404);
  }

  // Verify all permissions id in db
  const checkPermissions = await permissionModel.getAllPermissions();
  const permissionIds = checkPermissions.map((perm) => perm.id);

  const allPermissionsExist = [...uniquePermissionIds].every((pid) => {
    return permissionIds.includes(pid);
  });

  if (!allPermissionsExist) {
    return api.error(res, "Some permission codes not found", 404);
  }

  await model.deleteRolePermission(role_id);

  for (let pid of uniquePermissionIds) {
    await model.insertRolePermission({ role_id, permission_id: pid });
  }

  const rolePermission = await model.getRolePermission(role_id);
  const result = groupAndConcatSingleRolePermissions(rolePermission);

  return api.ok(res, result);
};

const deleteRolePermission = async (req, res) => {
  const { role_id } = req.params;

  const role = await model.getRolePermission(role_id);
  if (role.length === 0) {
    return api.error(res, "Role ID in Role Permission Table Not Found", 404);
  }

  let data = await model.deleteRolePermission(role_id);
  if (!data) {
    return api.ok(res, data);
  }
};

module.exports = api.handleError({
  getAllRolePermission,
  getRolePermission,
  insertRolePermission,
  updateRolePermission,
  deleteRolePermission,
});
