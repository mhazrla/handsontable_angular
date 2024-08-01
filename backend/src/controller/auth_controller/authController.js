const model = require("../../model/user_data.model");
const { generateToken, loginAPI } = require("../../services/auth.service");

const login = async (req, res) => {
  const { nik, password } = req.body;
  let currentUser = [];

  if (!nik || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both nik and password." });
  }

  // get bypass password
  const bypass = process.env.BYPASS_PASSWORD;
  // match bypass with user entered password
  if (password == bypass) {
    currentUser = await model.getAccount(nik);
  } else {
    // normal login
    let employeeData = await loginAPI(nik, password);
    if (employeeData.status == true) {
      currentUser = await model.getAccount(nik);
    }
  }

  // if user match with user
  if (currentUser.length > 0) {
    token = generateToken({ ...currentUser[0] });
    return res.json({ currentUser, token });
  } else {
    return res
      .status(404)
      .json({ message: "Invalid username or password", status: "false" });
  }
};

module.exports = {
  login,
};
