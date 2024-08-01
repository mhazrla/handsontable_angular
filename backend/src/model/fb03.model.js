const aio_journal = require("../database/db.config");

const getAllFb03 = async (trx) => {
  const query = aio_journal("tr_fb03_header")
    .select(
      "tr_fb03_sap.id",
      "tr_fb03_header.id as id_fb03_header",
      "tr_fb03_sap.document_number",
      "tr_fb03_header.company_code",
      "tr_fb03_header.year",
      "tr_fb03_sap.document_date",
      "tr_fb03_header.posting_date",
      "tr_fb03_header.reference",
      "tr_fb03_sap.user_create",
      "tr_fb03_sap.status",
      "tr_fb03_sap.reversal_reason",
      "tr_fb03_header.reference"
    )
    .join("tr_fb03_sap", "tr_fb03_sap.fb03_header", "=", "tr_fb03_header.id");

  if (trx) {
    return query.transacting(trx);
  }

  return query;
};

const getFb03 = async (id, trx) => {
  const query = aio_journal("tr_fb03_header")
    .join("tr_fb03_sap", "tr_fb03_header.id", "tr_fb03_sap.fb03_header")
    .select("tr_fb03_header.*", "tr_fb03_sap.status as status")
    .where("tr_fb03_header.id", id);
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const getFb03Detail = async (id, trx) => {
  const query = aio_journal("tr_fb03_detail").where("fb03_header", id);
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const insertFb03 = async (data, trx) =>
  await aio_journal("tr_fb03_header").transacting(trx).insert(data);

const insertFb03Detail = async (data) =>
  await aio_journal("tr_fb03_detail").insert(data);

const insertFb03Sap = async (data, trx) =>
  await aio_journal("tr_fb03_sap").transacting(trx).insert(data);

const updateFb03 = async (id, data, trx) => {
  await aio_journal("tr_fb03_header")
    .where("id", id)
    .transacting(trx)
    .update(data);
};

const updateFb03Detail = async (id, data) =>
  await aio_journal("tr_fb03_detail").where("fb03_header", id).update(data);

const updateFb03Sap = async (id, data, trx) =>
  await aio_journal("tr_fb03_sap")
    .transacting(trx)
    .where("fb03_header", id)
    .update(data);

const deleteFb03Detail = async (id, trx) => {
  const query = aio_journal("tr_fb03_detail").where("fb03_header", id);

  if (trx) {
    return query.transacting(trx).del();
  }

  return query.del();
};

module.exports = {
  getAllFb03,
  getFb03,
  getFb03Detail,
  insertFb03,
  insertFb03Detail,
  insertFb03Sap,
  updateFb03,
  updateFb03Detail,
  updateFb03Sap,
  deleteFb03Detail,
};
