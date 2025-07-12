"use client"

import { useState } from "react"
import "../styles/TagManager.css"

const TagManager = ({ tags = [], onChange, allTags = [] }) => {
  const [newTag, setNewTag] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag])
    }
    setNewTag("")
    setShowSuggestions(false)
  }

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(newTag)
    } else if (e.key === "Backspace" && !newTag && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const suggestedTags = allTags
    .filter((tag) => !tags.includes(tag) && tag.toLowerCase().includes(newTag.toLowerCase()) && newTag.trim())
    .slice(0, 5)

  return (
    <div className="tag-manager">
      <label className="tag-label">Tags:</label>
      <div className="tags-container">
        <div className="tags-list">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button type="button" className="tag-remove" onClick={() => removeTag(tag)} title="Remove tag">
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="tag-input"
            placeholder="Add tags..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
        </div>

        {showSuggestions && suggestedTags.length > 0 && (
          <div className="tag-suggestions">
            {suggestedTags.map((tag) => (
              <button key={tag} type="button" className="tag-suggestion" onClick={() => addTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      <small className="tag-hint">Press Enter or comma to add tags</small>
    </div>
  )
}

export default TagManager
