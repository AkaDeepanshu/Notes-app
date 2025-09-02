import express from "express";
import {
  getNotes,
  createNote,
  deleteNote,
} from "../controllers/noteController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Note routes
router.route("/").get(getNotes).post(createNote);
router.route("/:id").delete(deleteNote);

export default router;
