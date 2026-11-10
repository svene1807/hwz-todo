export const MAX_TITLE_LENGTH = 200

export type Task = {
  id: string // crypto.randomUUID()
  title: string // the statement, trimmed, 1 to 200 characters
  isTrue: boolean // correct solution
  done: boolean // "sitzt": last answer was correct
  lastAnsweredAt: number | null // null = never answered
  createdAt: number // Date.now()
}

const SEED_STATEMENTS: ReadonlyArray<[string, boolean]> = [
  ['Bei der Inference ändern sich die Gewichte des Modells.', false],
  ['RAG verändert die Gewichte des Modells nicht, sondern nur den Kontext.', true],
  ['Ein Token entspricht immer genau einem Wort.', false],
  ['Fine-Tuning spielt kein laufend aktuelles Wissen in ein Modell ein.', true],
  ['Backpropagation berechnet die Gradienten und ist selbst kein Lernverfahren.', true],
  ['Ein grosses Kontextfenster garantiert, dass Information zuverlässig gefunden wird.', false],
  ['Context Rot: Die Leistung eines Modells kann mit wachsender Eingabelänge nachlassen.', true],
  [
    'Bei einem Workflow legt der Code den Ablauf fest, bei einem Agenten steuert ihn das Modell selbst.',
    true,
  ],
  ['Ein Skill (SKILL.md) trainiert das Modell neu.', false],
  ['MCP ist ein offener Standard, der LLMs mit externen Tools und Datenquellen verbindet.', true],
  ['Das Agent Handoff Protocol (AHP) verbindet Agenten mit externen Tools.', false],
  ['Die Agentenlogik läuft typischerweise auf GPUs statt auf CPUs.', false],
  ['Sovereign Cloud ist ein NIST-Bereitstellungsmodell.', false],
  ['Eine Eingabeprüfung beseitigt das Risiko von Prompt Injection vollständig.', false],
  [
    'Das Gate prüft Daten und Kontext vor dem Modellaufruf, die Validierung den Vorschlag danach.',
    true,
  ],
  ['Prefill ist compute-bound, Decode ist memory-bound.', true],
  ['Open-weight bedeutet automatisch Open-source.', false],
  ['Über 95 % des interkontinentalen Datenverkehrs laufen über Seekabel.', true],
  [
    'Episodic Memory hält fest, was bei früheren Interaktionen funktioniert hat und was der Nutzer korrigiert hat.',
    true,
  ],
  ['Das LLM sieht alle vier Memory-Typen gleichzeitig und automatisch.', false],
]

function createTask(title: string, isTrue: boolean, now: number): Task {
  return {
    id: crypto.randomUUID(),
    title,
    isTrue,
    done: false,
    lastAnsweredAt: null,
    createdAt: now,
  }
}

export function createSeedTasks(now = Date.now()): Task[] {
  return SEED_STATEMENTS.map(([title, isTrue]) => createTask(title, isTrue, now))
}

export function addTask(tasks: Task[], title: string, isTrue: boolean, now = Date.now()): Task[] {
  const clean = title.trim().slice(0, MAX_TITLE_LENGTH)
  if (!clean) return tasks
  return [createTask(clean, isTrue, now), ...tasks]
}

export function answerTask(tasks: Task[], id: string, answer: boolean, now = Date.now()): Task[] {
  return tasks.map((t) =>
    t.id === id ? { ...t, done: answer === t.isTrue, lastAnsweredAt: now } : t,
  )
}

// 0 = last answer wrong, 1 = never answered, 2 = last answer correct
function rank(task: Task): number {
  if (task.lastAnsweredAt === null) return 1
  return task.done ? 2 : 0
}

export function nextTask(tasks: Task[], lastId: string | null): Task | undefined {
  const candidates = tasks.length > 1 ? tasks.filter((t) => t.id !== lastId) : tasks
  return [...candidates].sort(
    (a, b) =>
      rank(a) - rank(b) || (a.lastAnsweredAt ?? a.createdAt) - (b.lastAnsweredAt ?? b.createdAt),
  )[0]
}

export function removeTask(
  tasks: Task[],
  id: string,
): { tasks: Task[]; removed: { task: Task; index: number } | null } {
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return { tasks, removed: null }
  return { tasks: tasks.filter((t) => t.id !== id), removed: { task: tasks[index], index } }
}

export function restoreTask(tasks: Task[], task: Task, index: number): Task[] {
  if (tasks.some((t) => t.id === task.id)) return tasks
  const result = [...tasks]
  result.splice(Math.min(index, result.length), 0, task)
  return result
}
