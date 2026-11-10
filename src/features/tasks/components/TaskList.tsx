import { AnimatePresence } from 'motion/react'
import type { Task } from '@/features/tasks/model'
import { TaskCard } from '@/features/tasks/components/TaskCard'

type TaskListProps = {
  tasks: Task[]
  onRemove: (id: string) => { task: Task; index: number } | null
  onRestore: (task: Task, index: number) => void
}

export function TaskList({ tasks, onRemove, onRestore }: TaskListProps) {
  return (
    <ul aria-label="Alle Aussagen" className="flex flex-col gap-3">
      <AnimatePresence initial={false} mode="popLayout">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onRemove={onRemove} onRestore={onRestore} />
        ))}
      </AnimatePresence>
    </ul>
  )
}
