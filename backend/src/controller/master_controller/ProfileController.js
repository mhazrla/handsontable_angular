const userModel = require("../../model/user.model");
const authorizationModel = require("../../model/authorization.model");
const api = require("../../tools/common");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../services/auth.service");

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, nik, email, phone_number, work_location, company } = req.body;
  try {
    const existingUser = await userModel.getUserByNik(nik);
    if (!existingUser) {
      return api.error(res, `User with NIK ${nik} not found`, 404);
    }

    await userModel.updateUser(id, {
      name,
      nik,
      email,
      phone_number,
      work_location,
    });

    await authorizationModel.updateAuthorization(nik, {
      company,
    });

    const updatedData = await userModel.getMe(nik);
    const token = generateToken({ ...updatedData[0] });
    return api.ok(res, { currentUser: updatedData, token });
  } catch (error) {
    console.error("Error updating user:", error);
    return api.error(res, "An error occurred while updating the user ");
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password, old_password, nik } = req.body;
  try {
    const existingUser = await userModel.getUserByNik(nik);
    if (!existingUser) {
      return api.error(res, `User with ID ${id} not found`, 404);
    }

    const isPasswordCorrect = await bcrypt.compare(
      old_password,
      existingUser[0].password
    );

    if (!isPasswordCorrect) {
      return api.error(res, "Incorrect password", 400);
    }

    await userModel.updateUser(id, {
      password: await bcrypt.hash(password, 10),
    });

    return api.ok(res, { message: "Password changed" });
  } catch (error) {
    console.error("Error updating user:", error);
    return api.error(res, "An error occurred while updating the user ");
  }
};

module.exports = api.handleError({
  updateProfile,
  changePassword,
});
