import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient"; // Assuming this is set up

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
};

const Medications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMed, setNewMed] = useState<Medication>({
    id: "",
    name: "",
    dosage: "",
    frequency: "",
    notes: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch medications from Supabase
  useEffect(() => {
    const fetchMedications = async () => {
      const { data, error } = await supabase.from("medications").select("*");
      if (error) {
        toast({ title: "Error fetching medications" });
      } else {
        setMedications(data);
      }
    };

    fetchMedications();
  }, []);

  // Add new medication to Supabase
  const handleAddMedication = async () => {
    if (!newMed.name || !newMed.dosage || !newMed.frequency) {
      toast({ title: "Please fill all required fields" });
      return;
    }

    const { data, error } = await supabase.from("medications").insert([newMed]);
    if (error) {
      toast({ title: "Error adding medication" });
    } else {
      setMedications((prev) => [...prev, data[0]]);
      setNewMed({ id: "", name: "", dosage: "", frequency: "", notes: "" });
      toast({ title: "Medication added successfully" });
    }
  };

  // Delete medication from Supabase
  const handleDeleteMedication = async (id: string) => {
    const { error } = await supabase.from("medications").delete().match({ id });
    if (error) {
      toast({ title: "Error deleting medication" });
    } else {
      setMedications(medications.filter((med) => med.id !== id));
      toast({ title: "Medication deleted successfully" });
    }
  };

  // Filter medications by search query
  const filteredMedications = medications.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Prescribed Medications</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Medication</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Medication</h2>
            <div className="space-y-3">
              <Input
                placeholder="Medication name"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              />
              <Input
                placeholder="Dosage (e.g. 500mg)"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              />
              <Input
                placeholder="Frequency (e.g. twice a day)"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              />
              <Textarea
                placeholder="Additional notes"
                value={newMed.notes}
                onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
              />
              <Button onClick={handleAddMedication} className="w-full">
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input */}
      <Input
        placeholder="Search medications"
        className="mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedications.length === 0 ? (
          <p className="text-gray-500">No medications found.</p>
        ) : (
          filteredMedications.map((med) => (
            <Card key={med.id}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{med.name}</h3>
                <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                {med.notes && <p className="text-sm text-gray-500 mt-2">{med.notes}</p>}
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => handleDeleteMedication(med.id)}>
                    Delete
                  </Button>
                  <Button variant="outline" onClick={() => toast({ title: "Edit functionality coming soon!" })}>
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Medications;
