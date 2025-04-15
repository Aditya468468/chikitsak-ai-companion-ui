
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useRequireAuth(role?: "patient" | "doctor") {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If we have definitive authentication info
    if (session === null) {
      // User is definitely not logged in
      navigate("/login");
    } else if (session) {
      // User is logged in
      if (role) {
        // Check if user has the correct role
        const userRole = session.user?.user_metadata?.role;
        if (userRole && userRole !== role) {
          // Redirect to appropriate dashboard if role mismatch
          navigate(userRole === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [user, session, navigate, role]);

  return { user, session, isAuthenticated };
}
