const fb50Model = require("../../model/fb50.model");
const db = require("../../database/db.config");
const api = require("../../tools/common");
const moment = require("moment");

const getAllFb50 = async (req, res) => {
  try {
    const data = await db.transaction(async (trx) => {
      return await fb50Model.getAllFb50(trx);
    });
    return api.ok(res, data);
  } catch (error) {
    console.error("Error fetching all fb50:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const getFb50 = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await db.transaction(async (trx) => {
      const result = await fb50Model.getFb50(id, trx);
      const fb50detail = await fb50Model.getFb50Detail(id, trx);

      if (result.length === 0) {
        throw new Error("Data not found");
      }

      return {
        fb50: result[0],
        details: fb50detail,
      };
    });
    return api.ok(res, data);
  } catch (error) {
    if (error.message === "Data not found") {
      return api.error(res, "Data not found!", 404);
    }
    console.error("Error fetching fb50:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const insertFb50 = async (req, res) => {
  const {
    companyCode,
    documentDate,
    postingDate,
    headerText,
    reference,
    documentType,
    period,
    year,
    currency,
    busPlace,
    userCreate,
    status,
  } = req.body;

  const formattedPostingDate = moment(postingDate).format("DD.MM.YYYY");
  const formattedDocumentDate = moment(documentDate).format("DD.MM.YYYY");

  try {
    await db.transaction(async (trx) => {
      try {
        const fb50 = await fb50Model.insertFb50(
          {
            company_code: companyCode,
            posting_date: formattedPostingDate,
            document_date: formattedDocumentDate,
            period,
            year,
            currency,
            bus_place: busPlace,
            document_type: documentType,
            reference,
            header_text: headerText,
          },
          trx
        );

        await fb50Model.insertFb50Sap(
          {
            user_create: userCreate,
            status: status,
            document_date: formattedDocumentDate,
            fb50_header: fb50[0],
          },
          trx
        );

        if (fb50.length === 0) {
          throw new Error("Bad Request");
        }

        const data = await fb50Model.getFb50(fb50[0], trx);
        await trx.commit();

        return api.ok(res, data);
      } catch (error) {
        await trx.rollback();
        console.error("Transaction failed:", error);
        return api.error(res, "Internal Server Error", 500);
      }
    });
  } catch (error) {
    console.error("Transaction start failed:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const insertFb50Detail = async (req, res) => {
  try {
    const body = req.body;
    let fb50_header;
    if (!Array.isArray(body)) {
      return api.error(res, "Invalid data format", 400);
    }

    const formattedDetails = body.map((detail) => {
      fb50_header = detail.idHeader;
      return {
        gl_account: detail["GL Account"] || null,
        short_text: detail["Short Text"] || null,
        d_c: detail["D/C"] || null,
        amount_in_document_currency: detail["Amount In Doc .Curr."] || null,
        tax_code: detail["Tax Code"] || null,
        assignment: detail["Assignment"] || null,
        text: detail["Text"] || null,
        cost_center: detail["Cost Center"] || null,
        order: detail["Order"] || null,
        profit_center: detail["Profit Center"] || null,
        profit_segment: detail["Profit Segment"] || null,
        fb50_header: detail.idHeader || null,
      };
    });

    const insertResult = await fb50Model.insertFb50Detail(formattedDetails);

    if (insertResult.length === 0) return api.error(res, "Bad Request", 400);
    const data = await fb50Model.getFb50Detail(fb50_header);

    return api.ok(res, data);
  } catch (error) {
    console.error("Error inserting FB50 details:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const updateFb50 = async (req, res) => {
  const { id } = req.params;
  const {
    companyCode,
    documentDate,
    postingDate,
    headerText,
    reference,
    documentType,
    period,
    year,
    currency,
    busPlace,
    status,
  } = req.body;


  const formattedPostingDate = moment(postingDate).format("DD.MM.YYYY");
  const formattedDocumentDate = moment(documentDate).format("DD.MM.YYYY");

  try {
    await db.transaction(async (trx) => {
      try {
        await fb50Model.updateFb50(
          id,
          {
            company_code: companyCode,
            posting_date: formattedPostingDate,
            document_date: formattedDocumentDate,
            period,
            currency,
            bus_place: busPlace,
            document_type: documentType,
            reference,
            header_text: headerText,
            year,
          },
          trx
        );

        await fb50Model.deleteFb50Detail(id, trx);
        await fb50Model.updateFb50Sap(
          id,
          {
            status: status,
          },
          trx
        );
        await trx.commit();

        return api.ok(res, []);
      } catch (error) {
        await trx.rollback();
        console.error("Transaction failed:", error);
        return api.error(res, "Internal Server Error", 500);
      }
    });
  } catch (error) {
    console.error("Transaction start failed:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const updateFb50Detail = async (req, res) => {
  try {
    const body = req.body;
    let fb50_header;
    if (!Array.isArray(body)) {
      return api.error(res, "Invalid data format", 400);
    }

    const formattedDetails = body.map((detail) => {
      fb50_header = detail.idHeader;
      return {
        gl_account: detail["GL Account"] || null,
        short_text: detail["Short Text"] || null,
        d_c: detail["D/C"] || null,
        amount_in_document_currency: detail["Amount In Doc .Curr."] || null,
        assignment: detail["Assignment"] || null,
        text: detail["Text"] || null,
        cost_center: detail["Cost Center"] || null,
        order: detail["Order"] || null,
        profit_center: detail["Profit Center"] || null,
        profit_segment: detail["Profit Segment"] || null,
        fb50_header: detail.idHeader || null,
      };
    });

    const insertResult = await fb50Model.insertFb50Detail(formattedDetails);

    if (insertResult.length === 0) return api.error(res, "Bad Request", 400);
    const data = await fb50Model.getFb50Detail(fb50_header);

    return api.ok(res, data);
  } catch (error) {
    console.error("Error inserting FB50 details:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const deleteFb50 = async (req, res) => {
  const { id } = req.params;
  const user = await fb50Model.getdFb50(id);
  if (user.length === 0) {
    return api.error(res, "User Not Found", 404);
  }

  const data = await fb50Model.deleteFb50(id);
  if (data.length === 0) {
    return api.error(res, "Bad Request", 400);
  }
  return api.ok(res, data);
};

const reverseFb50 = async (req, res) => {
  const { id } = req.params;
  const { reversalReason, postingDate } = req.body;

  const formattedPostingDate = moment(postingDate).format("DD.MM.YYYY");

  try {
    await db.transaction(async (trx) => {
      try {
        await fb50Model.updateFb50(
          id,
          {
            posting_date: formattedPostingDate,
          },
          trx
        );

        await fb50Model.updateFb50Sap(
          id,
          {
            status: "Submit",
            reversal_reason: reversalReason,
          },
          trx
        );
        await trx.commit();

        return api.ok(res, []);
      } catch (error) {
        await trx.rollback();
        console.error("Transaction failed:", error);
        return api.error(res, "Internal Server Error", 500);
      }
    });
  } catch (error) {
    console.error("Transaction start failed:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

module.exports = api.handleError({
  getAllFb50,
  getFb50,
  insertFb50,
  insertFb50Detail,
  updateFb50,
  updateFb50Detail,
  deleteFb50,
  reverseFb50,
});
