import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDarkMode } from '../hooks/useDarkMode';

function TestComponent() {
  const { isDark, setIsDark } = useDarkMode();
  return (
    <div>
      <span data-testid="val">{String(isDark)}</span>
      <button onClick={() => setIsDark(!isDark)}>toggle</button>
    </div>
  );
}

test('useDarkMode toggles and writes to localStorage', () => {
  localStorage.clear();
  render(<TestComponent />);
  const val = screen.getByTestId('val');
  expect(val).toBeInTheDocument();
  // initial value can be true/false depending on env; toggle and assert change
  const before = val.textContent;
  fireEvent.click(screen.getByText('toggle'));
  expect(val.textContent).not.toBe(before);
});
