function ok(res, data) {
  return res.status(200).json({
    status: true,
    data: data,
  });
}

function error(res, message, code) {
  return res.status(code).json({
    status: false,
    data: {
      message: message,
    },
  });
}

const handleError = (obj, req, res) => {
  const wrappedObject = Object.create(obj);

  for (const key in obj) {
    if (typeof obj[key] === "function") {
      const originalMethod = obj[key];
      wrappedObject[key] = async function () {
        try {
          await originalMethod.apply(this, arguments);
        } catch (error) {
          console.error(error);
          return arguments[1].status(400).json({
            status: false,
            data: {
              message: error.toString(),
            },
          });
        }
      };
    }
  }

  return wrappedObject;
};

module.exports = {
  ok,
  error,
  handleError,
};
