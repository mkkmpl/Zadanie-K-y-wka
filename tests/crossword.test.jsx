import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { isWordCorrect } from '../src/App.jsx';
import { countCrossings, grid, words } from '../src/words.js';

describe('plansza i odpowiedzi', () => {
  it('zawiera osiem haseł poziomych i pionowych, które się przecinają', () => {
    expect(words).toHaveLength(8);
    expect(words.some((word) => word.direction === 'across')).toBe(true);
    expect(words.some((word) => word.direction === 'down')).toBe(true);
    expect(countCrossings()).toBeGreaterThanOrEqual(4);
  });

  it('sprawdza wszystkie litery wybranego słowa', () => {
    expect(isWordCorrect(words[0], { '2-3': 'D', '2-4': 'O', '2-5': 'M' })).toBe(true);
    expect(isWordCorrect(words[0], { '2-3': 'D', '2-4': 'X', '2-5': 'M' })).toBe(false);
  });

  it('pokazuje pola i numer startowy pierwszego hasła', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Budynek, w którym mieszkamy/i }));
    expect(screen.getByLabelText(/Wiersz 3, kolumna 4, litera D, numer 1 i 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wiersz 3, kolumna 5, litera O/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wiersz 3, kolumna 6, litera M/i)).toBeInTheDocument();
  });

  it('pomija cyfrę, przyjmuje litery i zostawia tylko ostatnią wpisaną literę', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getAllByLabelText(/Wiersz 3, kolumna 4, litera D/)[0];
    await user.type(input, '7');
    expect(input).toHaveValue('');
    await user.type(input, 'ab');
    expect(input).toHaveValue('B');
  });

  it('podświetla pola po wybraniu definicji', async () => {
    const user = userEvent.setup();
    render(<App />);
    const clue = screen.getAllByRole('button', { name: /Miejsce, w którym rosną drzewa/i })[0];
    await user.click(clue);
    expect(clue).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByLabelText(/Wiersz 9, kolumna 2, litera L/)[0].closest('.cell')).toHaveClass('cell-active-word');
  });

  it('oznacza dobrze i źle wpisane litery po sprawdzeniu', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getAllByLabelText(/Wiersz 3, kolumna 4, litera D/)[0], 'D');
    await user.type(screen.getAllByLabelText(/Wiersz 3, kolumna 5, litera O/)[0], 'X');
    await user.click(screen.getAllByRole('button', { name: 'Sprawdź' })[0]);
    expect(screen.getAllByLabelText(/Wiersz 3, kolumna 4, litera D/)[0].closest('.cell')).toHaveClass('cell-correct');
    expect(screen.getAllByLabelText(/Wiersz 3, kolumna 5, litera O/)[0].closest('.cell')).toHaveClass('cell-wrong');
  });

  it('wypełnia poprawne rozwiązanie', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: 'Pokaż rozwiązanie' })[0]);
    for (const [key, cell] of Object.entries(grid)) {
      const [row, col] = key.split('-').map(Number);
      expect(screen.getAllByLabelText(new RegExp(`Wiersz ${row + 1}, kolumna ${col + 1}, litera ${cell.answer}`))[0]).toHaveValue(cell.answer);
    }
  });

  it('czyści pola po naciśnięciu Wyczyść', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: 'Pokaż rozwiązanie' })[0]);
    await user.click(screen.getAllByRole('button', { name: 'Wyczyść' })[0]);
    expect(screen.getAllByLabelText(/Wiersz 3, kolumna 4, litera D/)[0]).toHaveValue('');
  });
});




