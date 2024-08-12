const { verifyToken } = require("../services/auth.service");

const hasAccess = (permissionCode) => {
  return async (req, res, next) => {
    verifyToken(req, res, () => {
      try {
        const permissions = req.user && req.user.permissions;

        if (!permissions) {
          return res.status(403).json({ error: "Forbidden" });
        }

        const permission = permissions.split(",");
        if (permission.includes(permissionCode)) {
          next();
        } else {
          return res.status(403).json({ error: "Forbidden" });
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  };
};

const groupAndConcatPermissions = (data) => {
  const result = {};
  data.forEach((row) => {
    const { role_id, role_name, role_detail, permission_id, permission_code } =
      row;
    if (!result[role_name]) {
      result[role_name] = {
        role_id,
        role_name,
        role_detail,
        permissions: [{ permission_id, permission_code }],
      };
    } else {
      result[role_name].permissions.push({
        permission_id,
        permission_code,
      });
    }
  });

  return Object.values(result);
};

const groupAndConcatSingleRolePermissions = (data) => {
  const result = {};

  data.forEach((row) => {
    const { role_id, role_name, role_detail, permission_id, permission_code } =
      row;

    if (!result[role_id]) {
      result[role_id] = {
        role_id,
        role_name,
        role_detail,
        permission: [{ id: permission_id, code: permission_code }],
      };
    } else {
      result[role_id].permission.push({
        id: permission_id,
        code: permission_code,
      });
    }
  });

  return Object.values(result);
};

module.exports = {
  groupAndConcatPermissions,
  groupAndConcatSingleRolePermissions,
  hasAccess,
};
