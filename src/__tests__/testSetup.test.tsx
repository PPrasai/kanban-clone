import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const TestComponent = () => <h1>Mock component</h1>;

test('renders greeting', () => {
    render(<TestComponent />);
    expect(screen.getByText(/Mock component/i)).toBeInTheDocument();
});
