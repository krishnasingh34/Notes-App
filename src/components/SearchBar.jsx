"use client"

import { useState } from "react"
import "../styles/SearchBar.css"

const SearchBar = ({ searchQuery, onSearchChange, sortBy, onSortChange }) => {
  const [showFilters, setShowFilters] = useState(false)

  const clearSearch = () => {
    onSearchChange("")
  }

  const hasActiveSearch = searchQuery.trim()

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search notes by title or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          className={`filter-toggle ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
          title="Show sort options"
        >
          ⚙️
        </button>
        {hasActiveSearch && (
          <button className="clear-search" onClick={clearSearch} title="Clear search">
            ✕
          </button>
        )}
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <label className="filter-label">Sort by:</label>
            <select className="sort-select" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
