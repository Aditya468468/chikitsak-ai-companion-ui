
import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Search, UserCircle, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock patient data
const mockPatients = [
  { 
    id: 1, 
    name: "Somesh ", 
    age: 42, 
    lastVisit: "2025-04-10", 
    condition: "Hypertension",
    status: "stable",
    gadScore: 6
  },
  { 
    id: 2, 
    name: "Priya Jha", 
    age: 35, 
    lastVisit: "2025-04-12", 
    condition: "Anxiety",
    status: "follow-up",
    gadScore: 15
  },
  { 
    id: 3, 
    name: "Sunidhi Sharma", 
    age: 58, 
    lastVisit: "2025-04-05", 
    condition: "Diabetes",
    status: "stable",
    gadScore: 3
  },
  { 
    id: 4, 
    name: "Amit Yadav", 
    age: 29, 
    lastVisit: "2025-04-14", 
    condition: "Depression",
    status: "critical",
    gadScore: 18
  },
  { 
    id: 5, 
    name: "Mohit Kumar", 
    age: 45, 
    lastVisit: "2025-04-08", 
    condition: "Back pain",
    status: "stable",
    gadScore: 4
  },
];

// Function to get badge variant based on status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "stable":
      return { variant: "outline", text: "Stable" };
    case "follow-up":
      return { variant: "secondary", text: "Follow-up" };
    case "critical":
      return { variant: "destructive", text: "Critical" };
    default:
      return { variant: "outline", text: status };
  }
};

// Function to get badge variant based on GAD score
const getGADBadge = (score: number) => {
  if (score >= 0 && score <= 4) return { variant: "outline", text: "Minimal" };
  if (score >= 5 && score <= 9) return { variant: "default", text: "Mild" };
  if (score >= 10 && score <= 14) return { variant: "secondary", text: "Moderate" };
  return { variant: "destructive", text: "Severe" };
};

export default function PatientManagement() {
  useRequireAuth("doctor");
  
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("all");
  
  // Sort and filter patients
  const filteredPatients = useMemo(() => {
    // First filter by search term
    let result = mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.condition.toLowerCase().includes(search.toLowerCase())
    );
    
    // Then filter by status
    if (filter !== "all") {
      result = result.filter(patient => patient.status === filter);
    }
    
    // Then sort
    return [...result].sort((a, b) => {
      // Type assertion to make TypeScript happy
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [search, sortBy, sortOrder, filter]);
  
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  
  const handleViewPatient = (id: number) => {
    console.log(`View patient ${id}`);
    // In a real application, this would navigate to the patient's detail page
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="doctor" />
      <div className="flex flex-1">
        <Sidebar userType="doctor" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-2">Patient Management</h1>
          <p className="text-gray-600 mb-8">Manage and monitor your patients</p>
          
          <Card className="mb-8">
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="lastVisit">Last Visit</SelectItem>
                    <SelectItem value="gadScore">Anxiety Level</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Patients</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          
          <Tabs defaultValue="list">
            <TabsList className="mb-6">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <Card>
                <div className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => toggleSort("name")}
                        >
                          <div className="flex items-center">
                            Name
                            {sortBy === "name" && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => toggleSort("age")}
                        >
                          <div className="flex items-center">
                            Age
                            {sortBy === "age" && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => toggleSort("lastVisit")}
                        >
                          <div className="flex items-center">
                            Last Visit
                            {sortBy === "lastVisit" && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => toggleSort("gadScore")}
                        >
                          <div className="flex items-center">
                            Anxiety Level
                            {sortBy === "gadScore" && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => {
                        const statusBadge = getStatusBadge(patient.status);
                        const gadBadge = getGADBadge(patient.gadScore);
                        
                        return (
                          <TableRow key={patient.id}>
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>{patient.condition}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={statusBadge.variant as any} 
                                className="capitalize"
                              >
                                {statusBadge.text}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={gadBadge.variant as any} 
                                className="capitalize"
                              >
                                {gadBadge.text} ({patient.gadScore})
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleViewPatient(patient.id)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {filteredPatients.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No patients found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="grid">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient) => {
                  const statusBadge = getStatusBadge(patient.status);
                  const gadBadge = getGADBadge(patient.gadScore);
                  
                  return (
                    <Card key={patient.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <UserCircle className="h-10 w-10 mr-3 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">{patient.age} years old</p>
                            </div>
                          </div>
                          <Badge 
                            variant={statusBadge.variant as any} 
                            className="capitalize ml-auto"
                          >
                            {statusBadge.text}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Condition:</span>
                            <span className="text-sm font-medium">{patient.condition}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Last Visit:</span>
                            <span className="text-sm font-medium">{patient.lastVisit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Anxiety Level:</span>
                            <Badge 
                              variant={gadBadge.variant as any} 
                              className="capitalize"
                            >
                              {gadBadge.text} ({patient.gadScore})
                            </Badge>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-4"
                          onClick={() => handleViewPatient(patient.id)}
                        >
                          View Patient
                        </Button>
                      </div>
                    </Card>
                  );
                })}
                {filteredPatients.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">
                    No patients found
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
