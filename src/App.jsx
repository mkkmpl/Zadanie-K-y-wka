import { useState } from 'react';
import { grid, words } from './words.js';

const ROWS = 16;
const COLUMNS = 9;
const EMPTY_ANSWERS = Object.fromEntries(Object.keys(grid).map((key) => [key, '']));

// Zamieniamy polskie znaki na ich podstawowe litery, żeby wpisywanie było proste.
function cleanLetter(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

export function isWordCorrect(word, answers) {
  return word.answer.split('').every((letter, index) => {
    const row = word.row + (word.direction === 'down' ? index : 0);
    const col = word.col + (word.direction === 'across' ? index : 0);
    return cleanLetter(answers[`${row}-${col}`] || '') === letter;
  });
}

export function App() {
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [activeWord, setActiveWord] = useState(words[0]);
  const [activeCell, setActiveCell] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [message, setMessage] = useState('Wybierz definicję i wpisz odpowiedzi.');

  function chooseWord(word) {
    setActiveWord(word);
    setActiveCell(null);
    setMessage(`Wybrane hasło ${word.id}: ${word.direction === 'across' ? 'poziomo' : 'pionowo'}.`);
  }

  function updateLetter(key, rawValue) {
    const letter = cleanLetter(rawValue).slice(-1);
    setAnswers((oldAnswers) => ({ ...oldAnswers, [key]: letter }));
    setChecked(false);
    setShowAnswers(false);
  }

  function checkAnswers() {
    setChecked(true);
    setShowAnswers(false);
    const correctCount = words.filter((word) => isWordCorrect(word, answers)).length;
    setMessage(`Poprawne hasła: ${correctCount} z ${words.length}. Zielone pola są poprawne, czerwone wymagają poprawy.`);
  }

  function showSolution() {
    const solution = Object.fromEntries(
      Object.entries(grid).map(([key, cell]) => [key, cell.answer]),
    );
    setAnswers(solution);
    setShowAnswers(true);
    setChecked(false);
    setMessage('Pokazano poprawne rozwiązanie całej krzyżówki.');
  }

  function clearAnswers() {
    setAnswers({ ...EMPTY_ANSWERS });
    setChecked(false);
    setShowAnswers(false);
    setMessage('Plansza została wyczyszczona.');
  }

  function isPartOfActiveWord(row, col) {
    const index = activeWord.direction === 'across' ? col - activeWord.col : row - activeWord.row;
    const correctRow = activeWord.row + (activeWord.direction === 'down' ? index : 0);
    const correctCol = activeWord.col + (activeWord.direction === 'across' ? index : 0);
    return index >= 0 && index < activeWord.answer.length && row === correctRow && col === correctCol;
  }

  function cellClass(row, col, key) {
    const classes = ['cell'];
    if (isPartOfActiveWord(row, col)) classes.push('cell-active-word');
    if (checked && answers[key]) {
      const rightLetter = cleanLetter(answers[key]) === grid[key].answer;
      classes.push(rightLetter ? 'cell-correct' : 'cell-wrong');
    }
    return classes.join(' ');
  }

  const acrossWords = words.filter((word) => word.direction === 'across');
  const downWords = words.filter((word) => word.direction === 'down');

  return (
    <main className="page">
      <section className="app-card">
        <header className="page-heading">
          <div>
            <p className="eyebrow">Ćwiczenie w React</p>
            <h1>Mała krzyżówka</h1>
            <p className="intro">Kliknij definicję, a potem wpisz po jednej literze w każde pole.</p>
          </div>
          <div className="word-count" aria-label={`${words.length} haseł`}>8 <span>haseł</span></div>
        </header>

        <div className="legend" aria-label="Legenda kolorów">
          <span><i className="legend-blue" /> wybrane hasło</span>
          <span><i className="legend-yellow" /> aktywne pole</span>
          <span><i className="legend-green" /> dobra litera</span>
          <span><i className="legend-red" /> błędna litera</span>
        </div>

        <div className="game-layout">
          <div className="board-wrap">
            <div className="board" role="grid" aria-label="Plansza krzyżówki" style={{ '--columns': COLUMNS }}>
              {Array.from({ length: ROWS * COLUMNS }, (_, position) => {
                const row = Math.floor(position / COLUMNS);
                const col = position % COLUMNS;
                const key = `${row}-${col}`;
                const cell = grid[key];
                if (!cell) return <div className="empty-cell" key={key} aria-hidden="true" />;
                const isActiveInput = activeCell === key;

                return (
                  <div className={cellClass(row, col, key)} key={key}>
                    {cell.numbers.length > 0 && <span className="cell-number">{cell.numbers.join('/')}</span>}
                    <input
                      aria-label={`Wiersz ${row + 1}, kolumna ${col + 1}, litera ${cell.answer}${cell.numbers.length ? `, numer ${cell.numbers.join(' i ')}` : ''}`}
                      autoComplete="off"
                      className={isActiveInput ? 'letter-input input-focused' : 'letter-input'}
                      maxLength={2}
                      onChange={(event) => updateLetter(key, event.target.value)}
                      onFocus={() => setActiveCell(key)}
                      value={answers[key] || ''}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="clues" aria-label="Definicje haseł">
            <h2>Definicje</h2>
            <ClueList title="Poziomo" items={acrossWords} activeWord={activeWord} onChoose={chooseWord} />
            <ClueList title="Pionowo" items={downWords} activeWord={activeWord} onChoose={chooseWord} />
          </aside>
        </div>

        <div className="actions">
          <button className="button button-primary" onClick={checkAnswers}>Sprawdź</button>
          <button className="button button-secondary" onClick={showSolution}>Pokaż rozwiązanie</button>
          <button className="button button-quiet" onClick={clearAnswers}>Wyczyść</button>
        </div>
        <p className="status" role="status" aria-live="polite">{message}</p>
        <p className="small-note">Wpisanie znaku zastępuje go pojedynczą wielką literą. Cyfry i znaki specjalne są pomijane.</p>
      </section>
      <footer>Prosty projekt edukacyjny · React</footer>
    </main>
  );
}

function ClueList({ title, items, activeWord, onChoose }) {
  return (
    <section className="clue-group">
      <h3>{title}</h3>
      <ol>
        {items.map((word) => (
          <li key={word.id}>
            <button
              aria-pressed={activeWord.id === word.id}
              className={activeWord.id === word.id ? 'clue-button clue-selected' : 'clue-button'}
              onClick={() => onChoose(word)}
            >
              <span className="clue-number">{word.id}</span>
              <span>{word.clue}</span>
              <span className="clue-length">{word.answer.length}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default App;


