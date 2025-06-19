import { render, screen, waitFor } from "@testing-library/react";
import { Adherence } from "./Adherence";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";


vi.mock("../lib/supabaseClient", () => {
  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [
            { id: 1, taken_at: "2024-06-01" },
            { id: 2, taken_at: "2024-06-02" },
            { id: 3, taken_at: "2024-06-03" },
            { id: 4, taken_at: "2024-06-04" },
            { id: 5, taken_at: "2024-06-05" },
          ],
          error: null,
        }),
      })),
    },
  };
});

describe("Adherence", () => {
  const queryClient = new QueryClient();

  it("displays adherence information correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Adherence userId="user123" />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByText(/adherence overview/i)).toBeInTheDocument()
    );

    expect(screen.getByText("17%")).toBeInTheDocument(); // 5/30 = 16.6% ≈ 17%
    expect(screen.getByText(/based on 5 taken doses/i)).toBeInTheDocument();
  });
});
