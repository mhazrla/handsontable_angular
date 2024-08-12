const {
  groupAndConcatPermissions,
  groupAndConcatSingleRolePermissions,
} = require("../../services/permission.service");
const model = require("../../model/role_permissions.model");
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

const insertRolePermission = async (req, res) => {
  const { role_id, permission_id } = req.body;
  try {
    for (const permissionId of permission_id) {
      await model.insertRolePermission({
        role_id,
        permission_id: permissionId,
      });
    }

    const data = await model.getRolePermission(role_id);

    const groupedData = groupAndConcatPermissions(data);
    return api.ok(res, groupedData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while inserting role permissions" });
  }
};

const updateRolePermission = async (req, res) => {
  const { role_id, permission_id } = req.body;
  try {
    await model.deleteRolePermission(role_id);
    for (const permissionId of permission_id) {
      await model.insertRolePermission({
        role_id,
        permission_id: permissionId,
      });
    }

    const data = await model.getRolePermission(role_id);
    const groupedData = groupAndConcatPermissions(data);

    return api.ok(res, groupedData);
  } catch (error) {
    console.log(error);
  }
};

const deleteRolePermission = async (req, res) => {
  const { role_id } = req.params;

  let data = await model.deleteRolePermission(role_id);
  if (!data) {
    return api.error(res, "Bad Request", 400);
  }

  return api.ok(res, data);
};

module.exports = api.handleError({
  getAllRolePermission,
  getRolePermission,
  insertRolePermission,
  updateRolePermission,
  deleteRolePermission,
});
