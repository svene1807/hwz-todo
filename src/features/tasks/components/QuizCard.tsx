import { CircleCheck, CircleX } from 'lucide-react'
import { motion } from 'motion/react'
import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Task } from '@/features/tasks/model'
import { celebrate, originOf } from '@/lib/celebrate'

type QuizCardProps = {
  task: Task
  onAnswer: (id: string, value: boolean) => boolean
  onNext: () => void
  autoFocus?: boolean
}

export function QuizCard({ task, onAnswer, onNext, autoFocus = false }: QuizCardProps) {
  const [correct, setCorrect] = useState<boolean | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const firstAnswerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (correct !== null) nextRef.current?.focus()
  }, [correct])

  useEffect(() => {
    if (autoFocus) firstAnswerRef.current?.focus()
  }, [autoFocus])

  function handleAnswer(value: boolean, event: MouseEvent<HTMLButtonElement>) {
    const isCorrect = onAnswer(task.id, value)
    if (isCorrect) celebrate(originOf(event.currentTarget))
    setCorrect(isCorrect)
  }

  return (
    <motion.section
      aria-labelledby="quiz-title"
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="glass flex min-w-0 flex-col gap-6 rounded-2xl border p-6 shadow-card"
    >
      <h2 id="quiz-title" className="font-heading text-lg text-muted-foreground">
        Stimmt das?
      </h2>
      <p className="break-words [overflow-wrap:anywhere] font-heading text-2xl leading-snug sm:text-3xl">
        {task.title}
      </p>

      {correct === null ? (
        <div className="grid grid-cols-2 gap-3">
          <Button
            ref={firstAnswerRef}
            onClick={(event) => handleAnswer(true, event)}
            className="h-12 rounded-xl bg-primary text-lg text-primary-foreground transition-look hover:scale-105 active:scale-95"
          >
            Wahr
          </Button>
          <Button
            variant="secondary"
            onClick={(event) => handleAnswer(false, event)}
            className="h-12 rounded-xl text-lg transition-look hover:scale-105 active:scale-95"
          >
            Falsch
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.p
            role="status"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="flex items-center gap-2 text-lg"
          >
            {correct ? (
              <>
                <CircleCheck className="size-6 text-success" aria-hidden />
                <span className="font-semibold text-success">Richtig</span>
              </>
            ) : (
              <>
                <CircleX className="size-6 text-foreground" aria-hidden />
                <span>
                  <span className="font-semibold">Falsch.</span>{' '}
                  {task.isTrue ? 'Diese Aussage ist wahr.' : 'Diese Aussage ist falsch.'}
                </span>
              </>
            )}
          </motion.p>
          <Button
            ref={nextRef}
            onClick={onNext}
            className="h-12 rounded-xl bg-primary px-6 text-primary-foreground transition-look hover:scale-105 active:scale-95"
          >
            Weiter
          </Button>
        </div>
      )}
    </motion.section>
  )
}
