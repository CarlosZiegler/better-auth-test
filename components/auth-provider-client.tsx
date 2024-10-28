"use client";

import { useSession } from "@/lib/auth/client";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending, isRefetching, error } = useSession();

  if (isPending || isRefetching) {
    return <Loader2 className="animate-spin" size={16} />;
  }

  if (!session && !isPending) {
    redirect("/sign-in");
  }

  return children;
}
