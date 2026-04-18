import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CDMX_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=-99.36%2C19.22%2C-98.93%2C19.60&layer=mapnik'

function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [suggestionsError, setSuggestionsError] = useState('')
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)

  const requestIdRef = useRef(0)

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (trimmedQuery.length < 3) {
      return
    }

    const timeoutId = setTimeout(async () => {
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId

      try {
        setIsLoadingSuggestions(true)
        setSuggestionsError('')

        const endpoint = new URL('https://nominatim.openstreetmap.org/search')
        endpoint.searchParams.set('q', `${trimmedQuery}, Ciudad de Mexico, Mexico`)
        endpoint.searchParams.set('format', 'jsonv2')
        endpoint.searchParams.set('addressdetails', '1')
        endpoint.searchParams.set('limit', '6')
        endpoint.searchParams.set('countrycodes', 'mx')

        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('No fue posible cargar sugerencias.')
        }

        const data = await response.json()

        if (requestIdRef.current !== requestId) {
          return
        }

        const nextSuggestions = (Array.isArray(data) ? data : []).map((item) => {
          const fullLabel = item.display_name ?? ''
          const chunks = fullLabel
            .split(',')
            .map((part) => part.trim())
            .filter(Boolean)

          return {
            id: item.place_id,
            label: fullLabel,
            primary: chunks[0] ?? fullLabel,
            secondary: chunks.slice(1).join(', '),
          }
        })

        setSuggestions(nextSuggestions)
        setActiveSuggestionIndex(-1)
      } catch (error) {
        if (requestIdRef.current !== requestId) {
          return
        }

        setSuggestions([])
        setSuggestionsError(error.message)
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoadingSuggestions(false)
        }
      }
    }, 260)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [query])

  const goToMapas = (value) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return
    }

    navigate(`/mapas?q=${encodeURIComponent(trimmedValue)}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const highlighted = suggestions[activeSuggestionIndex]
    const valueToSearch = highlighted?.label ?? query

    setIsSuggestionsOpen(false)
    goToMapas(valueToSearch)
  }

  const handleKeyDown = (event) => {
    if (!isSuggestionsOpen) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      if (suggestions.length === 0) {
        return
      }

      setActiveSuggestionIndex((previous) => (previous + 1) % suggestions.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

      if (suggestions.length === 0) {
        return
      }

      setActiveSuggestionIndex((previous) => {
        if (previous <= 0) {
          return suggestions.length - 1
        }

        return previous - 1
      })
      return
    }

    if (event.key === 'Escape') {
      setIsSuggestionsOpen(false)
      setActiveSuggestionIndex(-1)
    }
  }

  const handleSuggestionSelect = (value) => {
    setQuery(value)
    setIsSuggestionsOpen(false)
    setActiveSuggestionIndex(-1)
    goToMapas(value)
  }

  return (
    <main className="home-page">
      <div className="home-map-bg" aria-hidden="true">
        <iframe
          title="Mapa de fondo de la Ciudad de Mexico"
          src={CDMX_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <section className="hero-stage">
        <p className="hero-overline">Plataforma ciudadana de analisis territorial</p>
        <h1>GeoJusticia - CDMX</h1>

        <div
          className="hero-search-wrap"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsSuggestionsOpen(false)
              setActiveSuggestionIndex(-1)
            }
          }}
        >
          <form className="hero-search" onSubmit={handleSubmit}>
            <span className="search-icon" aria-hidden="true">
              o
            </span>
            <input
              type="text"
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value
                setQuery(nextQuery)
                setIsSuggestionsOpen(true)

                if (nextQuery.trim().length < 3) {
                  setSuggestions([])
                  setSuggestionsError('')
                  setIsLoadingSuggestions(false)
                  setActiveSuggestionIndex(-1)
                }
              }}
              onFocus={() => setIsSuggestionsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar direccion, colonia o codigo postal en CDMX..."
              aria-label="Buscar direccion en CDMX"
              aria-expanded={isSuggestionsOpen}
              aria-autocomplete="list"
              aria-controls="home-address-suggestions"
            />
            <button type="submit">Buscar</button>
          </form>

          {isSuggestionsOpen && (isLoadingSuggestions || suggestions.length > 0 || suggestionsError) ? (
            <div className="hero-suggestions" id="home-address-suggestions" role="listbox">
              {isLoadingSuggestions ? <p className="suggestion-status">Buscando sugerencias...</p> : null}

              {!isLoadingSuggestions && suggestionsError ? (
                <p className="suggestion-status">{suggestionsError}</p>
              ) : null}

              {!isLoadingSuggestions && !suggestionsError && suggestions.length === 0 ? (
                <p className="suggestion-status">No encontramos coincidencias.</p>
              ) : null}

              {!isLoadingSuggestions && !suggestionsError
                ? suggestions.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      className={
                        index === activeSuggestionIndex
                          ? 'suggestion-item suggestion-item-active'
                          : 'suggestion-item'
                      }
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSuggestionSelect(item.label)}
                      role="option"
                      aria-selected={index === activeSuggestionIndex}
                    >
                      <span className="suggestion-main">{item.primary}</span>
                      {item.secondary ? (
                        <span className="suggestion-secondary">{item.secondary}</span>
                      ) : null}
                    </button>
                  ))
                : null}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export default HomePage
