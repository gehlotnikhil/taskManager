import { Router } from "express"
import * as validate from "../validations/auth.validation"
const router = Router()
import * as authController from "../controllers/auth.controller"
import  { verifyToken } from "../middlewares/authMiddleware"
router.get("/",(req,res)=>{
    res.json({success:" Auth is running"})
})

router.post("/register",validate.register,authController.register)
router.post("/login",authController.login)
router.post("/verifycode",authController.verifycode)
router.post("/verifytoken",verifyToken,authController.verifytoken)
router.post("/logout",authController.logout)
export default router