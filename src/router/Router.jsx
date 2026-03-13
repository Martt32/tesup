import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import UserPage from "../pages/UserPage";
import Dashboard from "../pages/Dashboard";
import Plans from "../pages/Plans";
import Transactions from "../pages/Transactions";
import Deposit from "../pages/Deposit";
import Wallet from "../pages/Wallet";
import Withdraw from "../pages/Withdraw";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import Test from "../components/test";
import CompleteProfile from "../pages/CompleteProfile";
import ProtectedRoute from "./ProtectedRoutes";
import CreatePlan from "../pages/CreatePlan";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Loader from "../components/Loader";
import Investments from "../pages/Investment";
import ApproveTransaction from "../pages/ApproveTransaction";
import About from "../pages/About";
import Contact from "../pages/Contact";
import VerifyEmail from "../pages/EmailVerify";
import AdminReferrals from "../pages/Referrals";
import Referrals from "../pages/UserReferral";
const Router = () => {
  const { loading } = useContext(AuthContext);

  return loading ? (
    <Loader />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route
          path="/approve_tx"
          element={
            <ProtectedRoute>
              <ApproveTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <AdminReferrals />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<VerifyEmail />} />
        {
          //User Routes
        }
        <Route path="/test" element={<Test />} />
        <Route path="/app" element={<UserPage />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="referrals"
            element={
              <ProtectedRoute>
                <Referrals />
              </ProtectedRoute>
            }
          />
          <Route
            path="create-plan"
            element={
              <ProtectedRoute>
                <CreatePlan />
              </ProtectedRoute>
            }
          />
          <Route path="plans" element={<Plans />} />
          <Route path="investments" element={<Investments />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
