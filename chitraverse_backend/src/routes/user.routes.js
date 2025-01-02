import { Router } from 'express';
import {changeCurrentPassword, forgotPassword, getUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword, updateAccountDetails, updateAvatar, updateCoverImage} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middlewares.js";
import{verifyJWT}from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",  
            maxCount:1
        }
    ]),
    registerUser);

router.route('/login').post(loginUser);
router.route('/refreshToken').post(refreshAccessToken);

// Secure Routes

router.route('/logout').post(verifyJWT, logoutUser);
router.route('/changepassword').post(verifyJWT, changeCurrentPassword);
router.route('/viewuser').post(verifyJWT, getUser);
router.route('/updatedetails').post(verifyJWT, updateAccountDetails);
router.route('/updateavatar').post(
    upload.fields([
    {
        name:"avatar",
        maxCount:1
    }
]),verifyJWT, updateAvatar);

router.route('/updatecoverimage').post(
    upload.fields([
    {
        name:"coverImage",
        maxCount:1
    }
]),verifyJWT, updateCoverImage);

router.route('/getchannelprofile').post(verifyJWT, getUserChannelProfile);
router.route('/getwatchhistory').post(verifyJWT, getWatchHistory);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').post(resetPassword);

export default router