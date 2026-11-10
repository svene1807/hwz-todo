import { Check, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Task } from '@/features/tasks/model'

type TaskCardProps = {
  task: Task
  onRemove: (id: string) => { task: Task; index: number } | null
  onRestore: (task: Task, index: number) => void
}

export function TaskCard({ task, onRemove, onRestore }: TaskCardProps) {
  function handleDelete() {
    const removed = onRemove(task.id)
    if (!removed) return
    toast('Aussage gelöscht', {
      action: { label: 'Rückgängig', onClick: () => onRestore(removed.task, removed.index) },
      duration: 5000,
    })
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="group glass flex min-w-0 items-start gap-3 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow"
    >
      <Badge variant={task.isTrue ? 'default' : 'secondary'} className="mt-1 font-mono">
        {task.isTrue ? 'Wahr' : 'Falsch'}
      </Badge>
      <span className="relative min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed">
        {task.title}
      </span>
      {task.done && (
        <span className="mt-1 flex items-center gap-1 text-sm text-success">
          <Check className="size-4" aria-hidden />
          sitzt
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label={`«${task.title}» löschen`}
        className="size-11 opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
        onClick={handleDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.li>
  )
}
