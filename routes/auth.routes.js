const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

router.get("/users", authController.getAllUsers);
router.post("/token/create", authController.createSessionToken);
router.post("/token/verify", authController.verifySessionToken);
router.post("/users/create", authController.createUser);
router.post("/users/login", authController.login);

module.exports = router;
