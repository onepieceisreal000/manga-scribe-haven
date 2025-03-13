
import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  ChevronRight, 
  FileText, 
  Settings, 
  Layout, 
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout, admin } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen w-64 bg-manga-primary border-r border-gray-800 flex flex-col">
      <div className="p-5 border-b border-gray-800">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-white">Manga<span className="text-blue-400">Scribe</span></span>
        </Link>
        <p className="text-gray-400 text-sm mt-2">Admin Dashboard</p>
      </div>
      
      <div className="py-4 flex-1 overflow-y-auto">
        <nav className="px-4 space-y-1">
          <Link
            to="/admin"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium",
              isActive("/admin")
                ? "bg-blue-900/30 text-blue-400"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Layout size={18} />
            <span>Dashboard</span>
          </Link>
          
          <Link
            to="/admin/manga"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium",
              isActive("/admin/manga")
                ? "bg-blue-900/30 text-blue-400"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            <BookOpen size={18} />
            <span>Manage Manga</span>
          </Link>
          
          <Link
            to="/admin/manga/create"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium",
              isActive("/admin/manga/create")
                ? "bg-blue-900/30 text-blue-400"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            <ChevronRight size={18} />
            <span>Create Manga</span>
          </Link>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-semibold">{admin?.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{admin?.username}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
