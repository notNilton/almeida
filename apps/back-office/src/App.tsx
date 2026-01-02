import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AuthGuard } from "./modules/auth/components/AuthGuard";
import { ProjectsPage } from "./modules/projects/pages/ProjectsPage";
import { ProjectViewPage } from "./modules/projects/pages/ProjectViewPage";
import { ProjectEditorPage } from "./modules/projects/pages/ProjectEditorPage";
import { TeamPage } from "./modules/team/pages/TeamPage";
import { HistoryPage } from "./modules/history/pages/HistoryPage";
import { DocumentsPage } from "./modules/documents/pages/DocumentsPage";
import { DashboardHome } from "./modules/dashboard/pages/DashboardHome";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { ProfilePage } from "./modules/users/pages/ProfilePage";
import { SettingsPage } from "./modules/settings/pages/SettingsPage";
import { NotFoundPage } from "./pages/errors/NotFoundPage";
import { ErrorPage } from "./pages/errors/ErrorPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "sonner";

import { useTheme } from "./contexts/ThemeContext";
import { useAuth } from "./modules/auth/contexts/AuthContext";
import { UsersPage } from "./modules/users/pages/UsersPage";
import { ForcePasswordChangePage } from "./modules/auth/pages/ForcePasswordChangePage";

function AppContent() {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.forcePasswordChange) {
    return (
      <>
        <Toaster position="top-right" richColors theme={theme} />
        <ForcePasswordChangePage />
      </>
    );
  }

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
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/new" element={<ProjectEditorPage />} />
                    <Route path="/projects/:id" element={<ProjectViewPage />} />
                    <Route path="/projects/:id/edit" element={<ProjectEditorPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/users" element={<UsersPage />} />
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
