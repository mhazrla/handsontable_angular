const aio_cms = require("./../database/db.config");

const getAccount = async (nik) => await aio_cms("v_users").where("nik", nik);

module.exports = {
  getAccount,
};
