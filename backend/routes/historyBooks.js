const express = require("express");
const router = express.Router();
const hc = require("../controllers/historyBooksController");

router.get("/getUserHistoryBooks/:userId", hc.getUserHistoryCtrl);
router.get("/getAllHistoryBooks", hc.getAllHistoryCtrl);

module.exports = router;