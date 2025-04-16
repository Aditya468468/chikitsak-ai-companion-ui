import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Search, MapPin, Phone, Clock, Calendar as CalendarIcon, 
  Star, Award, FileText, User, Trash, RefreshCw, Video, MessageSquare, CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  notes?: string;
  prescription?: string;
}

// Mock data with Indian names and better images
const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Aanya Sharma",
    speciality: "General Physician",
    experience: 15,
    rating: 4.8,
    location: "Apollo Clinic, Koramangala",
    availableTimes: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    image: "https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/person.svg", // Fallback SVG
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
    image: "https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/person.svg", // Fallback SVG
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
    image: "https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/person.svg", // Fallback SVG
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
    image: "https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/person.svg", // Fallback SVG
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
    image: "https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/person.svg", // Fallback SVG
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
    status: "completed",
    notes: "Patient complained of persistent cough and mild fever. Prescribed antibiotics and cough syrup.",
    prescription: "1. Azithromycin 500mg - Once daily for 3 days\n2. Bromhexine Syrup - 10ml thrice daily\n3. Paracetamol 500mg - SOS for fever"
  },
  {
    id: 102,
    doctorId: 3,
    doctorName: "Dr. Priya Mehta",
    date: new Date(2025, 3, 5),
    time: "3:30 PM",
    speciality: "Dermatologist",
    status: "completed",
    notes: "Patient has eczema on both arms. Prescribed topical steroids and moisturizer.",
    prescription: "1. Mometasone Furoate 0.1% cream - Apply twice daily\n2. Cetaphil Moisturizing Lotion - Apply liberally after bath\n3. Avoid hot water for bathing"
  },
  // Add an ongoing appointment
  {
    id: 103,
    doctorId: 2,
    doctorName: "Dr. Vikram Patel",
    date: new Date(), // Today's date
    time: "11:30 AM",
    speciality: "Cardiologist",
    status: "ongoing",
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

// Generate avatar initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

// Helper to check if an appointment is for today
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export default function BookAppointment() {
  useRequireAuth("patient");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("All Specialities");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("book");

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        const parsedAppointments = JSON.parse(savedAppointments).map(app => ({
          ...app,
          date: new Date(app.date) // Convert date string back to Date object
        }));
        setAppointments(parsedAppointments);
      } catch (error) {
        console.error("Error parsing saved appointments:", error);
        setAppointments([...mockPreviousAppointments]);
      }
    } else {
      setAppointments([...mockPreviousAppointments]);
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  // Filter doctors based on search and speciality
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpeciality = selectedSpeciality === "All Specialities" || 
                             doctor.speciality === selectedSpeciality;
    
    return matchesSearch && matchesSpeciality;
  });

  // Memoize filtered appointments
  const { upcomingAppointments, ongoingAppointments, pastAppointments } = appointments.reduce((acc, appointment) => {
    if (appointment.status === "completed") {
      acc.pastAppointments.push(appointment);
    } else if (isToday(new Date(appointment.date))) {
      acc.ongoingAppointments.push(appointment);
    } else if (appointment.status === "upcoming" && new Date(appointment.date) > new Date()) {
      acc.upcomingAppointments.push(appointment);
    }
    return acc;
  }, { upcomingAppointments: [], ongoingAppointments: [], pastAppointments: [] });

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
        status: isToday(selectedDate) ? "ongoing" : "upcoming"
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
      
      // Switch to appointments tab
      setActiveTab("appointments");
    }, 1500);
  };

  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId 
          ? { ...app, status: "cancelled" } 
          : app
      )
    );
    
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    });
  };

  // Handle booking again (reuse previous doctor info)
  const handleBookAgain = (appointment: Appointment) => {
    const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setSelectedDate(new Date());
      setSelectedTime(null);
      // Switch to book tab
      setActiveTab("book");
      // Close dialog if open
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Doctor Not Available",
        description: "This doctor is no longer available for booking.",
        variant: "destructive"
      });
    }
  };

  // Handle marking appointment as completed
  const handleMarkCompleted = (appointmentId: number) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId 
          ? { 
              ...app, 
              status: "completed",
              notes: "Follow-up appointment completed successfully. Patient showing good recovery.",
              prescription: "1. Continue previous medications\n2. Follow up in 2 weeks if symptoms persist"
            } 
          : app
      )
    );
    
    toast({
      title: "Appointment Completed",
      description: "Your appointment has been marked as completed.",
    });
  };

  // Handle viewing prescription
  const handleViewPrescription = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  // Join video consultation
  const handleJoinConsultation = (appointmentId: number) => {
    toast({
      title: "Joining Consultation",
      description: "Connecting to video consultation...",
    });
    
    // Here you would typically connect to a video service
    // For demo purposes, just show a toast
    setTimeout(() => {
      toast({
        title: "Connected",
        description: "You are now connected to your doctor.",
      });
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

  // Render an appointment card
  const renderAppointmentCard = (appointment: Appointment, isPast = false) => (
    <Card key={appointment.id} className={`border-l-4 ${isPast ? 'border-l-muted' : appointment.status === 'ongoing' ? 'border-l-green-500' : 'border-l-primary'}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(appointment.doctorName)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{appointment.doctorName}</h3>
          </div>
          <Badge variant="outline" className="font-normal">{appointment.speciality}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {isToday(new Date(appointment.date)) ? 'Today' : formatDate(new Date(appointment.date))} • {appointment.time}
        </div>
        
        {/* Different button sets based on appointment type */}
        {isPast ? (
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewPrescription(appointment)}
            >
              <FileText className="h-3 w-3 mr-1" /> View Prescription
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleBookAgain(appointment)}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Book Again
            </Button>
          </div>
        ) : appointment.status === 'ongoing' ? (
          <div className="flex justify-between gap-2 mt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="h-3 w-3 mr-1" /> Chat
            </Button>
            <Button variant="default" size="sm" className="flex-1" onClick={() => handleJoinConsultation(appointment.id)}>
              <Video className="h-3 w-3 mr-1" /> Join
            </Button>
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleMarkCompleted(appointment.id)}>
              <CheckCircle className="h-3 w-3 mr-1" /> Complete
            </Button>
          </div>
        ) : (
          <div className="flex justify-between">
            <Button variant="outline" size="sm">
              <Phone className="h-3 w-3 mr-1" /> Contact
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleCancelAppointment(appointment.id)}
            >
              <Trash className="h-3 w-3 mr-1" /> Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" />
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src={doctor.image} alt={doctor.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {getInitials(doctor.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                                    <Badge variant="outline" className="font-normal">₹{doctor.fees}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {doctor.speciality} • {doctor.experience} years exp
                                  </p>
                                  <div className="flex items-center gap-1 mb-2">
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                                      <Star className="h-3 w-3 mr-1 fill-green-800" /> {doctor.rating}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      Speaks: {doctor.languages.join(", ")}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3 mr-1" /> {doctor.location}
                                  </div>
                                  {doctor.id === 1 && (
                                    <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                                      <Award className="h-3 w-3 mr-1" /> Top Rated
                                    </Badge>
                                  )}
                                  {doctor.id === 2 && (
                                    <Badge variant="secondary" className="mt-2">
                                      <Award className="h-3 w-3 mr-1" /> Specialist
                                    </Badge>
                                  )}
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
                
                {/* Today's Ongoing Appointments */}
                {ongoingAppointments.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {ongoingAppointments.map(appointment => renderAppointmentCard(appointment))}
                    </div>
                  </div>
                )}
                
                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {upcomingAppointments.map(appointment => renderAppointmentCard(appointment))}
                    </div>
                  </div>
                )}

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pastAppointments.map(appointment => renderAppointmentCard(appointment, true))}
                    </div>
                  </div>
                )}

                {/* No appointments message */}
                {ongoingAppointments.length === 0 && upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
                  <Card className="border-dashed border-2">
                    <CardContent className="py-8 text-center">
                      <div className="flex justify-center mb-4">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No appointments found</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-4">
                        You don't have any appointments scheduled. Book your first appointment with a doctor to get started.
                      </p>
                      <Button onClick={() => setActiveTab("book")}>
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Prescription Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Prescription Details</DialogTitle>
              </DialogHeader>
              
              {selectedAppointment && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{selectedAppointment.doctorName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.speciality}</p>
                    </div>
                    <Badge variant="outline">
                      {formatDate(new Date(selectedAppointment.date))}
                    </Badge>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h4 className="font-medium mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" /> 
                      Notes
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.notes || "No notes available"}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" /> 
                      Prescription
                    </h4>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <pre className="text-sm whitespace-pre-wrap">
                        {selectedAppointment.prescription || "No prescription available"}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={() => handleBookAgain(selectedAppointment)}>
                      <RefreshCw className="h-4 w-4 mr-2" /> Book Follow-up
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
