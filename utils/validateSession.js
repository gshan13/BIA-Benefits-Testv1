import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export const checkSession = async (req, res) => {
  return await getServerSession(req, res, authOptions);
};
