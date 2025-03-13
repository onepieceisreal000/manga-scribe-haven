
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-manga-secondary">
        <div className="neo-glass p-8 rounded-2xl animate-pulse-soft">
          <div className="text-white font-display text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-manga-primary to-manga-secondary">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full opacity-20 blur-3xl bg-blue-600/30" />
        <div className="absolute top-1/3 right-1/4 h-32 w-32 rounded-full opacity-20 blur-3xl bg-indigo-500/30" />
      </div>
    </div>
  );
};

export default AdminLayout;
