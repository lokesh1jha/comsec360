"use client";

import Main from "@/components/Main";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Popup } from "@/components/popup/Popup";

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  
  const handleVerified = () => {
    setIsVerified(true); // Set verified state when OTP is verified
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      // If token exists, check if it is valid
      if (token) {
        const storedId = localStorage.getItem("id");
        const storedEmail = localStorage.getItem("email");
        const storedInviteType = localStorage.getItem("inviteType");
        const storedCompanyId = localStorage.getItem("companyId");

        // Handle query parameters from the URL
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get("id");
        const email = queryParams.get("email");
        const inviteType = queryParams.get("inviteType");
        const companyId = queryParams.get("companyId");

        // Check if parameters match between localStorage and query parameters
        if ((storedId && storedEmail && storedInviteType && storedCompanyId) && (id && email && inviteType && companyId)) {
          if (storedId !== id || storedEmail !== email || storedInviteType !== inviteType || storedCompanyId !== companyId) {
            // If there's a mismatch, prompt for re-verification
            toast({
              title: "Mismatch Detected",
              description: "The link parameters do not match your session. Please reverify.",
              variant: "destructive",
            });
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("email");
            localStorage.removeItem("inviteType");
            localStorage.removeItem("companyId");

            // Reload the page to start over
            window.location.reload();
            return;
          }
        }

        // TODO: Replace with API call to validate token
        const isTokenValid = true; // Replace with actual validation logic
        if (isTokenValid) {
          setIsVerified(true);
          setIsLoading(false);
          return;
        } else {
          toast({
            title: "Invalid Token",
            description: "Your session has expired. Please reverify.",
            variant: "destructive",
          });
          localStorage.removeItem("token");
        }
      }

      // Handle query parameters if token does not exist
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get("id");
      const email = queryParams.get("email");
      const inviteType = queryParams.get("inviteType");
      const companyId = queryParams.get("companyId");

      if (!id || !email || !inviteType || !companyId) {
        toast({
          title: "Invalid Link",
          description: "The link is missing required parameters.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Store parameters in local storage for later use if it's a fresh link
      localStorage.setItem("id", id);
      localStorage.setItem("email", email);
      localStorage.setItem("inviteType", inviteType);
      localStorage.setItem("companyId", companyId);

      // Clear the query parameters from the URL
      window.history.replaceState({}, document.title, window.location.pathname);

      setIsLoading(false); // Loading complete
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading state or spinner
  }

  return (
    <>
      {!isVerified && <Popup onVerified={handleVerified} />}
      {isVerified && <Main />}
    </>
  );
}
