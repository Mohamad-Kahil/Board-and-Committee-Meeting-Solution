import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import MeetingScheduling from "./components/meetings/MeetingScheduling";
import AuthUserManagement from "./components/auth/AuthUserManagement";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting-scheduling" element={<MeetingScheduling />} />
          <Route
            path="/auth-user-management"
            element={<AuthUserManagement />}
          />
          {/* Add catch-all route for deployed app */}
          <Route path="*" element={<Home />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
