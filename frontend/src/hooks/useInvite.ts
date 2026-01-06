import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMockInviteData } from "@/lib/mockData";

export function useInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const [inviteData, setInviteData] = useState(() => {
    if (token) {
      return getMockInviteData();
    }
    return null;
  });

  const acceptInvite = async () => {
    // Mock implementation
    console.log("Accepting invite:", inviteData);
    navigate("/workspace");
  };

  const declineInvite = () => {
    navigate("/login");
  };

  return {
    inviteData,
    token,
    email,
    acceptInvite,
    declineInvite,
  };
}

