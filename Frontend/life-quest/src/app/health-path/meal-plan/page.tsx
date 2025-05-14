"use client";
import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useAuthActions } from "../../../providers/auth-provider";
import { useHealthPathActions } from "@/providers/health-path-provider/health-provider";
import { getId } from "../../../utils/decoder";

export default function HealthPathPage() {
  const [loading, setLoading] = useState(true);
  const [healthPath, setHealthPath] = useState(null);
  const [messageApi] = message.useMessage();
  const { getCurrentPerson } = useAuthActions();
  const { getHealthPath } = useHealthPathActions();
  const router = useRouter();

  useEffect(() => {
    const fetchHealthPath = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) {
          message.error("JWT not found");
          return;
        }

        const id = getId(token);
        const person = await getCurrentPerson(parseInt(id));
        if (!person?.id) {
          message.warning("Person not found for this user.");
          return;
        }
console.log(person.id)
        const healthPath = await getHealthPath(person.id);

        console.log("ss",healthPath)
        if (!healthPath?.id) {
          message.warning("Fitness path not found.");
          return;
        }

        setHealthPath(healthPath);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load health path.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthPath();
  }, [ ]);

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f5f7fa" }}>
      {loading ? (
        <div
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <h2>Your Health Path</h2>
          {healthPath ? (
            <div>
              <h3>{healthPath.name}</h3>
              <p>{healthPath.description}</p>
            </div>
          ) : (
            <p>No health path found.</p>
          )}
        </div>
      )}
    </div>
  );
}
