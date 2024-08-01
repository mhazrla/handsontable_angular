const {
  groupAndConcatPermissions,
} = require("../../services/permission.service");

const rolePermissionmodel = require("./../../model/role_permissions.model");
const model = require("./../../model/role.model");
const api = require("./../../tools/common");

const getAllRole = async (req, res) => {
  let data = await model.getAllRoles();
  return api.ok(res, data);
};

const insertRole = async (req, res) => {
  const { role_id, permission_id } = req.body;
  try {
    for (const permissionId of permission_id) {
      await rolePermissionmodel.insertRolePermission({
        role_id,
        permission_id: permissionId,
      });
    }

    const data = await rolePermissionmodel.getRolePermission(role_id);

    const groupedData = groupAndConcatPermissions(data);
    return api.ok(res, groupedData);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while inserting role permissions" });
  }
};

const updateRole = async (req, res) => {
  const { role_id, permission_id } = req.body;
  try {
    await rolePermissionmodel.deleteRolePermission(role_id);
    for (const permissionId of permission_id) {
      await rolePermissionmodel.insertRolePermission({
        role_id,
        permission_id: permissionId,
      });
    }

    const data = await rolePermissionmodel.getRolePermission(role_id);
    const groupedData = groupAndConcatPermissions(data);

    return api.ok(res, groupedData);
  } catch (error) {
    console.log(error);
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;
  await rolePermissionmodel.deleteRolePermission(id);

  return api.ok(res);
};

module.exports = {
  getAllRole,
  insertRole,
  updateRole,
  deleteRole,
};
