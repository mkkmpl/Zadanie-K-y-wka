// Współrzędne liczymy od zera: najpierw wiersz, potem kolumna.
export const words = [
  { id: 1, answer: 'DOM', clue: 'Budynek, w którym mieszkamy.', direction: 'across', row: 2, col: 3 },
  { id: 2, answer: 'DWA', clue: 'Liczba po jeden.', direction: 'down', row: 2, col: 3 },
  { id: 3, answer: 'KOT', clue: 'Domowe zwierzę, które miauczy.', direction: 'across', row: 5, col: 2 },
  { id: 4, answer: 'KOS', clue: 'Czarny ptak z pomarańczowym dziobem.', direction: 'down', row: 5, col: 2 },
  { id: 5, answer: 'LAS', clue: 'Miejsce, w którym rosną drzewa.', direction: 'across', row: 8, col: 1 },
  { id: 6, answer: 'LIS', clue: 'Rudy, zwinny mieszkaniec lasu.', direction: 'down', row: 8, col: 1 },
  { id: 7, answer: 'MAK', clue: 'Czerwony kwiat lub składnik ciasta.', direction: 'across', row: 11, col: 0 },
  { id: 8, answer: 'MOTYL', clue: 'Kolorowy owad z dużymi skrzydłami.', direction: 'down', row: 11, col: 0 },
];

// Łączymy litery haseł na wspólnej planszy.
export function createGrid(wordList = words) {
  const result = {};
  for (const word of wordList) {
    for (let i = 0; i < word.answer.length; i += 1) {
      const row = word.row + (word.direction === 'down' ? i : 0);
      const col = word.col + (word.direction === 'across' ? i : 0);
      const key = `${row}-${col}`;
      if (!result[key]) result[key] = { row, col, answer: '', numbers: [] };
      const letter = word.answer[i];
      if (result[key].answer && result[key].answer !== letter) {
        throw new Error(`Hasła nie zgadzają się na polu ${key}.`);
      }
      result[key].answer = letter;
      if (i === 0) result[key].numbers.push(word.id);
    }
  }
  return result;
}

export const grid = createGrid();

export function countCrossings(wordList = words) {
  const used = {};
  let crossings = 0;
  for (const word of wordList) {
    for (let i = 0; i < word.answer.length; i += 1) {
      const row = word.row + (word.direction === 'down' ? i : 0);
      const col = word.col + (word.direction === 'across' ? i : 0);
      const key = `${row}-${col}`;
      used[key] = (used[key] || 0) + 1;
      if (used[key] === 2) crossings += 1;
    }
  }
  return crossings;
}
