import React from "react";
import "@ant-design/v5-patch-for-react-19";
import ProtectedRoute from "./protectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import ruRU from "antd/lib/locale/ru_RU";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./pages/loginPage/loginPage";
import { HomePage } from "./pages/homePage/homePage";
import { UsersPage } from "./pages/usersPage/usersPage";
import { UserDetailsPage } from "./pages/usersPage/userDetailsPage";
import { CompaniesPage } from "./pages/companiesPage/companiesPage";
import { CompanyDetailsPage } from "./pages/companiesPage/companyDetailsPage";
import { ServicesPage } from "./pages/servicesPage/servicesPage";
import { TemplatesPage } from "./pages/templatesPage/templatesPage";
import { TemplateDetailsPage } from "./pages/templatesPage/templateDetailsPage";
import { ContractsPage } from "./pages/contractsPage/contractsPage";
import { ContractDetailsPage } from "./pages/contractsPage/contractDetailsPage";
// import { BankAccountsPage } from "./pages/bankAccountsPage/bankAccountsPage";
import { BankAccountDetailsPage } from "./pages/bankAccountsPage/bankAccountDetailsPage";
import { BillsPage } from "./pages/billsPage/billsPage";
import { BillDetailsPage } from "./pages/billsPage/billDetailsPage";
import { ActsPage } from "./pages/actsPage/actsPage";
import { ActDetailsPage } from "./pages/actsPage/actDetailsPage";
import { LegalEntitiesPage } from "./pages/legalEntitiesPage/legalEntitiesPage";
import { LegalEntityDetailsPage } from "./pages/legalEntitiesPage/legalEntityDetailsPage";
import { RolePermissionsPage } from "./pages/rolePermissionsPage/rolePermissionsPage";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import updateLocale from "dayjs/plugin/updateLocale";
import "./App.css";
import "antd/dist/reset.css";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { RolePermissionsDetailsPage } from "./pages/rolePermissionsPage/rolePermissionsDetailsPage";
import { CompanyProvider } from "./context/companyContext";
import { AccountPage } from "./pages/accountPage/acoountPage";
import { AcceptInvitePage } from "./pages/invitePages/acceptInvitePage";
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale("ru", {
  weekStart: 1,
});

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ConfigProvider locale={ruRU}>
      <QueryClientProvider client={queryClient}>
        <CompanyProvider>
          {" "}
          {/* Обернули все приложение в CompanyProvider */}
          <Router>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/accept-invite" element={<AcceptInvitePage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/account" element={<AccountPage />} />

                <Route path="/services" element={<ServicesPage />} />
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
                <Route
                  path="/legal_entities/:legal_entity_id/:bank_account_id"
                  element={<BankAccountDetailsPage />}
                />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route
                  path="/contracts/:contract_id"
                  element={<ContractDetailsPage />}
                />
                {/* <Route path="/bank_accounts" element={<BankAccountsPage />} />
                <Route
                  path="/bank_accounts/:bank_account_id"
                  element={<BankAccountDetailsPage />}
                /> */}
                <Route path="/bills" element={<BillsPage />} />
                <Route path="/bills/:bill_id" element={<BillDetailsPage />} />
                <Route path="/acts" element={<ActsPage />} />
                <Route path="/acts/:act_id" element={<ActDetailsPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route
                  path="/templates/:template_id"
                  element={<TemplateDetailsPage />}
                />
                <Route
                  path="/role_permissions_relations"
                  element={<RolePermissionsPage />}
                />
                <Route
                  path="/role_permissions_relations/:role_id"
                  element={<RolePermissionsDetailsPage />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </CompanyProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
