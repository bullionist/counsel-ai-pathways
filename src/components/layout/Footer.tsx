
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-6 md:py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start px-8 md:px-0">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-counsel-600" />
            <span className="font-bold">CounselAI</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Empowering students with AI-powered personalized counseling.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Platform</h4>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link to="/programs" className="text-sm text-muted-foreground hover:text-foreground">
              Programs
            </Link>
            <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground">
              AI Counselor
            </Link>
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Resources</h4>
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground">
              Support
            </Link>
            <Link to="/documentation" className="text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Company</h4>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
      <div className="container mt-6 border-t pt-6">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CounselAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
