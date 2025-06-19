// components/AddMedicationForm.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";

export const AddMedicationForm = ({ userId }: { userId: string }) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!name || !dosage || !frequency) {
        throw new Error("All fields are required.");
      }
      const { error } = await supabase
        .from("medication")
        .insert([{ user_id: userId, name, dosage, frequency }]);
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      setDosage("");
      setFrequency("");
      setErrorMsg("");
      queryClient.invalidateQueries({ queryKey: ["medication", userId] });
    },
    onError: (error: any) => {
      setErrorMsg(error.message);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-4"
    >
      <div className="grid gap-2">
        <label htmlFor="medicationName" className="font-medium">
          Medication Name
        </label>
        <input
          id="medicationName"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="dosage" className="font-medium">
          Dosage
        </label>
        <input
          id="dosage"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="frequency" className="font-medium">
          Frequency
        </label>
        <input
          id="frequency"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          type="text"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        />
      </div>

      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

      <Button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Adding..." : "Add Medication"}
      </Button>
    </form>
  );
};
