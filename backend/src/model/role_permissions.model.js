const aio_cms = require("./../database/db.config");

const getAllRolePermissions = async () => {
  const result = await aio_cms("map_role_permission as mpr")
    .join("mst_role", "mpr.role_id", "mst_role.id")
    .join("mst_permission", "mpr.permission_id", "mst_permission.id")
    .select(
      "mst_role.id as role_id",
      "mst_role.role_name",
      "mst_role.detail as role_detail",
      "mst_permission.id as permission_id",
      "mst_permission.code as permission_code",
      "mpr.id as id"
    )
    .orderBy("mpr.role_id");

  return result;
};

const getUserPermission = async (nik) => {
  const result = await aio_cms("mst_user")
    .where("nik", nik)
    .select(
      "mst_user.id as user_id",
      "mst_user.nik",
      "mst_user.role_id",
      "mst_role.id as role_id",
      "mst_role.role_name",
      "mst_permission.id as permission_id",
      "mst_permission.code as permission_code",
      "mst_permission.detail as permission_detail"
    )
    .join("mst_role", "mst_user.role_id", "=", "mst_role.id")
    .join(
      "map_role_permission",
      "mst_user.role_id",
      "=",
      "map_role_permission.role_id"
    )
    .join(
      "mst_permission",
      "map_role_permission.permission_id",
      "=",
      "mst_permission.id"
    );

  return result;
};

const getRolePermission = async (role_id) => {
  const result = await aio_cms("map_role_permission")
    .join("mst_role", "map_role_permission.role_id", "mst_role.id")
    .join(
      "mst_permission",
      "map_role_permission.permission_id",
      "mst_permission.id"
    )
    .where("map_role_permission.role_id", role_id)
    .select(
      "map_role_permission.id",
      "map_role_permission.role_id",
      "mst_role.role_name",
      "mst_role.detail as role_detail",
      "map_role_permission.permission_id",
      "mst_permission.code as permission_code"
    );
  return result;
};

const insertRolePermission = async (data) => {
  await aio_cms("map_role_permission").insert(data);
};

const updateRolePermission = async (role_id, data) => {
  try {
    await aio_cms("map_role_permission").where("role_id", role_id).update(data);
  } catch (error) {
    console.error(
      `Failed to update role permissions for role_id ${role_id}`,
      error
    );
    throw error;
  }
};

const deleteRolePermission = async (role_id) =>
  await aio_cms("map_role_permission").where("role_id", role_id).del();

module.exports = {
  getAllRolePermissions,
  getUserPermission,
  getRolePermission,
  insertRolePermission,
  updateRolePermission,
  deleteRolePermission,
};
