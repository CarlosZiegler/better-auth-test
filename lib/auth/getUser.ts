import { cache } from "react";
import { verifySession } from "./dal";

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  return session.user;
});
