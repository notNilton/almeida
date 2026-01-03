import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AuthGuard } from "./modules/auth/components/AuthGuard";
import { DocumentsPage } from "./modules/documents/pages/DocumentsPage";
import { DashboardHome } from "./modules/dashboard/pages/DashboardHome";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { ProfilePage } from "./modules/users/pages/ProfilePage";
import { NotFoundPage } from "./pages/errors/NotFoundPage";
import { ErrorPage } from "./pages/errors/ErrorPage";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { Toaster } from "sonner";
import { UsersPage } from "./modules/users/pages/UsersPage";
import { EmployeesPage } from "./modules/employees/pages/EmployeesPage";
import { EmployeeDetailsPage } from "./modules/employees/pages/EmployeeDetailsPage";
import { ContractsPage } from "./modules/employees/pages/ContractsPage";

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <Toaster position="top-right" richColors theme={theme} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/*"
            element={
              <AuthGuard>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/funcionarios" element={<EmployeesPage />} />
                    <Route path="/funcionarios/:id" element={<EmployeeDetailsPage />} />
                    <Route path="/contratos" element={<ContractsPage />} />
                    <Route path="/documentos" element={<DocumentsPage />} />
                    <Route path="/perfil" element={<ProfilePage />} />
                    <Route path="/usuarios" element={<UsersPage />} />
                  </Routes>
                </DashboardLayout>
              </AuthGuard>
            }
          />
          <Route path="/500" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
