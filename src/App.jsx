import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import "./assets/tailwind.css";
import Loading from "./components/Loading";

/* Lazy Pages */
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Customers = lazy(() => import("./pages/Customers"));
const CustomerDetail = lazy(() => import("./pages/CustomerDetail"));
const Orders = lazy(() => import("./pages/Orders"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

// ─── 1. TAMBAHKAN LAZY IMPORT UNTUK PAGE COMPONENTS DI SINI ───
const Components = lazy(() => import("./pages/Components")); 

/* Auth */
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Forgot = lazy(() => import("./pages/Auth/Forgot"));

/* Layout */
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));

/* ─── Protected Route Component ─── */
function ProtectedRoute({ children, adminOnly = false }) {
  const { session, profile, loading } = useAuth();

  if (loading) return <Loading />;
  if (!session) return <Navigate to="/login" replace />;
  if (adminOnly && profile?.role !== "Admin") return <Navigate to="/" replace />;

  return children;
}

/* ─── Guest Route (redirect jika sudah login) ─── */
function GuestRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) return <Loading />;
  if (session) return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* Auth */}
        <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* Main */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/customers" element={<ProtectedRoute adminOnly><Customers /></ProtectedRoute>} />
          <Route path="/customers/:id" element={<ProtectedRoute adminOnly><CustomerDetail /></ProtectedRoute>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* ─── 2. DAFTARKAN ROUTE COMPONENTS DI SINI ─── */}
          <Route path="/components" element={<Components />} /> 

          <Route path="/400" element={<ErrorPage code="400" />} />
          <Route path="/401" element={<ErrorPage code="401" />} />
          <Route path="/403" element={<ErrorPage code="403" />} />

          <Route path="*" element={<ErrorPage code="404" />} />
        </Route>

      </Routes>
    </Suspense>
  );
}

export default App;