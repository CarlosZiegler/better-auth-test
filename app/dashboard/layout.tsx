import AuthProvider from "@/components/auth-provider-client";
import AuthProviderRSC from "@/components/auth-provider-rsc";

// Client Auth Provider
// export default async function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return <AuthProvider>{children}</AuthProvider>;
// }

// Server Auth Provider
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("DashboardLayout");
  // @ts-expect-error - this is a server component
  // return <AuthProviderRSC>{children}</AuthProviderRSC>;
  return children;
}
