const aio_cms = require("../database/db.config");

const getAllAuthorizations = async () => await aio_cms("v_users").select("*");

const getAuthorization = async (nik) =>
  await aio_cms("v_users").where("v_users.nik", nik).select("*");

const getExistingAccount = async (account_sap) =>
  await aio_cms("map_user_role_sap_account")
    .where("account_sap", account_sap)
    .first();

const insertAuthorization = async (data) =>
  await aio_cms("map_user_role_sap_account").insert(data);

const updateAuthorization = async (nik, data) => {
  await aio_cms("map_user_role_sap_account").where("nik", nik).update(data);
};

const deleteAuthorization = async (nik) =>
  await aio_cms("map_user_role_sap_account").where("nik", nik).del();

module.exports = {
  getAllAuthorizations,
  getAuthorization,
  getExistingAccount,
  insertAuthorization,
  updateAuthorization,
  deleteAuthorization,
};
