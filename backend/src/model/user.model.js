const aio_cms = require("../database/db.config");

const getAllUsers = async () =>
  await aio_cms("mst_user").select(
    "id",
    "nik",
    "name",
    "email",
    "phone_number",
    "work_location"
  );

const getUser = async (id) =>
  await aio_cms("mst_user")
    .where("mst_user.id", id)
    .select("id", "nik", "name", "email", "phone_number", "work_location");

const getMe = async (nik) =>
  await aio_cms("v_users").where("v_users.nik", nik).select("*");

const getUserByNik = async (nik) =>
  await aio_cms("mst_user")
    .where("mst_user.nik", nik)
    .select("nik", "password");

const insertUser = async (data) => await aio_cms("mst_user").insert(data);

const updateUser = async (id, data) => {
  await aio_cms("mst_user").where("id", id).update(data);
};

const deleteUser = async (id) =>
  await aio_cms("mst_user").where("id", id).del();

module.exports = {
  getUser,
  getMe,
  getUserByNik,
  getAllUsers,
  insertUser,
  updateUser,
  deleteUser,
};
