const express = require("express");
const router = express.Router();
const { registerCtrl, loginCtrl } = require("../controllers/usersController");

router.use(express.json());

router.post("/addUser", registerCtrl);
router.post("/login", loginCtrl);

module.exports = router;