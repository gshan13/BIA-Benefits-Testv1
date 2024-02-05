// Import necessary dependencies
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Common/Modal";
import Link from "next/link";

const DashboardCard = ({ user }) => {
  // State for counts
  const [counts, setCounts] = useState({
    employees: 0,
    deals: 0,
    businesses: 0,
    bias: 0,
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/counts");
        if (response.ok) {
          const data = await response.json();
          setCounts(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data. Please try again later.");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Card component
  const Card = ({ title, content, buttonText }) => (
    <div className="card w-96 bg-base-100 shadow-xl image-full m-4">
      <figure></figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{content}</p>
        <div className="card-actions justify-center">
          <div className="badge">{buttonText}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ml-20">
      {/* Top row */}
      <div className="flex justify-center">
        <Card
          title="EMPLOYEES"
          content={`You have ${counts.employees} employees registered under BIA Benefits`}
          buttonText={counts.employees.toString()}
        />

        <Card
          title="DEALS"
          content={`You have ${counts.deals} Deals provided by Corporate Partners.`}
          buttonText={counts.deals.toString()}
        />

        <Card
          title="BUSINESSES"
          content={`You have ${counts.businesses} Businesses registered under  ${counts.bias} `}
          buttonText={counts.businesses.toString()}
        />

        <Card
          title="BIA"
          content={`You have ${counts.bias} BIAs registered under BIA Benefits`}
          buttonText={counts.bias.toString()}
        />
      </div>
    </div>
  );
};

export default DashboardCard;
