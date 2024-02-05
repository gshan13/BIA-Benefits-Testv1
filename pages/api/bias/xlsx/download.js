import { PrismaClient } from "@prisma/client";
import XLSX from "xlsx";

const prisma = new PrismaClient();

export default async (req, res) => {
  try {
    const { biaIds } = req.query;
    console.log("bia ids", biaIds);
    const biaIdArray = biaIds.split(",");

    // Fetch necessary data from the database
    const bias = await prisma.bIA.findMany({
      where: {
        id: { in: biaIdArray },
      },
      include: {
        users: true,
        addresses: true,
        businesses: {
          include: {
            users: true,
            employees: {
              include: {
                users: true,
              },
            },
          },
        },
      },
    });

    console.log("bias", bias);

    if (!bias || bias.length === 0) {
      return res.status(404).json({ error: "No relevant data found" });
    }

    const worksheetData = [];

    for (const bia of bias) {
      const { users: biaUsers, businesses } = bia;

      // Include BIA details
      let biaInfo = {
        Id: bia.uniqueId || "N/A",
        User_Type: "BIA",
        BIA_NAME: bia.nameOfBia,
        Business_Name: "N/A",
        Contact_Name: bia.personOfContact,
        Email: biaUsers[0]?.email || "N/A",
        Phone: bia.phBia || "N/A",
        Province: bia && bia.addresses && bia.addresses[0]?.province,
        City: bia && bia.addresses && bia.addresses[0]?.city,
        Name: bia.nameOfBia,
        Street_Address: bia && bia.addresses && bia.addresses[0]?.street1,
        postalCode: bia && bia.addresses && bia.addresses[0]?.postalCode,
      };

      worksheetData.push(biaInfo);

      for (const business of businesses) {
        // Include business details

        let businessInfo = {
          Id: business.uniqueId || "N/A",
          User_Type: "BUSINESS",
          BIA_NAME: bia.nameOfBia,
          Business_Name: "N/A",
          Contact_Name: business.name,
          Email: business.users[0]?.email || "N/A",
          Name: business.name || "N/A",
          Province: bia && bia.addresses && bia.addresses[0]?.province,
          City: bia && bia.addresses && bia.addresses[0]?.city,
          Street_Address: business.street1 || "N/A",
          postalCode: business.postalCode || "N/A",
          Phone: business.phone || "N/A",
        };

        // Include employees data
        if (business.employees.length > 0) {
          const employeesData = business.employees.map((employee) => ({
            Id: employee.uniqueId || "N/A",
            User_Type: "EMPLOYEE",
            Name: `${employee.first_name} ${employee.last_name}`,
            Phone: employee.phone || "N/A",
            BIA_NAME: bia.nameOfBia,
            Business_Name: business.name,
            Contact_Name: `${employee.first_name} ${employee.last_name}`,
            Email: employee.users[0]?.email || "N/A",
            Name: business.name || "N/A",
            Province: bia && bia.addresses && bia.addresses[0]?.province,
            City: bia && bia.addresses && bia.addresses[0]?.city,
            Street_Address: business.street1 || "N/A",
            postalCode: business.postalCode || "N/A",
            Phone: business.phone || "N/A",
          }));

          worksheetData.push(...employeesData);
        }

        // Combine all details into a single object
        const combinedDetails = { ...businessInfo };

        worksheetData.push(combinedDetails);
      }
    }

    console.log("worksheet", worksheetData);
    // Extract headers for the sheet
    const headers = Object.keys(worksheetData[0]);

    // Create a new worksheet with flattened data
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: headers,
    });

    const headerStyle = { font: { bold: true } };
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "bia_report");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Send the XLSX file as a response
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bia_report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
