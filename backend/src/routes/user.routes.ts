import { Router } from "express"

const router = Router()
router.get("/",(req,res)=>{
    res.json({success:"User route is running"})
})


export default router