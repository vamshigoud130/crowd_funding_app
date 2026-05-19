import React, { useEffect, useRef } from 'react'

function SearchBar({ onSearch }) {
    const inputRef = useRef(null)
    const timeoutRef = useRef(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const handleChange = e => {
        const value = e.target.value
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            onSearch(value.trim())
        }, 500)
    }

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder="Search By Category"
            className="w-full px-4 py-2 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-400"
            onChange={handleChange}
        />
    )
}

export default SearchBar