import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Menu, Lock, LogOut } from "lucide-react";
import { isAdminAuthenticated, logoutAdmin } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isAdmin = isAdminAuthenticated();
  
  // Check if we're on the chat page
  const isChatPage = location.pathname === '/chat';

  const handleLogout = () => {
    logoutAdmin();
    toast({
      title: "Success",
      description: "Successfully logged out",
    });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-counsel-600" />
            <span className="text-xl font-bold">CounselAI</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Only show admin login/logout if not on chat page */}
          {!isChatPage && (
            <>
              {isAdmin ? (
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/login" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Admin Login
                  </Link>
                </Button>
              )}
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
