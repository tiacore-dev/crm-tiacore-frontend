import React from "react";
import ProtectedRoute from "./protectedRoute";
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
import { UserDetailsPage } from "./pages/usersPage/userDetailsPage";

import { CompaniesPage } from "./pages/companiesPage/companiesPage";
import { CompanyDetailsPage } from "./pages/companiesPage/companyDetailsPage";

import { ServicesPage } from "./pages/servicesPage/servicesPage";
// import { ServiceDetailsPage } from "./pages/servicesPage/serviceDetailsPage";

import { TemplatesPage } from "./pages/templatesPage/templatesPage";
import { TemplateDetailsPage } from "./pages/templatesPage/templateDetailsPage";

import { ContractsPage } from "./pages/contractsPage/contractsPage";
import { ContractDetailsPage } from "./pages/contractsPage/contractDetailsPage";

import { BankAccountsPage } from "./pages/bankAccountsPage/bankAccountsPage";
import { BankAccountDetailsPage } from "./pages/bankAccountsPage/bankAccountDetailsPage";

import { BillsPage } from "./pages/billsPage/billsPage";
import { BillDetailsPage } from "./pages/billsPage/billDetailsPage";

import { ActsPage } from "./pages/actsPage/actsPage";
import { ActDetailsPage } from "./pages/actsPage/actDetailsPage";

import { LegalEntitiesPage } from "./pages/legalEntitiesPage/legalEntitiesPage";
import { LegalEntityDetailsPage } from "./pages/legalEntitiesPage/legalEntityDetailsPage";

import "./App.css";
import "antd/dist/reset.css"; // Импорт стилей Ant Design

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
            {/* <Route
              path="/services/:service_id"
              element={<ServiceDetailsPage />}
            /> */}

            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:user_id" element={<UserDetailsPage />} />

            <Route path="/companies" element={<CompaniesPage />} />
            <Route
              path="/companies/:company_id"
              element={<CompanyDetailsPage />}
            />
            <Route path="/legal_entities" element={<LegalEntitiesPage />} />
            <Route
              path="/legal_entities/:legal_entity_id"
              element={<LegalEntityDetailsPage />}
            />

            <Route path="/contracts" element={<ContractsPage />} />
            <Route
              path="/contracts/:contract_id"
              element={<ContractDetailsPage />}
            />

            <Route path="/bank_accounts" element={<BankAccountsPage />} />
            <Route
              path="/bank_accounts/:bank_account_id"
              element={<BankAccountDetailsPage />}
            />

            <Route path="/bills" element={<BillsPage />} />
            <Route path="/bills/:bill_id" element={<BillDetailsPage />} />

            <Route path="/acts" element={<ActsPage />} />
            <Route path="/acts/:act_id" element={<ActDetailsPage />} />

            <Route path="/templates" element={<TemplatesPage />} />
            <Route
              path="/templates/:template_id"
              element={<TemplateDetailsPage />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
