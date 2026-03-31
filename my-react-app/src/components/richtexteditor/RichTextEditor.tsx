import { useEffect, useState } from "react"
import type { SerializedEditorState } from "lexical"
import { Editor } from "@/components/blocks/editor"

interface SerializedEditorProps {
  value: SerializedEditorState
  onChange: (value: SerializedEditorState) => void
}

export function RichTextEditor({ value, onChange }: SerializedEditorProps) {
  const [editorState, setEditorState] = useState(value)

  useEffect(() => {
    setEditorState(value)
  }, [value])

  const handleChange = (newState: SerializedEditorState) => {
    setEditorState(newState)
    onChange(newState)
  }


  <Editor
    editorSerializedState={editorState}
    onSerializedChange={handleChange}
  />
}
