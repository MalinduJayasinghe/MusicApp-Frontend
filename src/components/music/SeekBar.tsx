import React, { useState } from "react"
import { usePlayer } from "../../hooks/usePlayer"
import { formatTime } from "../../util/format"

export const SeekBar: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { progress, duration, seek, current } = usePlayer()
  const [dragValue, setDragValue] = useState<number | null>(null)

  const value = dragValue ?? progress
  const max = duration > 0 ? duration : 1
  const fill = Math.min(100, (value / max) * 100)

  const commit = () => {
    if (dragValue !== null) seek(dragValue)
    setDragValue(null)
  }

  return (
    <div className={`flex items-center gap-2 text-[11px] text-neutral-400 tabular-nums ${className}`}>
      <span className="w-10 text-right">{formatTime(value)}</span>
      <input
        type="range"
        aria-label="Seek"
        className="range"
        min={0}
        max={max}
        step={1}
        value={Math.min(value, max)}
        disabled={!current}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        onChange={(e) => setDragValue(Number(e.target.value))}
        onPointerUp={commit}
        onKeyUp={commit}
        onBlur={commit}
      />
      <span className="w-10">{formatTime(duration)}</span>
    </div>
  )
}
