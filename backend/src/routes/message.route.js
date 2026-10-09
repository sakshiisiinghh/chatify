import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {getUsersForSidebar,getMessages,sendMessage,deleteConversation} from "../controllers/message.controller.js";

const router=express.Router();

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:userId",protectRoute,getMessages);
router.post("/send/:userId",protectRoute,sendMessage);
router.delete("/:userId",protectRoute,deleteConversation);
export default router;