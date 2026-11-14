import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { searchMusic } from "../service/music"
import { usePlayer } from "../hooks/usePlayer"
import { useDebounce } from "../hooks/useDebounce"
import { TrackRow } from "../components/music/TrackRow"
import { Button } from "../components/common/Button"
import { EmptyState } from "../components/common/EmptyState"
import { SearchIcon, CloseIcon } from "../components/common/Icons"
import { getErrorMessage } from "../util/error"
import type { Track } from "../types/music"

const BROWSE = [
  { name: "Pop", query: "pop hits", color: "from-pink-500 to-rose-600" },
  { name: "Hip-Hop", query: "hip hop hits", color: "from-orange-500 to-amber-600" },
  { name: "Rock", query: "rock classics", color: "from-red-600 to-red-900" },
  { name: "Electronic", query: "electronic dance music", color: "from-cyan-500 to-blue-700" },
  { name: "Chill", query: "chill vibes", color: "from-teal-500 to-emerald-700" },
  { name: "Lo-fi", query: "lofi beats", color: "from-violet-500 to-purple-800" },
  { name: "Workout", query: "workout music", color: "from-lime-500 to-green-700" },
  { name: "Acoustic", query: "acoustic songs", color: "from-yellow-500 to-orange-700" },
  { name: "Throwback", query: "2000s throwback hits", color: "from-fuchsia-500 to-indigo-700" },
  { name: "Focus", query: "focus instrumental", color: "from-sky-500 to-indigo-600" }
]

interface SearchResult {
  query: string
  tracks: Track[]
  nextToken: string | null
  error: string
}

export const Search: React.FC = () => {
  const { playQueue } = usePlayer()
  const [params, setParams] = useSearchParams()
  const urlQuery = params.get("q") ?? ""

  const [input, setInput] = useState(urlQuery)
  const debounced = useDebounce(input.trim(), 600) // wait until the user stops typing (saves API quota)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  // typing -> URL (so Back/refresh keep the search)
  useEffect(() => {
    if (debounced !== urlQuery) setParams(debounced ? { q: debounced } : {}, { replace: true })
  }, [debounced, urlQuery, setParams])

  // URL -> request
  useEffect(() => {
    if (!urlQuery) return
    let cancelled = false

    searchMusic(urlQuery)
      .then((res) => {
        if (!cancelled) setResult({ query: urlQuery, tracks: res.data, nextToken: res.meta.nextPageToken, error: "" })
      })
      .catch((err) => {
        if (!cancelled)
          setResult({ query: urlQuery, tracks: [], nextToken: null, error: getErrorMessage(err, "Search failed") })
      })

    return () => {
      cancelled = true
    }
  }, [urlQuery])

  const loading = !!urlQuery && result?.query !== urlQuery
  const current = result?.query === urlQuery ? result : null

  const loadMore = async () => {
    if (!current?.nextToken) return
    setLoadingMore(true)
    try {
      const res = await searchMusic(current.query, current.nextToken)
      setResult((prev) =>
        prev && prev.query === current.query
          ? { ...prev, tracks: [...prev.tracks, ...res.data], nextToken: res.meta.nextPageToken }
          : prev
      )
    } catch (err) {
      setResult((prev) => (prev ? { ...prev, error: getErrorMessage(err, "Could not load more") } : prev))
    } finally {
      setLoadingMore(false)
    }
  }

  const runSearch = (q: string) => {
    setInput(q)
    setParams(q ? { q } : {}, { replace: true })
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          runSearch(input.trim())
        }}
        className="relative max-w-xl pt-2"
      >
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-xl text-neutral-400" />
        <input
          type="search"
          aria-label="Search songs, artists"
          placeholder="What do you want to listen to?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-full bg-neutral-800 py-3 pl-12 pr-10 text-sm text-white placeholder-neutral-400 outline-none ring-white/80 transition hover:bg-neutral-700 focus:ring-2 [&::-webkit-search-cancel-button]:hidden"
        />
        {input && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => runSearch("")}
            className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <CloseIcon />
          </button>
        )}
      </form>

      {!urlQuery ? (
        <section>
          <h2 className="mb-3 text-xl font-bold">Browse all</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {BROWSE.map((c) => (
              <button
                key={c.name}
                onClick={() => runSearch(c.query)}
                className={`aspect-[16/9] rounded-lg bg-linear-to-br p-4 text-left text-lg font-extrabold shadow-lg transition hover:scale-[1.02] ${c.color}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>
      ) : loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-14 rounded-md bg-neutral-800" />
          ))}
        </div>
      ) : current?.error ? (
        <p className="rounded-lg bg-rose-500/10 p-4 text-sm text-rose-300">{current.error}</p>
      ) : current && current.tracks.length === 0 ? (
        <EmptyState
          title={`No results found for “${current.query}”`}
          description="Check the spelling or try a different song or artist."
        />
      ) : (
        current && (
          <section>
            <h2 className="mb-2 text-xl font-bold">Songs</h2>
            <div>
              {current.tracks.map((track, i) => (
                <TrackRow
                  key={track.videoId}
                  track={track}
                  position={i + 1}
                  onPlay={() => playQueue(current.tracks, i)}
                />
              ))}
            </div>
            {current.nextToken && (
              <div className="flex justify-center pt-4">
                <Button variant="secondary" onClick={loadMore} isLoading={loadingMore}>
                  Show more
                </Button>
              </div>
            )}
          </section>
        )
      )}
    </div>
  )
}
