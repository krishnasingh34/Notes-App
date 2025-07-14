import { useState, useMemo, useEffect } from "react"
import { supabase } from "../supabaseClient"
import NoteCard from "./NoteCard.jsx"
import NoteDetails from "./NoteDetails.jsx"
import SearchBar from "./SearchBar.jsx"
import LoginRequiredModal from "./LoginRequiredModal.jsx"
import "../styles/App.css"

const defaultNotes = [
  {
    id: 1,
    title: "Welcome to Notes",
    content:
      "<p>This is your <strong>first note</strong> with <em>rich text</em> support! You can now:</p><ul><li>Format text with <strong>bold</strong> and <em>italic</em></li><li>Create bullet lists</li><li>Search through your notes</li></ul><p>Click to edit or create a new one!</p>",
    created_at: new Date("2024-01-15").toISOString(),
    updated_at: new Date("2024-01-15").toISOString(),
  },
  {
    id: 2,
    title: "Meeting Notes",
    content:
      "<p><strong>Q1 Planning Meeting</strong></p><ol><li>Discuss project timeline</li><li>Review deliverables</li><li>Assign responsibilities</li></ol><p><em>Next meeting: Friday 2PM</em></p>",
    created_at: new Date("2024-01-16").toISOString(),
    updated_at: new Date("2024-01-16").toISOString(),
  },
  {
    id: 3,
    title: "Recipe Ideas",
    content:
      "<p><strong>Dinner Ideas for This Week:</strong></p><ul><li>Pasta with marinara sauce</li><li>Grilled chicken with vegetables</li><li>Stir-fry with tofu</li></ul><p><em>Don't forget to buy groceries!</em></p>",
    created_at: new Date("2024-01-17").toISOString(),
    updated_at: new Date("2024-01-17").toISOString(),
  },
]

const NotesDashboard = () => {
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("updated")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Fetch user session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }
    getSession()
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  // Fetch notes from Supabase for logged-in user
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      if (user) {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
        setNotes(data || [])
      } else {
        setNotes(defaultNotes)
      }
      setLoading(false)
    }
    fetchNotes()
  }, [user])

  // Realtime subscription for notes (update UI, no console.log)
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('public:notes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${user.id}` },
        (payload) => {
          fetchNotes();
        }
      )
      .subscribe();

    async function fetchNotes() {
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      setNotes(data || []);
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    let filtered = notes
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          getPlainTextFromHTML(note.content).toLowerCase().includes(query)
      )
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "created":
          return new Date(b.created_at) - new Date(a.created_at)
        case "updated":
        default:
          return new Date(b.updated_at) - new Date(a.updated_at)
      }
    })
    return filtered
  }, [notes, searchQuery, sortBy])

  const getPlainTextFromHTML = (htmlContent) => {
    const div = document.createElement("div")
    div.innerHTML = htmlContent
    return div.textContent || div.innerText || ""
  }

  const createNewNote = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    setSelectedNoteId(null)
    setIsCreating(true)
  }

  const saveNote = async (noteData) => {
    if (!user) return
    if (isCreating) {
      // Create new note in Supabase
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            user_id: user.id,
            title: noteData.title,
            content: noteData.content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
      if (!error && data && data[0]) {
        setNotes([data[0], ...notes])
        setSelectedNoteId(data[0].id)
        setIsCreating(false)
      }
    } else {
      // Update note in Supabase
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: noteData.title,
          content: noteData.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedNoteId)
        .eq("user_id", user.id)
        .select()
      if (!error && data && data[0]) {
        setNotes(notes.map((n) => (n.id === selectedNoteId ? data[0] : n)))
      }
    }
  }

  const deleteNote = async (noteId) => {
    if (!user) return
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", user.id)
    if (!error) {
      setNotes(notes.filter((note) => note.id !== noteId))
      setSelectedNoteId(null)
      setIsCreating(false)
    }
  }

  const selectNote = (noteId) => {
    setSelectedNoteId(noteId)
    setIsCreating(false)
  }

  const goBackToList = () => {
    setSelectedNoteId(null)
    setIsCreating(false)
  }

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  return (
    <main className="main-content">
      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      {loading ? (
        <div className="empty-state">Loading notes...</div>
      ) : selectedNoteId || isCreating ? (
        <NoteDetails
          note={selectedNote}
          isCreating={isCreating}
          onSave={saveNote}
          onDelete={deleteNote}
          onBack={goBackToList}
        />
      ) : (
        <div className="dashboard">
          <div className="dashboard-header">
            <button className="btn btn-primary" onClick={createNewNote}>
              + New Note
            </button>
          </div>
          <div className="notes-grid">
            {filteredNotes.length === 0 ? (
              <div className="empty-state">
                {notes.length === 0 ? (
                  <p>No notes yet. Create your first note!</p>
                ) : (
                  <p>No notes match your search criteria.</p>
                )}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => selectNote(note.id)} />
              ))
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default NotesDashboard 