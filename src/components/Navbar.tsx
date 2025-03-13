
import { Link } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, admin } = useAuth();

  return (
    <nav className="bg-manga-primary sticky top-0 z-50 border-b border-gray-800 py-3 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white">Manga<span className="text-blue-400">Scribe</span></span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link to="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <Link to="/?filter=newest" className="text-gray-300 hover:text-white transition">
                Newest
              </Link>
              <Link to="/?filter=popular" className="text-gray-300 hover:text-white transition">
                Popular
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {!isSearchOpen ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-300 hover:text-white"
                >
                  <Search size={20} />
                </Button>
                
                {isAuthenticated ? (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="ml-2">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="ml-2">
                      Admin Login
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <div className="flex items-center">
                <Input
                  placeholder="Search manga..."
                  className="w-60 bg-manga-secondary border-gray-700 text-white focus:border-blue-500"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2 text-gray-300 hover:text-white"
                >
                  <X size={20} />
                </Button>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 py-3 px-4 border-t border-gray-800">
            <div className="flex items-center">
              <Input
                placeholder="Search manga..."
                className="w-full bg-manga-secondary border-gray-700 text-white focus:border-blue-500"
              />
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-gray-300 hover:text-white"
              >
                <Search size={20} />
              </Button>
            </div>
            <div className="space-y-3 pt-2">
              <Link
                to="/"
                className="block text-gray-300 hover:text-white transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/?filter=newest"
                className="block text-gray-300 hover:text-white transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Newest
              </Link>
              <Link
                to="/?filter=popular"
                className="block text-gray-300 hover:text-white transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Popular
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/admin"
                  className="block text-gray-300 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block text-gray-300 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
