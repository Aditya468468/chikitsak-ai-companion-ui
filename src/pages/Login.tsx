
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

export default function Login() {
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loading, setLoading] = useState(false);

  // Parse role from URL or default to patient
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role") || "patient";

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: role
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('signup-', '').replace('login-', '')]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Signup Failed",
        description: "An error occurred during signup.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm
                email={formData.email}
                password={formData.password}
                loading={loading}
                role={role}
                onInputChange={handleInputChange}
                onSubmit={handleLogin}
                onTabChange={setActiveTab}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm
                formData={formData}
                loading={loading}
                onInputChange={handleInputChange}
                onSubmit={handleSignup}
                onTabChange={setActiveTab}
                onRoleChange={(role) => setFormData(prev => ({ ...prev, role }))}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
