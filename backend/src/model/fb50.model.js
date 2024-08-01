const aio_journal = require("../database/db.config");

const getAllFb50 = async (trx) => {
  const query = aio_journal("tr_fb50_header")
    .select(
      "tr_fb50_sap.id",
      "tr_fb50_header.id as id_fb50_header",
      "tr_fb50_sap.document_number",
      "tr_fb50_header.company_code",
      "tr_fb50_header.year",
      "tr_fb50_sap.document_date",
      "tr_fb50_header.posting_date",
      "tr_fb50_header.reference",
      "tr_fb50_sap.user_create",
      "tr_fb50_sap.status",
      "tr_fb50_sap.reversal_reason",
      "tr_fb50_header.reference"
    )
    .join("tr_fb50_sap", "tr_fb50_sap.fb50_header", "=", "tr_fb50_header.id");

  if (trx) {
    return query.transacting(trx);
  }

  return query;
};

const getFb50 = async (id, trx) => {
  const query = aio_journal("tr_fb50_header")
    .join("tr_fb50_sap", "tr_fb50_header.id", "tr_fb50_sap.fb50_header")
    .select("tr_fb50_header.*", "tr_fb50_sap.status as status")
    .where("tr_fb50_header.id", id);
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const getFb50Detail = async (id, trx) => {
  const query = aio_journal("tr_fb50_detail").where("fb50_header", id);
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const insertFb50 = async (data, trx) =>
  await aio_journal("tr_fb50_header").transacting(trx).insert(data);

const insertFb50Detail = async (data) =>
  await aio_journal("tr_fb50_detail").insert(data);

const insertFb50Sap = async (data, trx) =>
  await aio_journal("tr_fb50_sap").transacting(trx).insert(data);

const updateFb50 = async (id, data, trx) => {
  await aio_journal("tr_fb50_header")
    .where("id", id)
    .transacting(trx)
    .update(data);
};

const updateFb50Detail = async (id, data) =>
  await aio_journal("tr_fb50_detail").where("fb50_header", id).update(data);

const updateFb50Sap = async (id, data, trx) =>
  await aio_journal("tr_fb50_sap")
    .transacting(trx)
    .where("fb50_header", id)
    .update(data);

const deleteFb50Detail = async (id, trx) => {
  const query = aio_journal("tr_fb50_detail").where("fb50_header", id);

  if (trx) {
    return query.transacting(trx).del();
  }

  return query.del();
};

module.exports = {
  getAllFb50,
  getFb50,
  getFb50Detail,
  insertFb50,
  insertFb50Detail,
  insertFb50Sap,
  updateFb50,
  updateFb50Detail,
  updateFb50Sap,
  deleteFb50Detail,
};
