# Mała krzyżówka

Prosta, responsywna krzyżówka w React. Ma osiem haseł poziomych i pionowych, numerowane pola startowe, definicje do wyboru, sprawdzanie liter, podgląd rozwiązania i czyszczenie planszy. Siatka i obsługa odpowiedzi są rozpisane w czytelny sposób, z komentarzami przy ważniejszych fragmentach.

## Wymagania

- Node.js 20 lub nowszy
- npm

## Instalacja i uruchomienie

```bash
npm install
npm run dev
```

Otwórz adres wyświetlony przez Vite, zwykle `http://localhost:5173`.

## Testy i budowanie

```bash
npm test
npm run build
npm run preview
```

Testy sprawdzają m.in. przecięcia i liczbę haseł, walidację odpowiedzi, pola i numerację, filtrowanie wpisywanych znaków, wybór definicji, sprawdzanie, wyświetlenie rozwiązania oraz czyszczenie planszy.

## Jak działa projekt

- `src/words.js` — hasła i ich pozycje; `createGrid` układa wspólną planszę.
- `src/App.jsx` — widok krzyżówki, pola, definicje i przyciski.
- `src/styles.css` — wygląd i kolory pól.
- `tests/crossword.test.jsx` — testy zachowania aplikacji.
- `vite.config.js` — konfiguracja uruchamiania i Vitest.
- `INSTRUKCJA.pdf` — instrukcja dla użytkownika.

Kliknij definicję, by zaznaczyć jej pola na niebiesko. Aktywne pole jest żółte. Przycisk **Sprawdź** oznacza wpisane dobre litery na zielono, a złe na czerwono. **Pokaż rozwiązanie** uzupełnia planszę, a **Wyczyść** usuwa wpisy.

Instrukcja użytkownika w PDF: [INSTRUKCJA.pdf](./INSTRUKCJA.pdf).
