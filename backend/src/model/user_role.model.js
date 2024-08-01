const aio_cms = require("./../database/db.config");

const getAllUserRoles = async () => await aio_cms("v_users").select("*");

const getUserRole = async (id) =>
  await aio_cms("v_users").where("v_users.id", id).select("*");

const insertUserRole = async (data) => await aio_cms("mst_user").insert(data);

const updateUserRole = async (id, data) => {
  await aio_cms("mst_user").where("id", id).update(data);
};

const deleteUserRole = async (id) =>
  await aio_cms("mst_user").where("id", id).del();

module.exports = {
  getUserRole,
  getAllUserRoles,
  insertUserRole,
  updateUserRole,
  deleteUserRole,
};
