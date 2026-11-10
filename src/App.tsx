import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ProgressRing } from '@/components/ProgressRing'
import { EmptyState } from '@/features/tasks/components/EmptyState'
import { QuizCard } from '@/features/tasks/components/QuizCard'
import { TaskInput } from '@/features/tasks/components/TaskInput'
import { TaskList } from '@/features/tasks/components/TaskList'
import { useTasks } from '@/features/tasks/useTasks'

export default function App() {
  const { tasks, current, add, answer, next, remove, restore } = useTasks()
  const [round, setRound] = useState(0)
  const doneCount = tasks.filter((t) => t.done).length
  const today = new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  function handleNext() {
    next()
    setRound((r) => r + 1)
  }

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
          <header className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-gradient font-heading text-4xl font-bold tracking-tight sm:text-6xl">
                Wahr oder Falsch?
              </h1>
              <p className="mt-2 text-muted-foreground">{today}</p>
            </div>
            <ProgressRing
              value={doneCount}
              total={tasks.length}
              label={`${doneCount} von ${tasks.length} sitzen`}
            />
          </header>
          <TaskInput onAdd={add} />
          {current && (
            <QuizCard
              key={`${current.id}-${round}`}
              task={current}
              onAnswer={answer}
              onNext={handleNext}
              autoFocus={round > 0}
            />
          )}
          {tasks.length === 0 && <EmptyState />}
          <section className="flex flex-col gap-4">
            {tasks.length > 0 && <h2 className="font-heading text-lg">Alle Aussagen</h2>}
            <TaskList tasks={tasks} onRemove={remove} onRestore={restore} />
          </section>
        </main>
        <Toaster position="bottom-center" richColors closeButton />
      </TooltipProvider>
    </MotionConfig>
  )
}
