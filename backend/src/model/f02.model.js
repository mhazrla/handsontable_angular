const aio_journal = require("../database/db.config");

const getAllF02 = async (trx) => {
  const query = aio_journal("tr_f02_header")
    .select(
      "tr_f02_sap.id",
      "tr_f02_header.id as id_f02_header",
      "tr_f02_sap.document_number",
      "tr_f02_header.company_code",
      "tr_f02_header.year",
      "tr_f02_sap.document_date",
      "tr_f02_header.posting_date",
      "tr_f02_header.reference",
      "tr_f02_sap.user_create",
      "tr_f02_sap.status",
      "tr_f02_sap.reversal_reason",
      "tr_f02_header.reference"
    )
    .join("tr_f02_sap", "tr_f02_sap.f02_header", "=", "tr_f02_header.id");

  if (trx) {
    return query.transacting(trx);
  }

  return query;
};

const getF02 = async (id, trx) => {
  const query = aio_journal("tr_f02_header")
    .join("tr_f02_sap", "tr_f02_header.id", "tr_f02_sap.f02_header")
    .select("tr_f02_header.*", "tr_f02_sap.status as status")
    .where("tr_f02_header.id", id);
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const getF02Detail = async (id, trx) => {
  const query = aio_journal("tr_f02_detail").where("f02_header", id);
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const insertF02 = async (data, trx) =>
  await aio_journal("tr_f02_header").transacting(trx).insert(data);

const insertF02Detail = async (data) =>
  await aio_journal("tr_f02_detail").insert(data);

const insertF02Sap = async (data, trx) =>
  await aio_journal("tr_f02_sap").transacting(trx).insert(data);

const updateF02 = async (id, data, trx) => {
  await aio_journal("tr_f02_header")
    .where("id", id)
    .transacting(trx)
    .update(data);
};

const updateF02Detail = async (id, data) =>
  await aio_journal("tr_f02_detail").where("f02_header", id).update(data);

const updateF02Sap = async (id, data, trx) =>
  await aio_journal("tr_f02_sap")
    .transacting(trx)
    .where("f02_header", id)
    .update(data);

const deleteF02Detail = async (id, trx) => {
  const query = aio_journal("tr_f02_detail").where("f02_header", id);

  if (trx) {
    return query.transacting(trx).del();
  }

  return query.del();
};

module.exports = {
  getAllF02,
  getF02,
  getF02Detail,
  insertF02,
  insertF02Detail,
  insertF02Sap,
  updateF02,
  updateF02Detail,
  updateF02Sap,
  deleteF02Detail,
};
