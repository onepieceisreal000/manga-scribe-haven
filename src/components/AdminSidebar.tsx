
import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  ChevronRight, 
  Settings, 
  Layout, 
  LogOut,
  FileText
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
    <div className="h-screen w-72 bg-manga-primary/70 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mr-3">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-display font-semibold tracking-tight text-white">Manga<span className="text-blue-400">Scribe</span></span>
            <p className="text-gray-400 text-xs mt-0.5">Admin Dashboard</p>
          </div>
        </Link>
      </div>
      
      <div className="py-6 flex-1 overflow-y-auto scrollbar">
        <div className="px-3 mb-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider px-3 mb-2 font-medium">Main Navigation</p>
          <nav className="space-y-1.5">
            <Link
              to="/admin"
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive("/admin") && !isActive("/admin/manga")
                  ? "bg-gradient-to-r from-blue-900/40 to-blue-800/20 text-blue-400 shadow-md"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Layout size={18} />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/admin/manga"
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive("/admin/manga") && !isActive("/admin/manga/create")
                  ? "bg-gradient-to-r from-blue-900/40 to-blue-800/20 text-blue-400 shadow-md"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <BookOpen size={18} />
              <span>Manage Manga</span>
            </Link>
            
            <Link
              to="/admin/manga/create"
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive("/admin/manga/create")
                  ? "bg-gradient-to-r from-blue-900/40 to-blue-800/20 text-blue-400 shadow-md"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <ChevronRight size={18} />
              <span>Create Manga</span>
            </Link>
          </nav>
        </div>
        
        <div className="px-3 mb-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider px-3 mb-2 font-medium">Other</p>
          <Link
            to="/"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <FileText size={18} />
            <span>View Website</span>
          </Link>
        </div>
      </div>
      
      <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-lg">{admin?.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{admin?.username}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10 text-white"
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
