import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect } from "vitest";
import { supabase } from "@/lib/supabaseClient";
import { MedicationList } from "./MediationList";

// Mock Supabase
vi.mock("@/lib/supabaseClient", async () => {
  const actual = await vi.importActual<any>("@/lib/supabaseClient");
  return {
    ...actual,
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: [
              {
                id: 1,
                name: "Paracetamol",
                dosage: "500mg",
                frequency: "Twice a day",
              },
            ],
            error: null,
          })),
        })),
      })),
    },
  };
});

describe("MedicationList", () => {
  it("renders medication items", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MedicationList userId="123" />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading medications/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Paracetamol")).toBeInTheDocument();
      expect(screen.getByText(/500mg/i)).toBeInTheDocument();
      expect(screen.getByText(/Twice a day/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /mark taken/i })).toBeInTheDocument();
    });
  });
});
