const { getByUserId, getAll } = require("../models/historyBooksModel");

const getUserHistoryCtrl = async (req, res, next) => {
    try { res.json(await getByUserId(req.params.userId)); }
    catch (err) { next(err); }
};

const getAllHistoryCtrl = async (req, res, next) => {
    try { res.json(await getAll()); }
    catch (err) { next(err); }
};

module.exports = { getUserHistoryCtrl, getAllHistoryCtrl };