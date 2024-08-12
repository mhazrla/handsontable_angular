const {
  groupAndConcatPermissions,
} = require("../../services/permission.service");
const roleModel = require("./../../model/role.model");
const userRoleModel = require("./../../model/user_role.model");
const api = require("./../../tools/common");

const getAllUserRole = async (req, res) => {
  let data = await userRoleModel.getAllUserRoles();
  return api.ok(res, data);
};

const getUserRole = async (req, res) => {
  const { id } = req.params;
  let data = await userRoleModel.getUserRole(id);
  if (data.length === 0) return api.error(res, "User not found!", 404);
  return api.ok(res, data);
};

const insertUserRole = async (req, res) => {
  const { name, nik, email, phone_number, work_location, role_id } = req.body;
  const user = await userRoleModel.insertUserRole({
    name,
    nik,
    role_id,
    email,
    phone_number,
    work_location,
  });

  if (user.length === 0) return api.error(res, "Bad Request", 400);
  const data = await userRoleModel.getUserRole(user[0]); // user[0] = user id from created user
  return api.ok(res, data);
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { name, nik, email, phone_number, work_location, role_id } = req.body;
  await userRoleModel.updateUserRole(id, {
    name,
    nik,
    email,
    phone_number,
    work_location,
    role_id,
  });
  const data = await userRoleModel.getUserRole(id);
  console.log(data);
  return api.ok(res, data);
};

const deleteUserRole = async (req, res) => {
  const { id } = req.params;
  const user = await userRoleModel.getUserRole(id);
  if (user.length === 0) {
    return api.error(res, "User Not Found", 404);
  }

  const data = await userRoleModel.deleteUserRole(id);
  if (data.length === 0) {
    return api.error(res, "Bad Request", 400);
  }
  return api.ok(res, data);
};

module.exports = api.handleError({
  getAllUserRole,
  userRoleModel,
  getUserRole,
  insertUserRole,
  updateUserRole,
  deleteUserRole,
});
