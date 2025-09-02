import { Request, Response } from 'express';
import Note from '../models/noteModel';

// Get all notes for the logged-in user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(notes);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Please provide content for the note' });
  }

  try {
    const note = await Note.create({
      content,
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if the user owns the note
    if (note.user?.toString() !== req.user._id) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();
    return res.status(200).json({ message: 'Note removed' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
