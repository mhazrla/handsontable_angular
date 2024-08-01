const aio_cms = require("./../database/db.config");

const getAllRoles = async () => await aio_cms("mst_user_role").select("*");

const getRole = async (id) => await aio_cms("mst_user_role").where("id", id);

const insertRole = async (data) => await aio_cms("mst_user_role").insert(data);

const updateRole = async (id, data) => {
  await aio_cms("mst_user_role").where("id", id).update(data);
};

const deleteRole = async (id) => await aio_cms("mst_user_role").where("id", id).del();

module.exports = {
  getAllRoles,
  getRole,
  insertRole,
  updateRole,
  deleteRole,
};
