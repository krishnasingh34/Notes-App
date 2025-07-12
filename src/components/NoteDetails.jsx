"use client"

import { useState, useEffect, useRef } from "react"
import RichTextEditor from "./RichTextEditor.jsx"
import "../styles/NoteDetails.css"

const NoteDetails = ({ note, isCreating, onSave, onDelete, onBack }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const titleInputRef = useRef(null)

  useEffect(() => {
    if (isCreating) {
      setTitle("")
      setContent("")
      setHasChanges(false)
      // Auto-focus on title when creating
      setTimeout(() => titleInputRef.current?.focus(), 100)
    } else if (note) {
      setTitle(note.title)
      setContent(note.content)
      setHasChanges(false)
    }
  }, [note, isCreating])

  useEffect(() => {
    if (!isCreating && note) {
      setHasChanges(title !== note.title || content !== note.content)
    } else if (isCreating) {
      setHasChanges(title.trim() !== "" || content.trim() !== "")
    }
  }, [title, content, note, isCreating])

  const handleSave = () => {
    if (title.trim() === "" && content.trim() === "") {
      return
    }

    onSave({
      title: title.trim() || "Untitled",
      content: content.trim(),
    })
    setHasChanges(false)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id)
    }
  }

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to go back?")) {
        onBack()
      }
    } else {
      onBack()
    }
  }

  // Convert HTML content to plain text for preview
  const getPlainTextPreview = (htmlContent) => {
    const div = document.createElement("div")
    div.innerHTML = htmlContent
    return div.textContent || div.innerText || ""
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
    <div className="note-details">
      <div className="note-details-header">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <div className="note-actions">
          {!isCreating && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSave} disabled={!hasChanges}>
            {isCreating ? "Create Note" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="note-form">
        <input
          ref={titleInputRef}
          type="text"
          className="note-title-input"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editor-section">
          <RichTextEditor content={content} onChange={setContent} placeholder="Start writing your note..." />
        </div>
      </div>

      {!isCreating && note && (
        <div className="note-metadata">
          <p>Created: {formatDate(note.created_at)}</p>
          <p>Last updated: {formatDate(note.updated_at)}</p>
          {getPlainTextPreview(content) && <p>Characters: {getPlainTextPreview(content).length}</p>}
        </div>
      )}
    </div>
  )
}

export default NoteDetails
