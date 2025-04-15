
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  availableTimes: string[];
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    speciality: "General Physician",
    availableTimes: ["10:00 AM", "2:00 PM", "4:00 PM"]
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    speciality: "Cardiologist",
    availableTimes: ["9:00 AM", "1:00 PM", "3:00 PM"]
  }
];

export default function BookAppointment() {
  useRequireAuth("patient");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleBooking = () => {
    if (!selectedDate || !selectedDoctor || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date, doctor, and time slot.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${selectedDoctor.name} is scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" />
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Select Doctor</h2>
                <div className="space-y-4">
                  {mockDoctors.map((doctor) => (
                    <button 
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`w-full p-4 rounded-lg border transition-colors ${
                        selectedDoctor?.id === doctor.id 
                          ? 'border-primary bg-primary/10' 
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <h3 className="font-medium">{doctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{doctor.speciality}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {selectedDoctor && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoctor.availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              <Button 
                onClick={handleBooking}
                className="w-full"
                size="lg"
                disabled={!selectedDate || !selectedDoctor || !selectedTime}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
