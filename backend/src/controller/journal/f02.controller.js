const f02Model = require("../../model/f02.model");
const db = require("../../database/db.config");
const api = require("../../tools/common");
const moment = require("moment");

const getAllF02 = async (req, res) => {
  try {
    const data = await db.transaction(async (trx) => {
      return await f02Model.getAllF02(trx);
    });
    return api.ok(res, data);
  } catch (error) {
    console.error("Error fetching all f02:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const getF02 = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await db.transaction(async (trx) => {
      const result = await f02Model.getF02(id, trx);
      const f02detail = await f02Model.getF02Detail(id, trx);

      if (result.length === 0) {
        throw new Error("Data not found");
      }

      return {
        f02: result[0],
        details: f02detail,
      };
    });
    return api.ok(res, data);
  } catch (error) {
    if (error.message === "Data not found") {
      return api.error(res, "Data not found!", 404);
    }
    console.error("Error fetching f02:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const insertF02 = async (req, res) => {
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
        const f02 = await f02Model.insertF02(
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

        await f02Model.insertF02Sap(
          {
            user_create: userCreate,
            status: status,
            document_date: formattedDocumentDate,
            f02_header: f02[0],
          },
          trx
        );

        if (f02.length === 0) {
          throw new Error("Bad Request");
        }

        const data = await f02Model.getF02(f02[0], trx);
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

const insertF02Detail = async (req, res) => {
  try {
    const body = req.body;
    let f02_header;
    if (!Array.isArray(body)) {
      return api.error(res, "Invalid data format", 400);
    }

    const formattedDetails = body.map((detail) => {
      f02_header = detail.idHeader;
      return {
        gl_account: detail["GL Account"] || null,
        short_text: detail["Short Text"] || null,
        d_c: detail["D/C"] || null,
        pkey: detail["Pkey"] || null,
        special_g_l: detail["Special G/L"] || null,
        vendor: detail["Vendor"] || null,
        assets: detail["Assets"] || null,
        sub_asset: detail["Sub. Asset"] || null,
        att: detail["ATT"] || null,
        amount_in_document_currency: detail["Amount In Doc. Curr."] || null,
        amount_in_location_currency: detail["Amount In Loc. Curr."] || null,
        tax_code: detail["Tax Code"] || null,
        assignment: detail["Assignment"] || null,
        text: detail["Text"] || null,
        cost_center: detail["Cost Center"] || null,
        order: detail["Order"] || null,
        profit_center: detail["Profit Center"] || null,
        product: detail["Product"] || null,
        bline_date: detail["Bline date"] || null,
        payterm: detail["Payt Terms"] || null,
        wht_type: detail["WHT Type"] || null,
        wht_code: detail["WHT Code"] || null,
        wht_base_amount: detail["WHT Base Amount"] || null,
        wht_tax_amount: detail["WHT Tax Amount"] || null,
        part_bank: detail["Part. Bank"] || null,
        f02_header: detail.idHeader || null,
      };
    });

    const insertResult = await f02Model.insertF02Detail(formattedDetails);

    if (insertResult.length === 0) return api.error(res, "Bad Request", 400);
    const data = await f02Model.getF02Detail(f02_header);

    return api.ok(res, data);
  } catch (error) {
    console.error("Error inserting F02 details:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const updateF02 = async (req, res) => {
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
        await f02Model.updateF02(
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

        await f02Model.deleteF02Detail(id, trx);
        await f02Model.updateF02Sap(
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

const updateF02Detail = async (req, res) => {
  try {
    const body = req.body;
    let f02_header;
    if (!Array.isArray(body)) {
      return api.error(res, "Invalid data format", 400);
    }

    const formattedDetails = body.map((detail) => {
      f02_header = detail.idHeader;
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
        f02_header: detail.idHeader || null,
      };
    });

    const insertResult = await f02Model.insertF02Detail(formattedDetails);

    if (insertResult.length === 0) return api.error(res, "Bad Request", 400);
    const data = await f02Model.getF02Detail(f02_header);

    return api.ok(res, data);
  } catch (error) {
    console.error("Error inserting F02 details:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const deleteF02 = async (req, res) => {
  const { id } = req.params;
  const user = await f02Model.getdF02(id);
  if (user.length === 0) {
    return api.error(res, "User Not Found", 404);
  }

  const data = await f02Model.deleteF02(id);
  if (data.length === 0) {
    return api.error(res, "Bad Request", 400);
  }
  return api.ok(res, data);
};

const reverseF02 = async (req, res) => {
  const { id } = req.params;
  const { reversalReason, postingDate } = req.body;

  const formattedPostingDate = moment(postingDate).format("DD.MM.YYYY");

  try {
    await db.transaction(async (trx) => {
      try {
        await f02Model.updateF02(
          id,
          {
            posting_date: formattedPostingDate,
          },
          trx
        );

        await f02Model.updateF02Sap(
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
  getAllF02,
  getF02,
  insertF02,
  insertF02Detail,
  updateF02,
  updateF02Detail,
  deleteF02,
  reverseF02,
});
