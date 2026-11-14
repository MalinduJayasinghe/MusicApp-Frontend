import React from "react"

export const EqualizerIcon: React.FC<{ playing: boolean }> = ({ playing }) => (
  <span
    aria-label="Now playing"
    className={`inline-flex h-3.5 items-end gap-[2px] ${playing ? "" : "eq-paused"}`}
  >
    <span className="eq-bar" />
    <span className="eq-bar" />
    <span className="eq-bar" />
  </span>
)
