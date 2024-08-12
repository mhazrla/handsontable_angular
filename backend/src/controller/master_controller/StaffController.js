const model = require("./../../model/staff.model");
const api = require("./../../tools/common");

getStaffById = async (req, res) => {
    if(!isNaN(req.params.id)){
        let data = await model.getById(req.params.id);
        return api.ok(res, data);
    } else {
        return api.error(res, "Bad Request", 400);
    }
}

getAllStaff = async (req, res) => {
    let data = await model.getAll();
    return api.ok(res, data);
}

insertStaff = async (req, res) => {
    let data = await model.insert(req.body.form_data);
    return api.ok(res, data);
}

updateStaff = async (req, res) => {
    let data = await model.update(req.params.id, req.body.form_data);
    return api.ok(res, data);
}

module.exports = {
    getStaffById,
    getAllStaff,
    insertStaff,
    updateStaff,
};