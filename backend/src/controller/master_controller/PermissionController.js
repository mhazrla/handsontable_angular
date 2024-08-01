const model = require("./../../model/permission.model");
const api = require("./../../tools/common");

const getAllPermission = async (req, res) => {
  let data = await model.getAllPermissions();
  return api.ok(res, data);
};

const insertPermission = async (req, res) => {
  console.log(req.body);
  const body = ({ code, detail } = req.body);
  const permission = await model.insertPermission(body);
  if (permission.length === 0) return api.error(res, "Bad Request", 400);

  const data = await model.getPermission(permission[0]);

  return api.ok(res, data);
};

const updatePermission = async (req, res) => {
  const { id } = req.params;
  const body = ({ code, detail } = req.body);
  const permission = await model.getPermission(id);

  if (permission.length === 0)
    return api.error(res, "Permission not found!", 404);
  const data = await model.updatePermission(id, body);
  return api.ok(res, data);
};

const deletePermission = async (req, res) => {
  const { id } = req.params;
  const permission = await model.getPermission(id);
  if (permission.length === 0)
    return api.error(res, "Permission Not Found", 404);

  const data = await model.deletePermission(id);
  if (data.length === 0) {
    return api.error(res, "Bad Request", 400);
  }
  return api.ok(res, data);
};

module.exports = {
  getAllPermission,
  insertPermission,
  updatePermission,
  deletePermission,
};
