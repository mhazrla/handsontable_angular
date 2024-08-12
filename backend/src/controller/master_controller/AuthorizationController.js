const model = require("../../model/authorization.model");
const api = require("../../tools/common");
const bcrypt = require("bcrypt");

const getAllAuthorization = async (req, res) => {
  let data = await model.getAllAuthorizations();
  return api.ok(res, data);
};

const insertAuthorization = async (req, res) => {
  const {
    user_type,
    role_id,
    nik,
    account_sap,
    account_sap_password,
    company,
    created_by,
  } = req.body;
  try {
    const existingAccount = await model.getExistingAccount(account_sap);
    if (existingAccount) {
      return api.error(res, `Account SAP already exists`, 400);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(account_sap_password, saltRounds);

    const authorization = await model.insertAuthorization({
      user_type,
      role_id,
      nik,
      account_sap,
      account_sap_password: hashedPassword,
      company,
      created_by,
    });
    const data = await model.getAuthorization(nik);

    return api.ok(res, data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Bad Request" });
  }
};

const updateAuthorization = async (req, res) => {
  const {
    user_type,
    role_id,
    nik,
    account_sap,
    account_sap_password,
    old_password,
    company,
  } = req.body;

  try {
    const existingAuthorization = await model.getAuthorization(nik);
    if (!existingAuthorization) return api.error(res, "Not Found", 404);

    if (existingAuthorization[0].account_sap !== account_sap) {
      const existingAccount = await model.getExistingAccount(account_sap);
      if (existingAccount) {
        return api.error(res, `Account SAP already exists`, 400);
      }
    }

    if (old_password) {
      const isPasswordCorrect = await bcrypt.compare(
        old_password,
        existingAuthorization[0].account_sap_password
      );

      if (!isPasswordCorrect) {
        return api.error(res, "Incorrect password", 400);
      }
    }

    if (old_password) {
      const isPasswordCorrect = await bcrypt.compare(
        old_password,
        existingAuthorization[0].account_sap_password
      );

      if (!isPasswordCorrect) {
        return api.error(res, "Incorrect password", 400);
      }
    }
    await model.updateAuthorization(nik, {
      user_type,
      role_id,
      nik,
      company,
      account_sap,
      ...(account_sap_password
        ? { account_sap_password: await bcrypt.hash(account_sap_password, 10) }
        : {}),
    });

    const data = await model.getAuthorization(nik);

    return api.ok(res, data);
  } catch (error) {
    console.log(error);
  }
};

const deleteAuthorization = async (req, res) => {
  const { nik } = req.params;
  await model.deleteAuthorization(nik);

  return api.ok(res);
};

module.exports = {
  getAllAuthorization,
  insertAuthorization,
  updateAuthorization,
  deleteAuthorization,
};
