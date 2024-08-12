const model = require("./../../model/role.model");
const api = require("./../../tools/common");

const getAllRole = async (req, res) => {
  let data = await model.getAllRoles();
  return api.ok(res, data);
};

const insertRole = async (req, res) => {
  const { role_name, detail } = req.body;
  try {
    const role = await model.insertRole({ role_name, detail });
    const data = await model.getRole(role[0]);

    return api.ok(res, data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Bad Request" });
  }
};

const updateRole = async (req, res) => {
  const { id, role_name, detail } = req.body;
  try {
    const role = await model.getRole(id);
    if (!role) return api.error(res, "Not Found", 404);

    await model.updateRole(id, { role_name, detail });

    const data = await model.getRole(id);

    return api.ok(res, data);
  } catch (error) {
    console.log(error);
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;
  await model.deleteRole(id);

  return api.ok(res);
};

module.exports = {
  getAllRole,
  insertRole,
  updateRole,
  deleteRole,
};
