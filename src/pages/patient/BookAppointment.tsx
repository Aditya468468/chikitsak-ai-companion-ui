import { useState, useEffect, useRef } from "react";
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
  Star, Award, FileText, User, Trash, RefreshCw, Video, MessageSquare, CheckCircle,
  Send, X, ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
  meetLink?: string;
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
  meetLink?: string;
}

interface ChatMessage {
  id: string;
  sender: "patient" | "doctor";
  message: string;
  timestamp: Date;
  isRead: boolean;
  appointmentId: number;
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
    languages: ["Hindi", "English", "Bengali"],
    meetLink: "https://meet.google.com/abc-defg-hij"
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
    languages: ["Hindi", "English", "Gujarati"],
    meetLink: "https://meet.google.com/jkl-mnop-qrs"
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
    languages: ["Hindi", "English", "Marathi"],
    meetLink: "https://meet.google.com/tuv-wxyz-123"
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
    languages: ["Hindi", "English", "Tamil"],
    meetLink: "https://meet.google.com/456-789-abc"
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
    languages: ["Hindi", "English", "Telugu"],
    meetLink: "https://meet.google.com/def-ghi-jkl"
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
    prescription: "1. Azithromycin 500mg - Once daily for 3 days\n2. Bromhexine Syrup - 10ml thrice daily\n3. Paracetamol 500mg - SOS for fever",
    meetLink: "https://meet.google.com/abc-defg-hij"
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
    prescription: "1. Mometasone Furoate 0.1% cream - Apply twice daily\n2. Cetaphil Moisturizing Lotion - Apply liberally after bath\n3. Avoid hot water for bathing",
    meetLink: "https://meet.google.com/tuv-wxyz-123"
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
    meetLink: "https://meet.google.com/jkl-mnop-qrs"
  }
];

// Mock chat messages
const mockChatMessages: ChatMessage[] = [
  {
    id: "msg1",
    appointmentId: 103,
    sender: "doctor",
    message: "Hello! I can see you've booked an appointment for today. How can I help you?",
    timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
    isRead: true
  },
  {
    id: "msg2",
    appointmentId: 103,
    sender: "patient",
    message: "Hi Dr. Patel, I've been experiencing some chest pain lately, especially after physical activity.",
    timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
    isRead: true
  },
  {
    id: "msg3",
    appointmentId: 103,
    sender: "doctor",
    message: "I understand your concern. Could you describe the nature of the pain? Is it sharp, dull, or pressure-like? Does it radiate to other areas?",
    timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 45)),
    isRead: true
  },
  {
    id: "msg4",
    appointmentId: 103,
    sender: "patient",
    message: "It feels like pressure, mostly in the center of my chest. Sometimes it goes to my left shoulder.",
    timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
    isRead: true
  },
  {
    id: "msg5",
    appointmentId: 103,
    sender: "doctor",
    message: "Thank you for that description. We'll discuss this in detail during our video consultation. Please make sure to join on time, and I'd recommend having your recent medical reports handy if available.",
    timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 15)),
    isRead: false
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load appointments and chat messages from localStorage on component mount
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

    const savedChatMessages = localStorage.getItem('chatMessages');
    if (savedChatMessages) {
      try {
        const parsedMessages = JSON.parse(savedChatMessages).map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setChatMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing saved chat messages:", error);
        setChatMessages([...mockChatMessages]);
      }
    } else {
      setChatMessages([...mockChatMessages]);
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  // Save chat messages to localStorage whenever they change
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  // Scroll to bottom of chat when messages change or chat is opened
  useEffect(() => {
    if (chatEndRef.current && isChatOpen) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

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

  // Get appointment-specific chat messages
  const getAppointmentChatMessages = (appointmentId) => {
    return chatMessages.filter(msg => msg.appointmentId === appointmentId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

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
        status: isToday(selectedDate) ? "ongoing" : "upcoming",
        meetLink: selectedDoctor.meetLink
      };

      setAppointments(prev => [...prev, newAppointment]);
      
      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment with ${selectedDoctor.name} is scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
      });

      // Add welcome message from doctor
      const newChatMessage: ChatMessage = {
        id: `msg${Date.now()}`,
        appointmentId: newAppointment.id,
        sender: "doctor",
        message: `Hello! This is ${selectedDoctor.name}. Thank you for booking an appointment. I look forward to our session on ${selectedDate.toLocaleDateString()} at ${selectedTime}. Feel free to message me here if you have any questions before our appointment.`,
        timestamp: new Date(),
        isRead: false
      };
      
      setChatMessages(prev => [...prev, newChatMessage]);

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

  // Join video consultation - redirects to Google Meet
  const handleJoinConsultation = (appointment: Appointment) => {
    if (appointment.meetLink) {
      toast({
        title: "Joining Video Call",
        description: "Redirecting to Google Meet...",
      });
      
      // Redirect to Google Meet in a new tab
      window.open(appointment.meetLink, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Video Link Not Available",
        description: "The video link for this appointment is not available.",
        variant: "destructive"
      });
    }
  };

  // Open chat for an appointment
  const handleOpenChat = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsChatOpen(true);
    
    // Mark unread messages as read
    if (selectedAppointment) {
      setChatMessages(prev => 
        prev.map(msg => 
          msg.appointmentId === appointment.id && msg.sender === "doctor" && !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        )
      );
    }
  };

  // Send a new chat message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedAppointment) return;
    
    const newChatMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      appointmentId: selectedAppointment.id,
      sender: "patient",
      message: newMessage.trim(),
      timestamp: new Date(),
      isRead: false
    };
    
    setChatMessages(prev => [...prev, newChatMessage]);
    setNewMessage("");
    
    // Simulate doctor's reply after a short delay
    setTimeout(() => {
      if (selectedAppointment) {
        const doctorReply: ChatMessage = {
          id: `msg${Date.now() + 1}`,
          appointmentId: selectedAppointment.id,
          sender: "doctor",
          message: "Thank you for your message. I'll get back to you shortly.",
          timestamp: new Date(),
          isRead: false
        };
        
        setChatMessages(prev => [...prev, doctorReply]);
      }
    }, 10000); // 10 seconds delay
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

  // Format timestamp for chat messages
  const formatMessageTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Get unread message count for an appointment
  const getUnreadCount = (appointmentId: number) => {
    return chatMessages.filter(msg => 
      msg.appointmentId === appointmentId && 
      msg.sender === "doctor" && 
      !msg.isRead
    ).length;
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
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 relative"
                onClick={() => handleOpenChat(appointment)}
              >
                <MessageSquare className="h-3 w-3 mr-1" /> Chat
                {getUnreadCount(appointment.id) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {getUnreadCount(appointment.id)}
                  </span>
                )}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={() => handleJoinConsultation(appointment)}
              >
                <Video className="h-3 w-3 mr-1" /> Join Meet
              </Button>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleMarkCompleted(appointment.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" /> Mark as Completed
            </Button>
          </div>
        ) : (
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="relative"
              onClick={() => handleOpenChat(appointment)}
            >
              <MessageSquare className="h-3 w-3 mr-1" /> Chat
              {getUnreadCount(appointment.id) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {getUnreadCount(appointment.id)}
                </span>
              )}
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
                                  {doctor.meetLink && (
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <Video className="h-3 w-3 mr-1" /> Online Consultation Available
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10">
                              <p className="text-muted-foreground">No doctors found matching your criteria.</p>
                              <Button 
                                variant="link" 
                                onClick={() => {
                                  setSearchQuery("");
                                  setSelectedSpeciality("All Specialities");
                                }}
                              >
                                Clear filters
                              </Button>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Select Date & Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="border rounded-md mb-4"
                          disabled={(date) => {
                            // Disable past dates
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      
                        {selectedDoctor && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Available Time Slots</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedDoctor.availableTimes.map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  size="sm"
                                  className="w-full"
                                  onClick={() => setSelectedTime(time)}
                                >
                                  <Clock className="h-3 w-3 mr-1" /> {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {!selectedDoctor && (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            Please select a doctor to view available time slots
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {selectedDoctor && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Doctor:</span>
                              <span className="font-medium">{selectedDoctor.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Speciality:</span>
                              <span>{selectedDoctor.speciality}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Date:</span>
                              <span>{selectedDate ? formatDate(selectedDate) : "Not selected"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Time:</span>
                              <span>{selectedTime || "Not selected"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Consultation Fee:</span>
                              <span className="font-medium">₹{selectedDoctor.fees}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                              <Button 
                                className="w-full" 
                                disabled={!selectedDate || !selectedTime || isLoading}
                                onClick={handleBooking}
                              >
                                {isLoading ? "Booking..." : "Confirm Booking"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments" className="space-y-6">
              <h1 className="text-3xl font-bold">My Appointments</h1>
              
              {/* Ongoing appointments */}
              {ongoingAppointments.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Today's Appointments</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ongoingAppointments.map(appointment => renderAppointmentCard(appointment))}
                  </div>
                </div>
              )}
              
              {/* Upcoming appointments */}
              {upcomingAppointments.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingAppointments.map(appointment => renderAppointmentCard(appointment))}
                  </div>
                </div>
              )}
              
              {/* Past appointments */}
              {pastAppointments.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Past Appointments</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastAppointments.map(appointment => renderAppointmentCard(appointment, true))}
                  </div>
                </div>
              )}
              
              {/* No appointments message */}
              {appointments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No appointments yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't booked any appointments yet.</p>
                  <Button onClick={() => setActiveTab("book")}>Book Now</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      

      {/* Prescription Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prescription & Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Doctor's Notes</h3>
              <p className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-md">
                {selectedAppointment?.notes || "No notes available"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Prescription</h3>
              <pre className="text-sm text-muted-foreground font-mono bg-accent/50 p-3 rounded-md whitespace-pre-wrap">
                {selectedAppointment?.prescription || "No prescription available"}
              </pre>
            </div>
          </div>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            {selectedAppointment && (
              <Button 
                variant="secondary"
                onClick={() => handleBookAgain(selectedAppointment)}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Book Follow-up
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {selectedAppointment && getInitials(selectedAppointment.doctorName)}
                </AvatarFallback>
              </Avatar>
              {selectedAppointment?.doctorName}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pt-4">
            <div className="space-y-4 pb-4">
              {selectedAppointment && getAppointmentChatMessages(selectedAppointment.id).map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'patient' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
          
          <div className="pt-4 border-t mt-auto">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex space-x-2"
            >
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-10 flex-1"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
