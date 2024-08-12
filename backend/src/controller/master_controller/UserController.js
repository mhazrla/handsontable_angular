const userModel = require("../../model/user.model");
const api = require("../../tools/common");
const bcrypt = require("bcrypt");

const getAllUser = async (req, res) => {
  let data = await userModel.getAllUsers();
  return api.ok(res, data);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  let data = await userModel.getUser(id);
  if (data.length === 0) return api.error(res, "User not found!", 404);
  return api.ok(res, data);
};

const insertUser = async (req, res) => {
  const { name, nik, email, phone_number, password, work_location } = req.body;

  const existingUser = await userModel.getUserByNik(nik);
  
  if (!existingUser) {
    return api.error(res, `User with NIK ${nik} already exist`, 400);
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userModel.insertUser({
      name,
      nik,
      email,
      phone_number,
      work_location,
      password: hashedPassword,
    });

    if (user.length === 0) return api.error(res, "Bad Request", 400);

    const data = await userModel.getUser(user[0]);
    return api.ok(res, data);
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    nik,
    email,
    phone_number,
    password,
    work_location,
    old_password,
  } = req.body;
  try {
    const existingUser = await userModel.getUserByNik(nik);
    if (!existingUser) {
      return api.error(res, `User with ID ${id} not found`, 404);
    }

    if (old_password) {
      const isPasswordCorrect = await bcrypt.compare(
        old_password,
        existingUser[0].password
      );

      if (!isPasswordCorrect) {
        return api.error(res, "Incorrect password", 400);
      }
    }

    await userModel.updateUser(id, {
      name,
      nik,
      email,
      phone_number,
      work_location,
      ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
    });

    const updatedData = await userModel.getUser(id);

    return api.ok(res, updatedData);
  } catch (error) {
    console.error("Error updating user:", error);
    return api.error(res, "An error occurred while updating the user ");
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.getUser(id);
  if (user.length === 0) {
    return api.error(res, "User Not Found", 404);
  }

  const data = await userModel.deleteUser(id);
  if (data.length === 0) {
    return api.error(res, "Bad Request", 400);
  }
  return api.ok(res, data);
};

module.exports = api.handleError({
  getAllUser,
  userModel,
  getUser,
  insertUser,
  updateUser,
  deleteUser,
});
