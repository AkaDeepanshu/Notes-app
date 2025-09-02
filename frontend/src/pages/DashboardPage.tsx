import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { getNotes, createNote, deleteNote } from "../services/api";
import toast from "react-hot-toast";

import logo from "../assets/icon.png";
interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await getNotes();
      setNotes(response.data);
    } catch (error: any) {
      toast.error("Failed to fetch notes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      const response = await createNote(noteContent);
      setNotes([response.data, ...notes]);
      setNoteContent("");
    } catch (error: any) {
      toast.error("Failed to create note");
      console.error(error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error: any) {
      toast.error("Failed to delete note");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-7 h-7" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <button onClick={logout} className="text-blue-500 underline">
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white shadow-[2px_1px_8px_rgba(0,0,0,0.2)] rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="bg-white md:w-1/3 rounded-lg  mb-6">
            <h3 className="text-xl font-bold mb-4">Create Note</h3>
            <form onSubmit={handleCreateNote}>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28 max-[400px]:h-20 sm:h-28"
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <div className="mt-3">
                <Button type="submit">Create Note</Button>
              </div>
            </form>
          </div>

          <div className="bg-white md:w-2/3 rounded-lg ">
            <h3 className="text-xl font-bold mb-4">Notes</h3>

            {loading ? (
              <p className="text-center py-4">Loading notes...</p>
            ) : notes.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                No notes yet. Create your first note above!
              </p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className=" shadow p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p>{note.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className=" hover:text-red-500"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
