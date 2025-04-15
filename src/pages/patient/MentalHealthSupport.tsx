
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function MentalHealthSupport() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" />
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold">Mental Health Support</h1>
          <p className="text-gray-600 mt-2">Coming soon</p>
        </main>
      </div>
    </div>
  );
}
