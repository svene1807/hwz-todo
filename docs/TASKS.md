# TASKS: Bauschritte

Diese Datei füllt /plan. /task arbeitet sie von oben nach unten ab und hakt jeden Task ab.
Ein Beispiel mit allen 6 Tasks von Bau 1 steht in docs/PROMPTS.md unter «Beispiel: die 6 Tasks von Bau 1».

Format je Task:

```text
[ ] N  Titel
- Ziel: Ein Satz, was danach sichtbar oder möglich ist.
- Dateien: Genau die Dateien, die geändert werden dürfen.
- Test zuerst: Welcher Test zuerst rot sein muss.
- Fertig wenn: Prüfbares Ergebnis plus «npm run check grün».
```

## Tasks

[x] 1  Projekt einrichten
- Ziel: Leerer App-Rahmen im Look Aurora läuft unter http://localhost:5173/hwz-todo/.
- Dateien: alle aus docs/STACK.md, Abschnitt «Dateien für Task 1», plus src/components/ui/*.
- Test zuerst: src/App.test.tsx (kommt mit Task 1, siehe STACK.md).
- Fertig wenn: npm run check grün, Hero-Überschrift sichtbar.

[x] 2  Datenmodell und Store mit Tests
- Ziel: Aussagen lassen sich anlegen, beantworten, in Wiederholungs-Reihenfolge ziehen, löschen und im localStorage speichern, noch ohne Oberfläche.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: addTask ignoriert leeren Titel und kürzt auf 200 Zeichen; nextTask bringt nach drei falschen Antworten alle drei vor die richtig beantworteten; loadState gibt bei kaputtem JSON eine leere Liste zurück; erster Start liefert genau 20 Beispiel-Aussagen.
- Fertig wenn: «Neu laden», «Häufiger wiederholen» und «Beispiel-Aussagen» in Tests belegt, npm run check grün.

[x] 3  Liste anzeigen und löschen
- Ziel: Alle Aussagen erscheinen als TaskCards mit Badge «Wahr»/«Falsch» und lassen sich mit Toast «Rückgängig» löschen.
- Dateien: src/features/tasks/components/TaskList.tsx, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/App.tsx.
- Test zuerst: TaskList zeigt zwei Aussagen aus dem localStorage; Löschen und «Rückgängig» stellt die Aussage an der alten Stelle wieder her.
- Fertig wenn: «Löschen mit Rückgängig» erfüllt, langer Text bricht um (DESIGN.md, Rezepte 3, 4, 7), npm run check grün.

[x] 4  Aussage hinzufügen
- Ziel: Neue Aussage mit Wahl «Wahr»/«Falsch» per Enter oder Plus-Knopf, leere Eingabe schüttelt, «N» fokussiert das Feld.
- Dateien: src/features/tasks/components/TaskInput.tsx, src/features/tasks/components/TaskInput.test.tsx, src/lib/useHotkey.ts, src/App.tsx.
- Test zuerst: Tippen + «Wahr» + Enter zeigt die Aussage oben; Enter bei leerem Feld fügt nichts hinzu; das Feld nimmt höchstens 200 Zeichen; «N» fokussiert das Feld.
- Fertig wenn: «Leere Eingabe», «200 Zeichen» und «Eigene Aussage» erfüllt (DESIGN.md, Rezepte 2 und 9), npm run check grün.

[x] 5  Abfrage mit Rückmeldung
- Ziel: Die QuizCard fragt eine Aussage nach der anderen ab, zeigt «Richtig» mit Konfetti oder «Falsch» mit Lösung und geht mit «Weiter» zur nächsten.
- Dateien: src/features/tasks/components/QuizCard.tsx, src/features/tasks/components/QuizCard.test.tsx, src/lib/celebrate.ts, src/lib/theme.ts, src/App.tsx.
- Test zuerst: Richtige Antwort zeigt «Richtig» und ruft celebrate auf; falsche Antwort zeigt «Diese Aussage ist wahr»; «Wahr», «Falsch» und «Weiter» sind per Tastatur auslösbar.
- Fertig wenn: «Richtig beantworten», «Falsch beantworten» und «Tastatur» erfüllt, Antworten bleiben nach dem Neuladen, npm run check grün.

[x] 6  Fortschrittsring und leerer Zustand
- Ziel: Der Ring zeigt «sitzt/gesamt», ohne Aussagen erscheint die Aurora-Illustration, bei 360 px läuft nichts hinaus.
- Dateien: src/components/ProgressRing.tsx, src/components/ProgressRing.test.tsx, src/features/tasks/components/EmptyState.tsx, src/App.tsx.
- Test zuerst: Ring hat aria-label «1 von 2 sitzen»; leere Liste zeigt «Keine Aussagen mehr. Zeit für Kaffee.».
- Fertig wenn: Zähler-Teil von «Richtig beantworten» und «Schmales Fenster» erfüllt (DESIGN.md, Rezepte 1, 5 und 8), npm run check grün.
