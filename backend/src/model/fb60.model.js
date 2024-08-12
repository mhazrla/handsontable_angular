const aio_journal = require("./../database/db.config");

const getAllFb60 = async (trx) => {
  const query = aio_journal("tr_fb60_header")
    .select(
      "tr_fb60_sap.id",
      "tr_fb60_header.id as id_fb60_header",
      "tr_fb60_header.company_code",
      "tr_fb60_header.year",
      "tr_fb60_header.vendor",
      "tr_fb60_sap.document_date",
      "tr_fb60_header.posting_date",
      "tr_fb60_sap.document_number",
      "tr_fb60_sap.user_create",
      "tr_fb60_sap.status",
      "tr_fb60_sap.reversal_reason",
      "tr_fb60_header.reference"
    )
    .join("tr_fb60_sap", "tr_fb60_sap.fb60_header", "=", "tr_fb60_header.id");

  if (trx) {
    return query.transacting(trx);
  }

  return query;
};

const getFb60 = async (id, trx) => {
  const query = aio_journal("tr_fb60_header")
    .join("tr_fb60_sap", "tr_fb60_header.id", "tr_fb60_sap.fb60_header")
    .select("tr_fb60_header.*", "tr_fb60_sap.status as status")
    .where("tr_fb60_header.id", id);
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const getFb60Detail = async (id, trx) => {
  const query = aio_journal("tr_fb60_detail").where("fb60_header", id);
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const insertFb60 = async (data, trx) =>
  await aio_journal("tr_fb60_header").transacting(trx).insert(data);

const insertFb60Detail = async (data) =>
  await aio_journal("tr_fb60_detail").insert(data);

const insertFb60Sap = async (data, trx) =>
  await aio_journal("tr_fb60_sap").transacting(trx).insert(data);

const updateFb60 = async (id, data, trx) => {
  await aio_journal("tr_fb60_header")
    .where("id", id)
    .transacting(trx)
    .update(data);
};

const updateFb60Detail = async (id, data) =>
  await aio_journal("tr_fb60_detail").where("fb60_header", id).update(data);

const updateFb60Sap = async (id, data, trx) =>
  await aio_journal("tr_fb60_sap")
    .transacting(trx)
    .where("fb60_header", id)
    .update(data);

const deleteFb60Detail = async (id, trx) => {
  const query = aio_journal("tr_fb60_detail").where("fb60_header", id);

  if (trx) {
    return query.transacting(trx).del();
  }

  return query.del();
};

module.exports = {
  getAllFb60,
  getFb60,
  getFb60Detail,
  insertFb60,
  insertFb60Detail,
  insertFb60Sap,
  updateFb60,
  updateFb60Detail,
  updateFb60Sap,
  deleteFb60Detail,
};
