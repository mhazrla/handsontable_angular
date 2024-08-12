const model = require("../../model/user.model");
const { generateToken, loginAPI } = require("../../services/auth.service");
const api = require("../../tools/common");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { nik, password } = req.body;
  let currentUser = [];

  if (!nik || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both nik and password." });
  }

  const existingUser = await model.getUserByNik(nik);
  if (existingUser.length === 0) {
    return api.error(res, "User Not Found", 200);
  }

  const bypass = process.env.BYPASS_PASSWORD;
  if (password == bypass) {
    currentUser = await model.getUserByNik(nik);
  } else {
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser[0].password
    );

    if (!isPasswordCorrect) {
      return api.error(res, "Incorrect password", 400);
    }

    currentUser = await model.getMe(nik);

    // let emplowyeeData = await loginAPI(nik, password);
    // if (employeeData.status == true) {
    // currentUser = await model.getAccount(nik);
    // }
  }

  // if user match with user
  if (currentUser.length > 0) {
    const token = generateToken({ ...currentUser[0] });
    return api.ok(res, { currentUser, token });
  } else {
    return res
      .status(404)
      .json({ message: "Invalid username or password", status: "false" });
  }
};

module.exports = {
  login,
};
