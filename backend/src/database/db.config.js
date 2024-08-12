const db = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  useNullAsDefault: false,
  log: {
    warn(message) {
      console.log(message);
    },
    error(message) {
      console.log(message);
    },
    deprecate(message) {
      console.log(message);
    },
    debug(message) {
      console.log(message);
    },
  },
});

// db.on("query", (query) => {
//   console.log("Executing query:", query.sql);
// });

db.on("query-error", (error, query) => {
  console.error("Query failed:", query.sql);
  console.error("Error:", error);
});

db.client.config.connectionOptions = { multipleStatements: false };

module.exports = db;
