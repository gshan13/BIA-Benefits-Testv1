import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@/utils/db";

const prisma = new PrismaClient();
function formatPostalCode(postalCode) {
  // Remove spaces, capitalize, and add a space after the first three characters
  postalCode = postalCode.replace(/\s+/g, "").toUpperCase();

  if (postalCode.length === 6) {
    return `${postalCode.substring(0, 3)} ${postalCode.substring(3)}`;
  } else {
    return postalCode; // Return as is if not 6 characters
  }
}

export default async function handler(req, res) {
  console.log("Received request method:", req.method);
  console.log("Request body:", req.body);
  const session = await getServerSession(req, res, authOptions);
  console.log("Session", session);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "POST") {
    const { data, userEmail } = req.body;

    try {
      const loggedInUser = await prisma.user.findUnique({
        where: {
          email: userEmail,
          role: "BIA",
        },
        include: {
          bia: {
            include: {
              addresses: true,
            },
          },
        },
      });

      console.log("Logged In User:", loggedInUser);

      if (!loggedInUser || !loggedInUser.bia || !loggedInUser.bia.addresses) {
        console.log("User not authorized.");
        return res
          .status(403)
          .json({ error: "User is not authorized to perform this action." });
      }

      console.log("Creating new business...");
      const biaId = loggedInUser.bia.id;

      // Process the data array
      for (const business of data) {
        const { name, email, phone, street1, street2, postalCode, category } =
          business;

        async function getLatestBusinessForBia(biaId) {
          const latestBusiness = await prisma.business.findFirst({
            where: {
              biaId: biaId,
            },
            orderBy: {
              uniqueId: "desc",
            },
          });

          return latestBusiness;
        }

        const latestBusiness = await getLatestBusinessForBia(biaId);

        console.log("latest Business:", latestBusiness);

        // Calculate the new uniqueId for the business
        const businessUniqueId = latestBusiness
          ? incrementUniqueId(latestBusiness.uniqueId)
          : loggedInUser.bia.uniqueId
          ? loggedInUser.bia.uniqueId.substring(0, 4) + "00010000"
          : "000000000000";

        console.log("Unique ID business:", businessUniqueId);

        // Function to increment the uniqueId
        function incrementUniqueId(uniqueId) {
          const businessId = parseInt(uniqueId.substring(4, 8)) + 1;
          return (
            uniqueId.substring(0, 4) +
            businessId.toString().padStart(4, "0") +
            "0000"
          );
        }

        console.log("Formatted Postal Code:", formatPostalCode(postalCode));
        const newBusiness = await prisma.business.create({
          data: {
            name,
            phone: phone.toString(),
            category,
            biaId: biaId,
            postalCode: formatPostalCode(postalCode),
            street1,
            street2,
            uniqueId: businessUniqueId,
            addresses: {
              create: {
                postalCode,
                city: loggedInUser.bia.addresses[0].city,
                province: loggedInUser.bia.addresses[0].province,
                bia: {
                  connect: { id: loggedInUser.bia.id },
                },
              },
            },
            users: {
              create: {
                name,
                role: "BUSINESS",
                active: true,
                email,
              },
            },
          },
          include: {
            users: true,
            addresses: true,
          },
        });

        console.log("New Business created:", newBusiness);
      }

      res.status(200).json({ message: "Businesses created successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    console.log("Method Not Allowed.");
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
