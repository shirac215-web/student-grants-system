import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainComponent } from "../MainComponent";
import Dashboard from "../Dashboard";
import FromStepTwo from "../FromStepTwo";
import Login from "../Login";
import Register from "../Register";
import Navbar from "./NavBar";
import ScholarshipStatus from "../statusRequest.jsx";
import HeaderSteps from "../HeadSteps";
import AdminRequests from "../AdminRequests";
import AdminRequestDetails from "../AdminRequestDetails";

// ─── FIX: redirect to /login if not authenticated ────────────────────────────
const RequireAuth = ({ auth, children }) => {
  return auth?.user ? children : <Navigate to="/login" replace />;
};

// דפי מנהל: רק משתמש מחובר עם תפקיד admin. השרת בודק את ההרשאה שוב בכל בקשה
const RequireAdmin = ({ auth, children }) => {
  if (!auth?.user) return <Navigate to="/login" replace />;
  return auth.user.role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

export const Router = ({ auth }) => {
  return (
    <BrowserRouter>
      <Navbar auth={auth} />
      <Routes>
        <Route path="/" element={<MainComponent />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
  <RequireAuth auth={auth}><Dashboard auth={auth} /></RequireAuth>
} />
        <Route path="/request-status" element={<RequireAuth auth={auth}><ScholarshipStatus /></RequireAuth>} />
        <Route path="/from-step-two" element={<RequireAuth auth={auth}><FromStepTwo /></RequireAuth>} />
        <Route path="/HeadSteps" element={<RequireAuth auth={auth}><HeaderSteps /></RequireAuth>} />

        {/* Admin routes */}
        <Route path="/admin-requests" element={<RequireAdmin auth={auth}><AdminRequests /></RequireAdmin>} />
        <Route path="/admin-requests/:id" element={<RequireAdmin auth={auth}><AdminRequestDetails /></RequireAdmin>} />

        {/* ─── FIX: pass auth prop to Login so it can call auth.login() ──── */}
        <Route path="/login" element={<Login auth={auth} />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};