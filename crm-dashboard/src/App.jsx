import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

// Local testing only.
// Replace with your refreshed Android FCM token.
// This FCM_TOKEN is stored in backend database but for testing I keep here
const FCM_TOKEN = "eyows0uJRniHBmSDC-dR2b:APA91bF1JRGnEb6yfDHBuoBr_LkmS1FiFytR4wUWVzMon4h93E_-zjEX0gOk46mbsDpAy7GALxRidH1yU65kY-rFrtpS4Ykfw8b0oDUrntyBmhR0jwKLQNE";

const leads = [
  {
    id: 1,
    name: "Rahul Sharma",
    phoneNumber: "+91 98765 43210",
    stage: "Interested",
  },
  {
    id: 2,
    name: "Priya Singh",
    phoneNumber: "+91 98765 12345",
    stage: "Follow-up",
  },
];

function App() {
  const [status, setStatus] = useState("Ready");
  const [loadingLeadId, setLoadingLeadId] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");

  // Check backend connection when the dashboard opens.
  // Repeat the check every 5 seconds.
  useEffect(() => {
    let isMounted = true;

    async function checkBackend() {
      try {
        const response = await fetch(`${API_URL}/health`);

        if (!response.ok) {
          throw new Error("Backend health check failed");
        }

        const data = await response.json();

        if (isMounted) {
          setBackendStatus(
            data.success ? "connected" : "disconnected"
          );
        }
      } catch (error) {
        if (isMounted) {
          setBackendStatus("disconnected");
        }
      }
    }

    checkBackend();

    const intervalId = setInterval(checkBackend, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Send a notification for the selected lead.
  async function handleCall(lead) {
    setLoadingLeadId(lead.id);
    setStatus(`Sending notification for ${lead.name}...`);

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fcmToken: FCM_TOKEN,
            leadId: String(lead.id),
            leadName: lead.name,
            phoneNumber: lead.phoneNumber.replace(/\s/g, ""),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Request failed"
        );
      }

      setStatus(`Notification sent for ${lead.name}.`);
    } catch (error) {
      console.error("Notification error:", error);

      setStatus(`Failed to send notification: ${error.message}`);
    } finally {
      setLoadingLeadId(null);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>LeadZam</h1>
          <p>Click-to-Call CRM Dashboard</p>
        </div>

        {/* Dynamic backend connection status */}
        <span
          className={`connection-status ${backendStatus}`}
          role="status"
        >
          {backendStatus === "checking" && "Checking backend..."}
          {backendStatus === "connected" && "Backend Connected"}
          {backendStatus === "disconnected" && "Backend Disconnected"}
        </span>
      </header>

      <main className="main">
        <section className="page-heading">
          <div>
            <h2>Leads</h2>
            <p>Select a lead to start a call request.</p>
          </div>

          <span className="lead-count">{leads.length} Leads</span>
        </section>

        <section className="lead-list">
          {leads.map((lead) => (
            <article className="lead-card" key={lead.id}>
              <div className="lead-info">
                <div className="avatar">
                  {lead.name.charAt(0)}
                </div>

                <div>
                  <h3>{lead.name}</h3>
                  <p className="phone-number">{lead.phoneNumber}</p>
                  <span className="stage">{lead.stage}</span>
                </div>
              </div>

              <button
                className="call-button"
                onClick={() => handleCall(lead)}
                disabled={
                  loadingLeadId !== null ||
                  backendStatus !== "connected"
                }
              >
                {loadingLeadId === lead.id
                  ? "Sending..."
                  : "Notify Phone"}
              </button>
            </article>
          ))}
        </section>

        <section className="status-panel" aria-live="polite">
          <span>Status</span>
          <p>{status}</p>
        </section>
      </main>

      <footer className="footer">
        LeadZam Click-to-Call Assessment
      </footer>
    </div>
  );
}

export default App;