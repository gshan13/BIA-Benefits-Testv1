import * as Yup from "yup";
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
    const { title, corporatePartner, addresses, description } = req.body;

    try {
      // Validate the request body using Yup schema
      const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().nullable(),
        corporatePartner: Yup.string().required("Corporate Partner is required"),
        addresses: Yup.array().of(
          Yup.object().shape({
            province: Yup.string().required("Province is required"),
            city: Yup.string().required("City is required"),
            street1: Yup.string().required("Street 1 is required"),
            street2: Yup.string().nullable(),
          })
        ),
      });

      await validationSchema.validate(req.body, { abortEarly: false });

      const formattedAddresses = addresses.map((address) => ({
        province: address.province,
        city: address.city,
        street1: address.street1,
        street2: address.street2,
      }));
      console.log("creating new business");
      // Create a new deal with formatted addresses
      const newDeal = await prisma.Deal.create({
        data: {
          title,
          corporatePartner,
          description,
          addresses: {
            create: formattedAddresses,
          },
        },
      });
      console.log("New Deal", newDeal);
      res.status(200).json(newDeal);
    } catch (error) {
      console.error("Error:", error);
      // Handle validation errors
      if (error.name === "ValidationError") {
        const errors = error.errors.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        res.status(400).json({ errors });
      } else {
        // Handle other errors (e.g., database errors)
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
