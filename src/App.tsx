import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
// import Navbar from "./Navbar"; // Импортируем компонент навигации
import UsersPage from "./UsersPage";
import ServicesPage from "./ServicesPage";
import LegalEntityPage from "./LegalEntityPage";
import ContractsPage from "./ContractsPage";
import BillsPage from "./BillsPage";
import BankPage from "./BankPage";
import ActsPage from "./ActsPage";
import ProtectedRoute from "./ProtectedRoute";

// Создаем клиент React Query
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/legal_entities" element={<LegalEntityPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/bank_accounts" element={<BankPage />} />
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/acts" element={<ActsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
