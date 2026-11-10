# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen.

## Ordner und Dateien

Eine «Task» ist in dieser App eine Aussage. Ordner und Dateinamen bleiben wie in AGENTS.md, damit Struktur und Speicherformat stabil bleiben.

- `src/features/tasks/model.ts`: Typ Task (Aussage) und reine Funktionen addTask, answerTask, nextTask, removeTask, restoreTask sowie die 20 Beispiel-Aussagen (createSeedTasks).
- `src/features/tasks/model.test.ts`: Tests für Anlegen, Kürzen, Bewerten, Wiederholungs-Reihenfolge, Löschen und Wiederherstellen.
- `src/lib/storage.ts`: loadState, saveState, hasSavedState für den Schlüssel `hwz-todo`.
- `src/lib/storage.test.ts`: Tests für kaputte Daten, fehlenden Schlüssel und Speichern/Lesen.
- `src/features/tasks/useTasks.ts`: Hook, der model.ts mit storage.ts verbindet, beim ersten Start die Beispiel-Aussagen setzt und die aktuelle Abfrage-Aussage liefert.
- `src/features/tasks/useTasks.test.ts`: Tests für ersten Start, Speichern nach jeder Änderung und Neuladen.
- `src/features/tasks/components/TaskList.tsx`: Liste aller Aussagen mit Listen-Animation.
- `src/features/tasks/components/TaskCard.tsx`: eine Aussage mit Wahr/Falsch-Badge, «sitzt»-Markierung und Löschen-Knopf.
- `src/features/tasks/components/TaskCard.test.tsx`: Tests für Anzeige, langen Text und Löschen mit «Rückgängig».
- `src/features/tasks/components/TaskInput.tsx`: Eingabe für neue Aussagen mit Wahl «Wahr»/«Falsch».
- `src/features/tasks/components/TaskInput.test.tsx`: Tests für Anlegen, leere Eingabe, 200 Zeichen und Taste N.
- `src/features/tasks/components/QuizCard.tsx`: Abfrage einer Aussage mit «Wahr»/«Falsch», Rückmeldung und «Weiter».
- `src/features/tasks/components/QuizCard.test.tsx`: Tests für richtige und falsche Antwort, Konfetti-Aufruf und Tastatur.
- `src/features/tasks/components/EmptyState.tsx`: Illustration, wenn keine Aussagen da sind.
- `src/components/ProgressRing.tsx`: Fortschrittsring «sitzt/gesamt».
- `src/components/ProgressRing.test.tsx`: Tests für Zahl und aria-label.
- `src/lib/useHotkey.ts`: Taste N fokussiert die Eingabe.
- `src/lib/celebrate.ts`: Konfetti-Aufruf, im Test ersetzbar.
- `src/lib/theme.ts`: readConfettiColors liest die Look-Farben aus CSS-Variablen.
- `src/App.tsx`: Rahmen mit Hero «Wahr oder Falsch?», Ring, Eingabe, Abfrage und Liste.

### F1: Tabs

- `src/components/ui/tabs.tsx`: shadcn-Baustein Tabs, neu per `npx shadcn add tabs --yes` (nutzt das schon installierte `radix-ui`, kein neues npm-Paket).
- `src/App.tsx`: Tabs «Quiz-Modus» (Abfrage oder leerer Zustand) und «Fragenübersicht» (Eingabe und Liste); Knopf «Alle Aussagen anzeigen» fällt weg; Taste N wechselt zur Übersicht.
- `src/App.test.tsx`: Tests für Start im Quiz, Wechsel, Pfeiltasten und Taste N.
- `src/features/tasks/components/TaskInput.tsx`: Taste N wandert in App.tsx, das Feld bekommt `autoFocus`, wenn es über N geöffnet wird.
- `src/features/tasks/components/TaskInput.test.tsx`, `src/features/tasks/components/TaskCard.test.tsx`: öffnen die Liste über den Tab statt über den Knopf.

## Datenmodell

```ts
// localStorage "hwz-todo" = { version: 1, tasks: Task[] }
export const CURRENT_VERSION = 1

export type Task = {
  id: string // crypto.randomUUID()
  title: string // die Aussage, getrimmt, 1 bis 200 Zeichen
  isTrue: boolean // richtige Lösung: Aussage ist wahr oder falsch
  done: boolean // «sitzt»: letzte Antwort war richtig
  lastAnsweredAt: number | null // Zeitpunkt der letzten Antwort, null = nie beantwortet
  createdAt: number // Date.now()
}
```

- `answerTask(tasks, id, answer)`: setzt `done = answer === isTrue` und `lastAnsweredAt = Date.now()`.
- `nextTask(tasks, lastId)`: Reihenfolge 1. zuletzt falsch beantwortet, 2. nie beantwortet, 3. zuletzt richtig beantwortet; innerhalb einer Gruppe die am längsten nicht gefragte zuerst. Die eben beantwortete Aussage kommt nicht direkt nochmals, ausser sie ist die einzige.
- Beispiel-Aussagen nur, wenn noch nichts gespeichert ist (`hasSavedState()` ist falsch). Wer alle löscht, bekommt sie nicht zurück.
- Erste Version dieser App, darum keine Migration. Ändert sich das Modell später: `CURRENT_VERSION` erhöhen und Migration mit Test (docs/STACK.md, «Datenhaltung»).

### F1: Tabs

Keine Änderung am Datenmodell, `version: 1` bleibt, keine Migration. Der gewählte Tab wird nicht gespeichert: Nach dem Neuladen ist immer «Quiz-Modus» offen.

## Komponenten

- **App-Rahmen:** Hero «Wahr oder Falsch?» mit Datum und Fortschrittsring rechts (DESIGN.md, Rezept 1).
- **ProgressRing:** zeigt «sitzt/gesamt», aria-label «3 von 5 sitzen», federt bei Änderung (DESIGN.md, Rezept 1).
- **TaskInput:** Eingabefeld mit zwei Wahlknöpfen «Wahr»/«Falsch» (`aria-pressed`) und Plus-Knopf, leere Eingabe schüttelt (DESIGN.md, Rezepte 2 und 9).
- **QuizCard:** grosse Karte mit der aktuellen Aussage, Knöpfe «Wahr» und «Falsch»; danach «Richtig» mit Konfetti oder «Falsch» mit Lösung, dann «Weiter» (Kartenform und Konfetti aus DESIGN.md, Rezepte 3 und 7).
- **TaskList / TaskCard:** alle Aussagen, neue oben, mit Badge «Wahr»/«Falsch», «sitzt»-Markierung und Löschen mit Toast «Rückgängig» (DESIGN.md, Rezepte 3, 4 und 7).
- **EmptyState:** Mond-Illustration mit «Keine Aussagen mehr. Zeit für Kaffee.» und «Tippe oben eine neue Aussage ein oder drücke N.» (DESIGN.md, Rezept 5).

### F1: Tabs

- **Tabs (shadcn):** `TabsList` als `grid grid-cols-2` mit zwei `TabsTrigger` (`h-11`), «Quiz-Modus» und «Fragenübersicht»; Pfeiltasten und Fokus liefert Radix (DESIGN.md, Rezepte 8 und 9). Die Abfrage bleibt beim Wechsel gemountet (`forceMount`, inaktiv `hidden`), damit Rückmeldung und Stand erhalten bleiben.

## Risiken

- Die Rezepte sind für eine Aufgabenliste geschrieben (Checkbox, «Aufgabe»): Klassen und Verhalten werden wörtlich übernommen, nur die Checkbox wird durch Wahr/Falsch-Knöpfe ersetzt und sichtbare Wörter heissen «Aussage».
- Die Wiederholungs-Reihenfolge stimmt bei mehreren Fehlern nicht: nextTask ist eine reine Funktion mit Tests für drei Fehler hintereinander.
- Der Typ Task hat mehr Felder als das Beispiel in docs/STACK.md: loadState prüft jedes Feld und gibt bei falscher Form eine leere Liste zurück, mit Test.

### F1: Tabs

- Der Inhalt des inaktiven Tabs wird von Radix entfernt und die Abfrage verliert ihre Rückmeldung: Quiz-Inhalt mit `forceMount` und `data-[state=inactive]:hidden`, Test «Fortschritt bleibt beim Wechsel».
- Taste N findet das Feld nicht, solange die Übersicht zu ist: App wechselt zuerst den Tab, das Feld fokussiert sich danach selbst, mit Test.
