const express = require("express");
const router = express.Router();
const {
    addBookCtrl,
    getBooksCtrl,
    deleteBookCtrl,
    editBookCtrl,
} = require("../controllers/booksController");

router.post("/addBook", ...addBookCtrl);
router.get  ("/getBooks", getBooksCtrl);
router.delete("/deleteBooks/:id",deleteBookCtrl);
router.put("/editBooks/:id", ...editBookCtrl);

module.exports = router;