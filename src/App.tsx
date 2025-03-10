import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import MeetingScheduling from "./components/meetings/MeetingScheduling";
import MeetingDashboard from "./components/meetings/MeetingDashboard";
import AuthUserManagement from "./components/auth/AuthUserManagement";
import AgendaManagement from "./components/agenda/AgendaManagement";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting-scheduling" element={<MeetingScheduling />} />
          <Route path="/meeting-dashboard" element={<MeetingDashboard />} />
          <Route
            path="/auth-user-management"
            element={<AuthUserManagement />}
          />
          <Route path="/agenda-management" element={<AgendaManagement />} />
          {/* Add catch-all route for deployed app */}
          <Route path="*" element={<Home />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </div>
    </Suspense>
  );
}

export default App;
