"use client"

import { useRef, useEffect } from "react"
import "../styles/RichTextEditor.css"

const RichTextEditor = ({ content, onChange, placeholder }) => {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || ""
    }
  }, [content])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          execCommand("bold")
          break
        case "i":
          e.preventDefault()
          execCommand("italic")
          break
        case "u":
          e.preventDefault()
          execCommand("underline")
          break
      }
    }
  }

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button type="button" className="toolbar-btn" onClick={() => execCommand("bold")} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button type="button" className="toolbar-btn" onClick={() => execCommand("italic")} title="Italic (Ctrl+I)">
          <em>I</em>
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand("underline")}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div className="toolbar-separator"></div>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="toolbar-separator"></div>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand("removeFormat")}
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  )
}

export default RichTextEditor
