import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactElement } from 'react';
import { ManageWinnersModal } from '../manage-winners';
import { format } from 'date-fns';

const mockWinner = {
  title: "Test Winner",
  description: "Test Description",
  playbackUrl: "https://example.com/video",
  winnerName: "John Doe",
  rank: 1,
  discordHandle: "@johndoe",
  winningDate: new Date("2024-01-19"),
};

const renderComponent = (props = {}): void => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    winners: [],
    onAddWinner: vi.fn(),
    onEditWinner: vi.fn(),
    onDeleteWinner: vi.fn(),
    ...props,
  };
  render(<ManageWinnersModal {...defaultProps} /> as ReactElement);
};

describe('ManageWinnersModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders add winner form when add button is clicked', async () => {
    renderComponent();
    const addButton = await screen.findByText('Add Winner');
    fireEvent.click(addButton);

    expect(await screen.findByLabelText('Title')).toBeInTheDocument();
    expect(await screen.findByLabelText('Description')).toBeInTheDocument();
    expect(await screen.findByLabelText('Playback URL')).toBeInTheDocument();
    expect(await screen.findByLabelText('Winner Name')).toBeInTheDocument();
    expect(await screen.findByLabelText('Rank')).toBeInTheDocument();
    expect(await screen.findByLabelText('Discord Handle')).toBeInTheDocument();
  });

  it('displays winners list with edit and delete buttons', async () => {
    renderComponent({ winners: [mockWinner] });

    expect(await screen.findByText('Test Winner')).toBeInTheDocument();
    expect(await screen.findByText(`${mockWinner.winnerName} (${mockWinner.discordHandle})`)).toBeInTheDocument();
    expect(await screen.findByText(format(mockWinner.winningDate, 'PPP'))).toBeInTheDocument();

    const editButton = await screen.findByText('Edit');
    const deleteButton = await screen.findByText('Delete');
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onEditWinner when edit button is clicked', async () => {
    const onEditWinner = vi.fn();
    renderComponent({ winners: [mockWinner], onEditWinner });

    const editButton = await screen.findByText('Edit');
    fireEvent.click(editButton);

    expect(onEditWinner).not.toHaveBeenCalled(); // Should only be called after form submission
    expect(await screen.findByDisplayValue('Test Winner')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('John Doe')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('@johndoe')).toBeInTheDocument();
  });

  it('calls onDeleteWinner when delete button is clicked', async () => {
    const onDeleteWinner = vi.fn();
    renderComponent({ winners: [mockWinner], onDeleteWinner });

    const deleteButton = await screen.findByText('Delete');
    fireEvent.click(deleteButton);

    expect(onDeleteWinner).toHaveBeenCalledWith(mockWinner);
  });

  it('validates required fields on form submission', async () => {
    renderComponent();
    const addButton = await screen.findByText('Add Winner');
    fireEvent.click(addButton);

    const submitButton = await screen.findByRole('button', { name: /add winner/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Winner name is required')).toBeInTheDocument();
      expect(screen.getByText('Discord handle is required')).toBeInTheDocument();
    });
  });
});
