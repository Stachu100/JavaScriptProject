const express = require("express");
const router = express.Router();
const bc = require("../controllers/borrowedBooksController");

router.use(express.json());

router.post("/borrow", bc.borrowCtrl);
router.get("/getUserBorrowedBooks/:userId", bc.getUserBorrowedBooksCtrl);
router.get("/getUserBorrowedUserBooks/:userName", bc.getUserBorrowedUserBooksCtrl);
router.post("/return", bc.returnCtrl);

module.exports = router;