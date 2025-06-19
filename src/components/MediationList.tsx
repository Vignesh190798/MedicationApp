import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react"; // Tick icon
import { useState } from "react";

export const MedicationList = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const [activeMedId, setActiveMedId] = useState<number | null>(null);
  const [justTakenId, setJustTakenId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: medication, isLoading, error } = useQuery({
    queryKey: ["medication", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medication")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
  });

  const markAsTaken = useMutation({
    mutationFn: async (medId: number) => {
      setActiveMedId(medId);
      const { error } = await supabase
        .from("medication_logs")
        .insert([{ user_id: userId, medication_id: medId, taken_at: new Date().toISOString() }]);
      if (error) throw error;
    },
    onSuccess: (_, medId) => {
      setJustTakenId(medId);
      setTimeout(() => setJustTakenId(null), 2000); // Reset after 2s
    },
    onSettled: () => {
      setActiveMedId(null);
      queryClient.invalidateQueries({ queryKey: ["medication", userId] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message);
    },
  });

  if (isLoading) return <p>Loading medications...</p>;
  if (error) return <p className="text-red-600">Error loading medications</p>;

  return (
    <div className="space-y-4">
      {medication?.map((med) => (
        <div
          key={med.id}
          className="p-4 rounded-lg border border-gray-200 shadow-sm bg-white flex justify-between items-center"
        >
          <div>
            <h4 className="font-semibold text-blue-700">{med.name}</h4>
            <p className="text-sm text-gray-500">
              Dosage: {med.dosage} • Frequency: {med.frequency}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => markAsTaken.mutate(med.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
              disabled={markAsTaken.isPending && activeMedId === med.id}
            >
              {markAsTaken.isPending && activeMedId === med.id
                ? "Saving..."
                : "Mark Taken"}
            </Button>
            {justTakenId === med.id && (
              <Check className="text-green-600 w-5 h-5 animate-ping-once" />
            )}
          </div>
        </div>
      ))}
      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
    </div>
  );
};
