import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders octofit navigation', () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>
  );

  const heading = screen.getByText(/bootstrap 기반 octofit 대시보드/i);
  expect(heading).toBeInTheDocument();

  const navigation = screen.getByRole('navigation', {
    name: /octofit sections/i,
  });

  expect(
    screen.getByRole('link', { name: /^users$/i, hidden: false })
  ).toBeInTheDocument();
  expect(navigation).toBeInTheDocument();
});
