const aio_cms = require("../database/db.config");

const getAllPermissions = async () =>
  await aio_cms("mst_user_permission").select("*");

const getPermission = async (id) =>
  await aio_cms("mst_user_permission").where("id", id);

const insertPermission = async (data) =>
  await aio_cms("mst_user_permission").insert(data);

const updatePermission = async (id, data) => {
  await aio_cms("mst_user_permission").where("id", id).update(data);
};

const deletePermission = async (id) =>
  await aio_cms("mst_user_permission").where("id", id).del();

module.exports = {
  getAllPermissions,
  getPermission,
  insertPermission,
  updatePermission,
  deletePermission,
};
