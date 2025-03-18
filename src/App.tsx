import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { LoginPage } from "./pages/loginPage/loginPage";
import { HomePage } from "./pages/homePage/homePage";
import { UsersPage } from "./pages/usersPage/usersPage";
import { ServicesPage } from "./pages/servicesPage/servicesPage";
import { LegalEntityPage } from "./pages/legalEntityPage/legalEntityPage";
import { ContractsPage } from "./pages/contractsPage/contractsPage";
import { BillsPage } from "./pages/billsPage/billsPage";
import { BankPage } from "./pages/bankPage/bankPage";
import { ActsPage } from "./pages/actsPage/actsPage";
import ProtectedRoute from "./protectedRoute";  
import { ServiceDetailsPage } from "./pages/servicesPage/serviceDetailsPage";
import { UserDetailsPage } from "./pages/usersPage/userDetailsPage";

import "./App.css";
import 'antd/dist/reset.css'; // Импорт стилей Ant Design

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
            <Route
              path="/users/:user_id"
              element={<UserDetailsPage />}
            />
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
