import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { HomePage } from "./Pages/HomePage/HomePage";
import { UsersPage } from "./Pages/UsersPage/UsersPage";
import { ServicesPage } from "./Pages/ServicesPage/ServicesPage";
import { LegalEntityPage } from "./Pages/LegalEntityPage/LegalEntityPage";
import { ContractsPage } from "./Pages/ContractsPage/ContractsPage";
import { BillsPage } from "./Pages/BillsPage/BillsPage";
import { BankPage } from "./Pages/BankPage/BankPage";
import { ActsPage } from "./Pages/ActsPage/ActsPage";
import ProtectedRoute from "./ProtectedRoute";
import { ServiceDetailsPage } from "./Pages/ServicesPage/ServiceDetailsPage";

import "./App.css";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route
              path="/services/:service_id"
              element={<ServiceDetailsPage />}
            />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/legal_entities" element={<LegalEntityPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/bank_accounts" element={<BankPage />} />
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/acts" element={<ActsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
