import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, MapPin, Phone, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: number;
  rating: number;
  location: string;
  availableTimes: string[];
  image: string;
  fees: number;
  languages: string[];
}

interface Appointment {
  id: number;
  doctorId: number;
  doctorName: string;
  date: Date;
  time: string;
  speciality: string;
  status: "upcoming" | "completed" | "cancelled";
}

// Mock data with Indian names
const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Aanya Sharma",
    speciality: "General Physician",
    experience: 15,
    rating: 4.8,
    location: "Apollo Clinic, Koramangala",
    availableTimes: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    image: "/api/placeholder/100/100",
    fees: 500,
    languages: ["Hindi", "English", "Bengali"]
  },
  {
    id: 2,
    name: "Dr. Vikram Patel",
    speciality: "Cardiologist",
    experience: 20,
    rating: 4.9,
    location: "Fortis Hospital, Bannerghatta Road",
    availableTimes: ["9:00 AM", "11:30 AM", "1:00 PM", "3:00 PM"],
    image: "/api/placeholder/100/100",
    fees: 1200,
    languages: ["Hindi", "English", "Gujarati"]
  },
  {
    id: 3,
    name: "Dr. Priya Mehta",
    speciality: "Dermatologist",
    experience: 12,
    rating: 4.7,
    location: "Manipal Hospital, Indiranagar",
    availableTimes: ["10:30 AM", "12:00 PM", "3:30 PM", "5:00 PM"],
    image: "/api/placeholder/100/100",
    fees: 800,
    languages: ["Hindi", "English", "Marathi"]
  },
  {
    id: 4,
    name: "Dr. Rajesh Kumar",
    speciality: "Orthopedic Surgeon",
    experience: 18,
    rating: 4.6,
    location: "Narayana Health, Whitefield",
    availableTimes: ["8:30 AM", "10:30 AM", "2:30 PM", "4:30 PM"],
    image: "/api/placeholder/100/100",
    fees: 1000,
    languages: ["Hindi", "English", "Tamil"]
  },
  {
    id: 5,
    name: "Dr. Sunita Reddy",
    speciality: "Gynecologist",
    experience: 16,
    rating: 4.8,
    location: "Columbia Asia, Yeshwantpur",
    availableTimes: ["9:00 AM", "11:00 AM", "1:30 PM", "4:00 PM"],
    image: "/api/placeholder/100/100",
    fees: 900,
    languages: ["Hindi", "English", "Telugu"]
  }
];

// Mock previous appointments
const mockPreviousAppointments: Appointment[] = [
  {
    id: 101,
    doctorId: 1,
    doctorName: "Dr. Aanya Sharma",
    date: new Date(2025, 3, 10),
    time: "11:00 AM",
    speciality: "General Physician",
    status: "completed"
  },
  {
    id: 102,
    doctorId: 3,
    doctorName: "Dr. Priya Mehta",
    date: new Date(2025, 3, 5),
    time: "3:30 PM",
    speciality: "Dermatologist",
    status: "completed"
  }
];

// List of specialities for filter
const specialities = [
  "All Specialities",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Neurologist",
  "Pediatrician",
  "Psychiatrist",
  "ENT Specialist"
];

export default function BookAppointment() {
  useRequireAuth("patient");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("All Specialities");
  const [appointments, setAppointments] = useState<Appointment[]>([...mockPreviousAppointments]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter doctors based on search and speciality
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpeciality = selectedSpeciality === "All Specialities" || 
                             doctor.speciality === selectedSpeciality;
    
    return matchesSearch && matchesSpeciality;
  });

  // Get upcoming appointments
  const upcomingAppointments = appointments.filter(appointment => 
    appointment.status === "upcoming" && 
    new Date(appointment.date) >= new Date()
  );

  const handleBooking = () => {
    if (!selectedDate || !selectedDoctor || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date, doctor, and time slot.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newAppointment: Appointment = {
        id: Math.floor(Math.random() * 1000) + 200,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        speciality: selectedDoctor.speciality,
        status: "upcoming"
      };

      setAppointments(prev => [...prev, newAppointment]);
      
      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment with ${selectedDoctor.name} is scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
      });

      // Reset selection
      setSelectedDoctor(null);
      setSelectedTime(null);
      setIsLoading(false);
    }, 1500);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" />
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        <main className="flex-1 p-6">
          <Tabs defaultValue="book" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="book">Book Appointment</TabsTrigger>
              <TabsTrigger value="appointments">My Appointments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="book" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Book an Appointment</h1>
                <div className="flex items-center gap-4">
                  <Select value={selectedSpeciality} onValueChange={setSelectedSpeciality}>
                    <SelectTrigger className="w-40 md:w-60">
                      <SelectValue placeholder="Speciality" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialities.map((speciality) => (
                        <SelectItem key={speciality} value={speciality}>
                          {speciality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search doctors, specialities..."
                      className="w-40 md:w-60 pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Available Doctors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-4">
                          {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                              <div 
                                key={doctor.id}
                                className={`flex items-start p-4 rounded-lg border transition-colors cursor-pointer ${
                                  selectedDoctor?.id === doctor.id 
                                    ? 'border-primary bg-primary/5' 
                                    : 'hover:border-primary/30 hover:bg-accent/50'
                                }`}
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setSelectedTime(null);
                                }}
                              >
                                <div className="flex-shrink-0 mr-4">
                                  <img 
                                    src={doctor.image} 
                                    alt={doctor.name} 
                                    className="w-14 h-14 rounded-full object-cover"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                                    <Badge variant="outline" className="font-normal">₹{doctor.fees}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">{doctor.speciality} • {doctor.experience} years exp</p>
                                  <div className="flex items-center gap-1 mb-2">
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                      ★ {doctor.rating}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      Speaks: {doctor.languages.join(", ")}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3 mr-1" /> {doctor.location}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10">
                              <p className="text-muted-foreground">No doctors found matching your criteria</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Select Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || date > new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                        }}
                      />
                      {selectedDate && (
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          <CalendarIcon className="inline h-3 w-3 mr-1" />
                          {formatDate(selectedDate)}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {selectedDoctor && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Available Time Slots</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedDoctor.availableTimes.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              onClick={() => setSelectedTime(time)}
                              className="w-full"
                              size="sm"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              {time}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Appointment Summary</h3>
                      {!selectedDoctor ? (
                        <p className="text-sm text-muted-foreground">Please select a doctor to see appointment details</p>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Doctor</span>
                            <span className="text-sm font-medium">{selectedDoctor.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Speciality</span>
                            <span className="text-sm">{selectedDoctor.speciality}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Date</span>
                            <span className="text-sm">{selectedDate?.toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Time</span>
                            <span className="text-sm">{selectedTime || "Not selected"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Fees</span>
                            <span className="text-sm font-medium">₹{selectedDoctor.fees}</span>
                          </div>
                          <div className="pt-2">
                            <Button 
                              onClick={handleBooking}
                              className="w-full"
                              size="lg"
                              disabled={!selectedDate || !selectedDoctor || !selectedTime || isLoading}
                            >
                              {isLoading ? "Booking..." : "Confirm Appointment"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appointments">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">My Appointments</h1>
                
                {upcomingAppointments.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {upcomingAppointments.map(appointment => (
                        <Card key={appointment.id} className="border-l-4 border-l-primary">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{appointment.doctorName}</h3>
                              <Badge variant="outline" className="font-normal">{appointment.speciality}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {formatDate(appointment.date)} • {appointment.time}
                            </div>
                            <div className="flex justify-between">
                              <Button variant="outline" size="sm">
                                <Phone className="h-3 w-3 mr-1" /> Contact
                              </Button>
                              <Button variant="destructive" size="sm">Cancel</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {appointments.filter(a => a.status === "completed").map(appointment => (
                      <Card key={appointment.id} className="border-l-4 border-l-muted">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{appointment.doctorName}</h3>
                            <Badge variant="outline" className="font-normal">{appointment.speciality}</Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDate(appointment.date)} • {appointment.time}
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm">View Prescription</Button>
                            <Button variant="secondary" size="sm">Book Again</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                {upcomingAppointments.length === 0 && appointments.filter(a => a.status === "completed").length === 0 && (
                  <Card className="p-10 text-center">
                    <CardContent>
                      <p className="text-muted-foreground mb-4">You don't have any appointments yet</p>
                      <Button onClick={() => document.querySelector('button[value="book"]')?.click()}>
                        Book Your First Appointment
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
