import express from "express";
import { registerUser, loginUser, 
    logoutUser, getMyProfile,
    getAllUsers } from "../controllers/userController.js";
import { isAuthenticatedAccess, isAuthrorizeRoles } from "../middlewares/Authentication.js";

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticatedAccess, logoutUser);
router.route('/myprofile').get(isAuthenticatedAccess,getMyProfile);

router.route("/admin/getallusers").get(isAuthenticatedAccess, isAuthrorizeRoles("admin"), getAllUsers); 

export default router;