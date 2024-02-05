import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/utils/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const authOptions = {
  providers: [
    EmailProvider({
      profile(profile) {
        return { type: profile.role ?? "user" };
      },
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // Magic links are valid for 10 minutes only
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role;

      if (user.role === "BIA") {
        // Fetch additional data for BIA role and add it to the session
        try {
          const userWithBIA = await prisma.user.findUnique({
            where: {
              email: user.email,
            },
            include: {
              bia: true,
            },
          });

          session.user.bia = userWithBIA.bia;
        } catch (error) {
          console.error("Error fetching BIA data:", error);
        }
      } else if (user.role === "BUSINESS") {
        // Fetch additional data for BUSINESS role and add it to the session
        // Modify this part based on your BUSINESS model and relationships
        try {
          const userWithBusiness = await prisma.user.findUnique({
            where: {
              email: user.email,
            },
            include: {
              business: true,
            },
          });

          session.user.business = userWithBusiness.business;
        } catch (error) {
          console.error("Error fetching BUSINESS data:", error);
        }
      } else if (user.role === "EMPLOYEE") {
        // Fetch additional data for EMPLOYEE role and add it to the session
        // Modify this part based on your EMPLOYEE model and relationships
        try {
          const userWithEmployee = await prisma.user.findUnique({
            where: {
              email: user.email,
            },
            include: {
              employees: true,
            },
          });

          session.user.employees = userWithEmployee.employees;
        } catch (error) {
          console.error("Error fetching EMPLOYEE data:", error);
        }
      }

      return session;
    },
    async signIn({ user, email }) {
      const prisma = new PrismaClient();
      try {
        const userExists = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });
        if (userExists) {
          console.log("Email Content: ", email);
          return true;
        } else {
          console.log("User is not registered");
          return false;
        }
      } catch (error) {
        console.error("Error while checking user:", error);
        return false; // Handle the error accordingly
      } finally {
        await prisma.$disconnect();
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  debug: true,
  events: {
    async updateUser(message) {},
  },
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request",
    // error: 'auth/loginError'
  },
};

export default NextAuth(authOptions);
