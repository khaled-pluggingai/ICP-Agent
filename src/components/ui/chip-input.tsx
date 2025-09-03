import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HudButton } from "@/components/ui/hud-button"

interface ChipInputProps {
  label: string
  placeholder: string
  values: string[]
  onChange: (values: string[]) => void
  className?: string
  maxChips?: number
  allowDuplicates?: boolean
  separators?: string[]
}

export function ChipInput({
  label,
  placeholder,
  values = [],
  onChange,
  className,
  maxChips,
  allowDuplicates = false,
  separators = [",", ";", "\n"]
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addChip = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (maxChips && values.length >= maxChips) return
    
    // Check for duplicates (case-insensitive)
    if (!allowDuplicates && values.some(v => v.toLowerCase() === trimmed.toLowerCase())) return
    
    onChange([...values, trimmed])
    setInputValue("")
  }

  const removeChip = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Check for separator characters
    const hasSeparator = separators.some(sep => value.includes(sep))
    if (hasSeparator && !isComposing) {
      // Split by separators and add multiple chips
      const parts = value.split(new RegExp(`[${separators.map(s => s === "," ? "," : s === ";" ? ";" : "\\n").join("")}]`))
      parts.forEach(part => {
        const trimmed = part.trim()
        if (trimmed) addChip(trimmed)
      })
      setInputValue("")
    } else {
      setInputValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isComposing) return

    if (e.key === "Enter") {
      e.preventDefault()
      addChip(inputValue)
    } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
      e.preventDefault()
      removeChip(values.length - 1)
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault()
      addChip(inputValue)
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addChip(inputValue)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const paste = e.clipboardData.getData("text")
    
    // Split by common separators
    const parts = paste.split(/[,;\n\t]/).map(p => p.trim()).filter(Boolean)
    
    if (parts.length > 1) {
      parts.forEach(part => addChip(part))
    } else {
      setInputValue(paste)
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Chips Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((value, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-emerald-500/12 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
          >
            {value}
            <button
              onClick={() => removeChip(index)}
              className="ml-2 hover:text-red-400 transition-colors"
              aria-label={`Remove ${value}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className="flex-1"
          disabled={maxChips ? values.length >= maxChips : false}
        />
        <HudButton
          style="style2"
          variant="secondary"
          size="small"
          onClick={() => addChip(inputValue)}
          disabled={!inputValue.trim() || (maxChips ? values.length >= maxChips : false)}
        >
          ADD
        </HudButton>
      </div>
      
      {maxChips && (
        <div className="text-xs text-muted-foreground">
          {values.length}/{maxChips} chips
        </div>
      )}
    </div>
  )
}