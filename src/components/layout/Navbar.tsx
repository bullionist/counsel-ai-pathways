import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Menu, Lock } from "lucide-react";

const Navbar = () => {
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
          {/* Admin Login Link */}
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/login" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Admin Login
            </Link>
          </Button>
          
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
