const fb60Model = require("../../model/fb60.model");
const db = require("../../database/db.config");
const api = require("../../tools/common");
const moment = require("moment");

const getAllFb60 = async (req, res) => {
  try {
    const data = await db.transaction(async (trx) => {
      return await fb60Model.getAllFb60(trx);
    });
    return api.ok(res, data);
  } catch (error) {
    console.error("Error fetching all fb60:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const getFb60 = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await db.transaction(async (trx) => {
      const result = await fb60Model.getFb60(id, trx);
      const fb60detail = await fb60Model.getFb60Detail(id, trx);

      if (result.length === 0) {
        throw new Error("Data not found");
      }

      return {
        fb60: result[0],
        details: fb60detail,
      };
    });
    return api.ok(res, data);
  } catch (error) {
    if (error.message === "Data not found") {
      return api.error(res, "Data not found!", 404);
    }
    console.error("Error fetching fb60:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const insertFb60 = async (req, res) => {
  const {
    companyCode,
    vendor,
    postingDate,
    invoiceDate,
    period,
    currency,
    amount,
    busPlace,
    text,
    documentType,
    reference,
    headerText,
    baselineDate,
    payterm,
    partBank,
    taxVATCode,
    taxVATAmount,
    whtType,
    whtBaseAmount,
    whtCode,
    whtAmount,
    userCreate,
    status,
  } = req.body;

  console.log(req.body);

  const formattedPostingDate = moment(postingDate).format("DD.MM.YYYY");
  const formattedInvoiceDate = moment(invoiceDate).format("DD.MM.YYYY");
  const formattedBaselineDate = moment(baselineDate).format("DD.MM.YYYY");

  // try {
  //   await db.transaction(async (trx) => {
  //     try {
  //       const fb60 = await fb60Model.insertFb60(
  //         {
  //           company_code: companyCode,
  //           vendor,
  //           posting_date: formattedPostingDate,
  //           period,
  //           currency,
  //           amount,
  //           bus_place: busPlace,
  //           text,
  //           document_type: documentType,
  //           reference,
  //           header_text: headerText,
  //           baseline_date: formattedBaselineDate,
  //           payterm,
  //           part_bank: partBank,
  //           tax_vat_code: taxVATCode,
  //           tax_vat_amount: taxVATAmount,
  //           wht_type: whtType,
  //           wht_base_amount: whtBaseAmount,
  //           wht_code: whtCode,
  //           wht_amount: whtAmount,
  //         },
  //         trx
  //       );

  //       await fb60Model.insertFb60Sap(
  //         {
  //           user_create: userCreate,
  //           status: status,
  //           document_date: formattedInvoiceDate,
  //           fb60_header: fb60[0],
  //         },
  //         trx
  //       );

  //       if (fb60.length === 0) {
  //         throw new Error("Bad Request");
  //       }

  //       const data = await fb60Model.getFb60(fb60[0], trx);
  //       await trx.commit();

  //       return api.ok(res, data);
  //     } catch (error) {
  //       await trx.rollback();
  //       console.error("Transaction failed:", error);
  //       return api.error(res, "Internal Server Error", 500);
  //     }
  //   });
  // } catch (error) {
  //   console.error("Transaction start failed:", error);
  //   return api.error(res, "Internal Server Error", 500);
  // }
};

const insertFb60Detail = async (req, res) => {
  try {
    const body = req.body;
    let fb60_header;
    if (!Array.isArray(body)) {
      return api.error(res, "Invalid data format", 400);
    }

    const formattedDetails = body.map((detail) => {
      fb60_header = detail.idHeader;
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
        fb60_header: detail.idHeader || null,
      };
    });

    const insertResult = await fb60Model.insertFb60Detail(formattedDetails);

    if (insertResult.length === 0) return api.error(res, "Bad Request", 400);
    const data = await fb60Model.getFb60Detail(fb60_header);

    return api.ok(res, data);
  } catch (error) {
    console.error("Error inserting FB60 details:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const updateFb60 = async (req, res) => {
  const { id } = req.params;
  const {
    companyCode,
    vendor,
    postingDate,
    period,
    currency,
    amount,
    busPlace,
    text,
    documentType,
    reference,
    headerText,
    baselineDate,
    payterm,
    partBank,
    taxVATCode,
    taxVATAmount,
    whtType,
    whtBaseAmount,
    whtCode,
    whtAmount,
    status,
  } = req.body;

  const formattedPostingDate = moment(postingDate).format("DD.MM.YYYY");
  const formattedBaselineDate = moment(baselineDate).format("DD.MM.YYYY");

  try {
    await db.transaction(async (trx) => {
      try {
        await fb60Model.updateFb60(
          id,
          {
            company_code: companyCode,
            vendor,
            posting_date: formattedPostingDate,
            period,
            currency,
            amount,
            bus_place: busPlace,
            text,
            document_type: documentType,
            reference,
            header_text: headerText,
            baseline_date: formattedBaselineDate,
            payterm,
            part_bank: partBank,
            tax_vat_code: taxVATCode,
            tax_vat_amount: taxVATAmount,
            wht_type: whtType,
            wht_base_amount: whtBaseAmount,
            wht_code: whtCode,
            wht_amount: whtAmount,
          },
          trx
        );

        await fb60Model.deleteFb60Detail(id, trx);
        await fb60Model.updateFb60Sap(
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

const updateFb60Detail = async (req, res) => {
  try {
    const body = req.body;
    let fb60_header;
    if (!Array.isArray(body)) {
      return api.error(res, "Invalid data format", 400);
    }

    const formattedDetails = body.map((detail) => {
      fb60_header = detail.idHeader;
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
        fb60_header: detail.idHeader || null,
      };
    });

    const insertResult = await fb60Model.insertFb60Detail(formattedDetails);

    if (insertResult.length === 0) return api.error(res, "Bad Request", 400);
    const data = await fb60Model.getFb60Detail(fb60_header);

    return api.ok(res, data);
  } catch (error) {
    console.error("Error inserting FB60 details:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const deleteFb60 = async (req, res) => {
  const { id } = req.params;
  const user = await fb60Model.getdFb60(id);
  if (user.length === 0) {
    return api.error(res, "User Not Found", 404);
  }

  const data = await fb60Model.deleteFb60(id);
  if (data.length === 0) {
    return api.error(res, "Bad Request", 400);
  }
  return api.ok(res, data);
};

const reverseFb60 = async (req, res) => {
  const { id } = req.params;
  const { reversalReason, postingDate } = req.body;

  const formattedPostingDate = moment(postingDate).format("DD.MM.YYYY");

  try {
    await db.transaction(async (trx) => {
      try {
        await fb60Model.updateFb60(
          id,
          {
            posting_date: formattedPostingDate,
          },
          trx
        );

        await fb60Model.updateFb60Sap(
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
  getAllFb60,
  getFb60,
  insertFb60,
  insertFb60Detail,
  updateFb60,
  updateFb60Detail,
  deleteFb60,
  reverseFb60,
});
