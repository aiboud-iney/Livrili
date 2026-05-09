"use client"

import { useState, useEffect, useRef } from "react"
import { WILAYAS, lookupWilayaByName } from "@/app/constants/wilayas"

interface WilayaInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
  label?: string
  required?: boolean
  disabled?: boolean
  theme?: {
    bgColor?: string
    hoverColor?: string
    selectedColor?: string
    errorColor?: string
  }
}

export default function WilayaInput({
  value,
  onChange,
  placeholder = "Type wilaya name or select from dropdown...",
  className = "",
  error,
  label,
  required = false,
  disabled = false,
  theme,
}: WilayaInputProps) {

  const colors = {
    bgColor: theme?.bgColor || "#EDFFD0",
    hoverColor: theme?.hoverColor || "#f0ffd0",
    selectedColor: theme?.selectedColor || "#EDFFD0",
    errorColor: theme?.errorColor || "#fca5a5",
  }
  const [inputValue, setInputValue] = useState(value)
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredWilayas, setFilteredWilayas] = useState<string[]>([])
  const [selectedWilaya, setSelectedWilaya] = useState<string>("")

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value)
      setSelectedWilaya(value)
    }
  }, [value, inputValue])

  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredWilayas([...WILAYAS])
      return
    }

    const searchTerm = inputValue.toLowerCase()
    const filtered = WILAYAS.filter((wilaya) => {
      const wilayaLower = wilaya.toLowerCase()
      return wilayaLower.includes(searchTerm)
    })

    setFilteredWilayas(filtered)
  }, [inputValue])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setSelectedWilaya("")
    setShowDropdown(true)
    onChange(newValue)
  }

  const handleWilayaSelect = (wilaya: string) => {
    setInputValue(wilaya)
    setSelectedWilaya(wilaya)
    setShowDropdown(false)
    onChange(wilaya)
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setShowDropdown(false)

      if (inputValue.trim()) {

        const matchedWilaya = lookupWilayaByName(inputValue.trim())
        if (matchedWilaya) {

          handleWilayaSelect(matchedWilaya)
        } else {

          setInputValue(inputValue.trim())
          setSelectedWilaya(inputValue.trim())
          onChange(inputValue.trim())
        }
      }
    }

    if (e.key === "Escape") {
      setShowDropdown(false)
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setShowDropdown(true)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-full focus:outline-none transition ${
            error
              ? "border-2 border-red-500 bg-white"
              : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{
            border: error ? `2px solid ${colors.errorColor}` : "none",
            outline: "none",
            backgroundColor: error ? "white" : colors.bgColor,
          }}
        />

        {}
        {!disabled && (
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            style={{ cursor: "pointer" }}
          >
            <img
              src="/icons/icon down green 1.png"
              alt="select"
              style={{
                width: "16px",
                height: "16px",
                objectFit: "contain",
                transition: "transform 0.2s ease",
                transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)"
              }}
            />
          </div>
        )}
      </div>

      {}
      {showDropdown && !disabled && filteredWilayas.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredWilayas.map((wilaya) => (
            <button
              key={wilaya}
              type="button"
              onClick={() => handleWilayaSelect(wilaya)}
              className={`w-full px-4 py-2 text-left transition-colors text-sm ${
                selectedWilaya === wilaya ? `font-semibold` : ""
              }`}
              style={{
                backgroundColor: selectedWilaya === wilaya ? colors.selectedColor : "transparent",
              }}
              onMouseEnter={(e) => {
                if (selectedWilaya !== wilaya) {
                  e.currentTarget.style.backgroundColor = colors.hoverColor
                }
              }}
              onMouseLeave={(e) => {
                if (selectedWilaya !== wilaya) {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              {wilaya}
            </button>
          ))}

          {filteredWilayas.length === 0 && inputValue.trim() && (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No wilayas found. Press Enter to use "{inputValue}" as typed
            </div>
          )}
        </div>
      )}

      {}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
