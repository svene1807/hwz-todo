# SPEC: Was die App können muss

Diese Datei füllt /spec. Ein ausgefülltes Beispiel steht in docs/PROMPTS.md unter «Beispiel einer SPEC».

## Ziel

Ich will Aussagen mit «Wahr» oder «Falsch» beantworten, sofort sehen, ob ich richtig lag, und die Aussagen, die ich falsch hatte, öfter üben.

## Muss

- Beim ersten Start sind 20 Beispiel-Aussagen zu KI und Agenten da.
- Eigene Aussage anlegen: Text eintippen und festlegen, ob sie wahr oder falsch ist (Enter oder Plus-Knopf).
- Abfrage: Eine Aussage nach der anderen, mit den Knöpfen «Wahr» und «Falsch».
- Sofortige Rückmeldung: «Richtig» oder «Falsch», bei Falsch mit der richtigen Lösung.
- Falsch beantwortete Aussagen kommen früher und häufiger wieder als richtig beantwortete.
- Die Liste aller Aussagen ist eingeklappt, damit man die Lösungen nicht vorher sieht. Dort Aussage löschen, mit «Rückgängig». Zähler «sitzt/gesamt» als Fortschrittsring. Eine Aussage sitzt, wenn die letzte Antwort darauf richtig war.

## Look

Aurora

## Nicht

- Kein Login, kein Server. Die Daten bleiben im Browser.
- Kein Bearbeiten bestehender Aussagen (löschen und neu anlegen genügt).
- Keine Zeitbegrenzung und keine Bestenliste.

## Fertig, wenn

1. Leere Eingabe
   - Gegeben: Das Eingabefeld für eine neue Aussage ist leer oder enthält nur Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Es kommt keine Aussage dazu und das Feld schüttelt sich kurz.
2. 200 Zeichen
   - Gegeben: Ich tippe eine Aussage mit mehr als 200 Zeichen ohne Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Das Feld akzeptiert höchstens 200 Zeichen. Der Text bricht in der Karte um, nichts läuft hinaus.
3. Neu laden
   - Gegeben: Ich habe eigene Aussagen angelegt und einige beantwortet.
   - Wenn: Ich die Seite neu lade.
   - Dann: Alle Aussagen, ihr Wahr/Falsch-Wert und mein Fortschritt (Ring und Wiederholungs-Reihenfolge) sind noch da.
4. Richtig beantworten
   - Gegeben: Eine Aussage wird abgefragt, die noch nicht sitzt.
   - Wenn: Ich die richtige Antwort wähle.
   - Dann: «Richtig» erscheint, Konfetti in Look-Farben fliegt und der Zähler im Ring steigt um 1. Beantworte ich dieselbe Aussage später falsch, sinkt der Zähler wieder um 1.
5. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich anlege, abfrage und lösche.
   - Dann: Alles ist lesbar und bedienbar, ohne seitliches Scrollen, alle Knöpfe sind mindestens 44 × 44 px gross.
6. Beispiel-Aussagen
   - Gegeben: Ich öffne die App zum ersten Mal (leerer Speicher).
   - Wenn: Die Seite geladen ist.
   - Dann: Genau 20 Beispiel-Aussagen sind da und die erste wird abgefragt.
7. Eigene Aussage
   - Gegeben: Ich tippe «Wasser kocht auf Meereshöhe bei 100 °C» und wähle «Wahr».
   - Wenn: Ich Enter drücke.
   - Dann: Die Aussage steht oben in der Liste, der Ring zeigt eine Aussage mehr im Gesamtwert, das Feld ist leer und der Fokus bleibt darin.
8. Falsch beantworten
   - Gegeben: Eine Aussage wird abgefragt.
   - Wenn: Ich die falsche Antwort wähle.
   - Dann: «Falsch» erscheint zusammen mit der richtigen Lösung («Diese Aussage ist wahr» oder «Diese Aussage ist falsch»), und mit «Weiter» geht es zur nächsten Aussage.
9. Häufiger wiederholen
   - Gegeben: Es gibt mindestens 5 Aussagen und ich beantworte eine davon falsch.
   - Wenn: Ich weiter abfrage.
   - Dann: Falsch beantwortete Aussagen kommen vor allen Aussagen wieder dran, die zuletzt richtig beantwortet wurden.
10. Löschen mit Rückgängig
    - Gegeben: Es gibt mehrere Aussagen in der Liste.
    - Wenn: Ich eine lösche und im Toast «Rückgängig» klicke.
    - Dann: Die Aussage ist wieder an der alten Stelle, mit ihrem Wahr/Falsch-Wert und Fortschritt.
11. Tastatur
    - Gegeben: Eine Aussage wird abgefragt.
    - Wenn: Ich nur mit Tab, Enter und Leertaste arbeite.
    - Dann: Ich kann «Wahr», «Falsch» und «Weiter» erreichen und auslösen, der Fokus ist immer sichtbar.
12. Lösungen verborgen
    - Gegeben: Es gibt Aussagen und ich öffne die App.
    - Wenn: Die Seite geladen ist.
    - Dann: Keine Aussage und keine Lösung aus der Liste ist sichtbar, nur der Knopf «Alle Aussagen anzeigen»; ein Klick darauf öffnet die Liste, ein zweiter schliesst sie.

## Features

### F1: Tabs «Quiz-Modus» und «Fragenübersicht»

Üben und Verwalten sind getrennt: Im Quiz sieht man nur die aktuelle Aussage, in der Übersicht alle Aussagen mit Lösung, Eingabe und Löschen. Die Tabs ersetzen den Knopf «Alle Aussagen anzeigen» aus Kriterium 12; die Lösungen bleiben verborgen, solange der Tab «Quiz-Modus» offen ist.

1. Start im Quiz
   - Gegeben: Es gibt Aussagen.
   - Wenn: Ich die App öffne oder neu lade.
   - Dann: Der Tab «Quiz-Modus» ist ausgewählt, die Abfrage «Stimmt das?» ist sichtbar; Eingabefeld, Liste und Lösungen aus der Liste sind nicht sichtbar.
2. Zur Übersicht wechseln
   - Gegeben: Der Tab «Quiz-Modus» ist offen.
   - Wenn: Ich auf «Fragenübersicht» klicke.
   - Dann: Das Eingabefeld und die Liste aller Aussagen mit ihren Badges «Wahr»/«Falsch» und Löschen-Knöpfen sind sofort sichtbar, ohne weiteren Klick; die Abfrage ist nicht sichtbar.
3. Anlegen in der Übersicht
   - Gegeben: Der Tab «Fragenübersicht» ist offen.
   - Wenn: Ich eine Aussage anlege und zu «Quiz-Modus» wechsle.
   - Dann: Die Aussage steht oben in der Liste, und der Ring zeigt eine Aussage mehr im Gesamtwert.
4. Fortschritt bleibt beim Wechsel
   - Gegeben: Ich habe im Quiz eine Aussage beantwortet und die Rückmeldung «Richtig» oder «Falsch» ist sichtbar.
   - Wenn: Ich zur «Fragenübersicht» und zurück wechsle.
   - Dann: Die Antwort ist gespeichert, der Ring zeigt denselben Stand und die Abfrage geht ohne Fehler weiter.
5. Taste N
   - Gegeben: Der Tab «Quiz-Modus» ist offen und der Fokus ist in keinem Eingabefeld.
   - Wenn: Ich N drücke.
   - Dann: Der Tab «Fragenübersicht» öffnet sich und der Fokus steht im Eingabefeld.
6. Tastatur
   - Gegeben: Der Fokus steht auf einem Tab.
   - Wenn: Ich die Pfeiltasten links/rechts drücke.
   - Dann: Der andere Tab wird ausgewählt, sein Inhalt erscheint und der Fokus ist sichtbar.
7. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich zwischen den Tabs wechsle.
   - Dann: Beide Tabs stehen nebeneinander, sind mindestens 44 px hoch und nichts scrollt seitlich.
