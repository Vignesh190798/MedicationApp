// src/pages/Dashboard.tsx
import { useAuth } from "@/hooks/UseAuth";
import { AddMedicationForm } from "./AddMedication";
import { MedicationList } from "./MediationList";
import { Adherence } from "./Adherence";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // shadcn UI button

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-blue-700">Hello, {user.email}</h2>
          <p className="text-muted-foreground">Here’s your daily medication summary</p>
          <Button
            onClick={() => navigate("/home")} // navigate to Onboarding
            className="mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Home
          </Button>
        </header>

        <section className="bg-white rounded-xl shadow p-6">
          <AddMedicationForm userId={user.id} />
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Your Medications</h3>
          <MedicationList userId={user.id} />
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <Adherence userId={user.id} />
        </section>
      </div>
    </div>
  );
}
