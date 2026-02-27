import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Sidebar', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    } as ReturnType<typeof useRouter>);
    mockPush.mockClear();
  });

  it('renders navigation links', () => {
    render(<Sidebar currentPage="persona" setCurrentPage={vi.fn()} />);
    expect(screen.getByTitle('Account Settings')).toBeInTheDocument();
    expect(screen.getByTitle('Posted Posts')).toBeInTheDocument();
  });

  it('calls setCurrentPage when a nav link is clicked', () => {
    const setCurrentPage = vi.fn();
    render(<Sidebar currentPage="persona" setCurrentPage={setCurrentPage} />);
    fireEvent.click(screen.getByTitle('Posted Posts'));
    expect(setCurrentPage).toHaveBeenCalledWith('posted');
  });

  it('shows logout button', () => {
    render(<Sidebar currentPage="persona" setCurrentPage={vi.fn()} />);
    expect(screen.getByTitle('Logout')).toBeInTheDocument();
  });

  it('calls logout API and redirects to login on logout click', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
    } as Response);
    render(<Sidebar currentPage="persona" setCurrentPage={vi.fn()} />);
    fireEvent.click(screen.getByTitle('Logout'));
    await vi.waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/api/auth/logout', expect.any(Object));
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
    fetchSpy.mockRestore();
  });
});
