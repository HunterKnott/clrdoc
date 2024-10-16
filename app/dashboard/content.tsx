"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Settings from "./settings";
import Options from "./options";

// Dummy components for PAYMENTS and ACCOUNT sections
const PaymentsContent = () => <div>Payments settings go here.</div>;
const AccountContent = () => <div>Account settings go here.</div>;

export default function DashboardContent({ initialSection }: { initialSection: string }) {
  const searchParams = useSearchParams();
  const [selectedSection, setSelectedSection] = useState(initialSection);

  useEffect(() => {
    const section = searchParams.get("section");
    setSelectedSection(decodeURIComponent(section || "STYLE"));
  }, [searchParams]);

  const renderContent = () => {
    switch (selectedSection) {
      case "STYLE":
        return <Settings />;
      case "PAYMENTS":
        return <PaymentsContent />;
      case "ACCOUNT":
        return <AccountContent />;
      case "LENS OPTIONS":
        return <Options />;
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
}