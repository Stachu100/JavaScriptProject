const express = require("express");
const router = express.Router();
const { registerCtrl, loginCtrl, checkUserExistsCtrl } = require("../controllers/usersController");

router.use(express.json());

router.post("/addUser", registerCtrl);
router.post("/login", loginCtrl);
router.get("/exists/:username", checkUserExistsCtrl);

module.exports = router;