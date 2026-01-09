import { Router } from "express"
const router = Router()
import * as noteController from "../controllers/note.controller"
router.get("/",(req,res)=>{
    res.json({success:" Note Route is running"})
})

router.post("/create",noteController.createNote)
router.post("/update",noteController.updateNote)
router.delete("/delete/:id",noteController.deleteNote)
router.get("/getall",noteController.getAll)
router.get("/getbyid/:id",noteController.getById)

export default router