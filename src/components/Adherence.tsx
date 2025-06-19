import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

export const Adherence = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adherence", userId],
    queryFn: async () => {
      const { data: logs, error } = await supabase
        .from("medication_logs")
        .select("id, taken_at")
        .eq("user_id", userId);

      if (error) throw error;

      const takenCount = logs?.length || 0;
      const adherence = takenCount / 30; // assume goal is 30 doses

      return {
        takenCount,
        adherence: Math.min(adherence, 1), // cap at 100%
      };
    },
  });

  if (isLoading) return <p>Loading adherence data...</p>;
  if (error) return <p className="text-red-600">Failed to load adherence.</p>;
  if (!data || data.takenCount === 0)
    return <p className="text-gray-500 text-sm text-center">No adherence data found yet.</p>;

  return (
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold text-green-700">Adherence Overview</h3>
      <p className="text-3xl font-bold text-blue-600">
        {(data.adherence * 100).toFixed(0)}%
      </p>
      <p className="text-muted-foreground text-sm">
        Based on {data.takenCount} taken doses (last 30 days)
      </p>
    </div>
  );
};
