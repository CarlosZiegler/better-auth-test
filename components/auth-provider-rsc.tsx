import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthProviderRSC({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  console.log("session - rsc", session);

  if (!session) {
    console.log("redirecting to sign-in");
    return redirect("/sign-in");
  }
  return children;
}
// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { data: session, isPending, error } = useSession();

//   if (isPending) {
//     return <Loader2 className="animate-spin" size={16} />;
//   }

//   if (error) {
//     console.error(error);
//     return <div>Error: {error.message}</div>;
//   }

//   if (!session) {
//     console.log("redirecting to sign-in");
//     return redirect("/sign-in");
//   }
//   return children;
// }
