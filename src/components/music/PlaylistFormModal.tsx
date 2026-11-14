import React, { useState } from "react"
import { Modal } from "../common/Modal"
import { Button } from "../common/Button"
import { InputField } from "../forms/InputField"

interface PlaylistFormModalProps {
  open: boolean
  title: string
  submitLabel: string
  initialName?: string
  initialDescription?: string
  onClose: () => void
  onSubmit: (name: string, description: string) => Promise<void>
}

export const PlaylistFormModal: React.FC<PlaylistFormModalProps> = (props) =>
  props.open ? <PlaylistForm {...props} /> : null

const PlaylistForm: React.FC<PlaylistFormModalProps> = ({
  open,
  title,
  submitLabel,
  initialName = "",
  initialDescription = "",
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError("Give your playlist a name")

    setLoading(true)
    setError("")
    try {
      await onSubmit(name.trim(), description.trim())
      onClose()
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          id="playlist-name"
          label="Name"
          placeholder="My playlist"
          value={name}
          maxLength={100}
          autoFocus
          error={error}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          id="playlist-description"
          label="Description (optional)"
          placeholder="Add a short description"
          value={description}
          maxLength={300}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
