
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useRequireAuth(role?: "patient" | "doctor") {
  const { user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !session) {
      navigate("/login");
    }
  }, [user, session, navigate]);

  return { user, session };
}
