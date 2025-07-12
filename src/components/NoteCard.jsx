"use client"
import "../styles/NoteCard.css"

const NoteCard = ({ note, onClick }) => {
  const getPlainTextPreview = (htmlContent) => {
    const div = document.createElement("div")
    div.innerHTML = htmlContent
    const text = div.textContent || div.innerText || ""
    return text.length > 100 ? text.substring(0, 100) + "..." : text
  }

  // Format ISO date string to 'DD/MM/YYYY, HH:MM AM/PM'
  const formatDate = (isoString) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="note-card" onClick={onClick}>
      <h3 className="note-title">{note.title || "Untitled"}</h3>
      <p className="note-preview">{getPlainTextPreview(note.content)}</p>

      <div className="note-meta">
        <span className="note-date">Updated: {formatDate(note.updated_at)}</span>
      </div>
    </div>
  )
}

export default NoteCard
