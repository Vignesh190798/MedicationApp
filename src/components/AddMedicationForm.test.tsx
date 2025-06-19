import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AddMedicationForm } from "./AddMedication";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

describe("AddMedicationForm", () => {
  it("renders form inputs", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddMedicationForm userId="test-user" />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/medication name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dosage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
  });
});
