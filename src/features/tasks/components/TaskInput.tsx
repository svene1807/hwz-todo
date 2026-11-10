import { Plus } from 'lucide-react'
import { type FormEvent, type KeyboardEvent, useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MAX_TITLE_LENGTH } from '@/features/tasks/model'
import { useHotkey } from '@/lib/useHotkey'
import { cn } from '@/lib/utils'

type TaskInputProps = {
  onAdd: (title: string, isTrue: boolean) => void
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState('')
  const [isTrue, setIsTrue] = useState(true)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = useCallback(() => inputRef.current?.focus(), [])
  useHotkey('n', focusInput)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) {
      setShaking(true)
      focusInput()
      return
    }
    onAdd(title, isTrue)
    setTitle('')
    focusInput()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Escape') return
    setTitle('')
    inputRef.current?.blur()
  }

  return (
    <form
      onSubmit={handleSubmit}
      onAnimationEnd={() => setShaking(false)}
      className={cn(
        'glass flex items-center gap-2 rounded-2xl border p-2 shadow-card',
        shaking && 'animate-shake',
      )}
    >
      <Input
        ref={inputRef}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Was stimmt oder stimmt nicht?"
        aria-label="Neue Aussage"
        maxLength={MAX_TITLE_LENGTH}
        className="h-14 min-w-0 flex-1 border-0 bg-transparent px-4 text-lg shadow-none focus-visible:ring-0"
      />
      <div role="group" aria-label="Lösung der neuen Aussage" className="flex gap-1">
        {[true, false].map((value) => (
          <Button
            key={String(value)}
            type="button"
            variant={isTrue === value ? 'default' : 'ghost'}
            aria-pressed={isTrue === value}
            onClick={() => setIsTrue(value)}
            className="h-11 rounded-xl px-3 transition-look"
          >
            {value ? 'Wahr' : 'Falsch'}
          </Button>
        ))}
      </div>
      <Button
        type="submit"
        size="icon"
        className="size-12 shrink-0 rounded-xl bg-primary text-primary-foreground transition-look hover:scale-105 active:scale-95"
        aria-label="Aussage hinzufügen"
      >
        <Plus className="size-6" />
      </Button>
    </form>
  )
}
