import { employeesServerSideValidation } from "@/validator/validator";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "POST") {
    try {
      // Validate the request body
      await employeesServerSideValidation.validate(req.body, {
        abortEarly: false,
      });

      const { first_name, last_name, Phone, email, userEmail, businessId } = req.body;
      console.log("req Body", req.body);

      const loggedInUser = await prisma.user.findUnique({
        where: {
          email: userEmail || email,
          role: {
            in: ["SUPER_ADMIN", "BUSINESS"],
          },
        },
        include: {
          business: {
            include: {
              addresses: true,
            },
          },
        },
      });
      console.log("logged in user", loggedInUser);

      console.log("business Id", businessId);
      const lowerLimit = 6000000000;
      const upperLimit = 9000000000;

      let nextEmployeesUniqueId;

      // Generate a random value between lowerLimit and upperLimit (inclusive)
      nextEmployeesUniqueId = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;

      // Check if the generated uniqueId already exists, and if so, generate another one
      while (
        await prisma.employees.findFirst({
          where: {
            uniqueId: nextEmployeesUniqueId.toString(), // Convert to string
          },
        })
      ) {
        nextEmployeesUniqueId = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
      }

      const uniqueId = nextEmployeesUniqueId.toString();
      console.log("UniqueId:", uniqueId);
      console.log("Creating new employee...");

      // Create the new employee without including addresses in the response
      const newEmployee = await prisma.employees.create({
        data: {
          first_name,
          last_name,
          uniqueId: uniqueId,
          phone: Phone || null,
          business: {
            connect: {
              id: businessId, // Add this line to connect to the business by its id
            },
          },
          users: {
            create: {
              name: first_name,
              role: "EMPLOYEE",
              active: true,
              email: email,
            },
          },
        },
        include: {
          users: true,
        },
      });

      console.log("New Employee created:", newEmployee);

      // Set success message
      const successMessage = "New employee created successfully!";

      // Redirect with success message
      res.status(200).json({ success: successMessage });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Email Already exist" });
    }
  } else {
    console.log("Method Not Allowed.");
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
