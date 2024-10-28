import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from ".";
import { headers } from "next/headers";

export const verifySession = cache(async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.session || !session?.user) {
    redirect("/login");
  }

  return session;
});
