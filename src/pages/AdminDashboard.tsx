import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface Program {
  id: string;
  program_title: string;
  institution: string;
  program_overview: string;
  location: string;
  program_type: string;
  field_of_study: string;
  budget: number;
  duration: string;
  curriculum: {
    description: string;
    modules: string[];
  };
  requirements: {
    academic_requirements: string[];
    other_requirements: string[];
  };
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchPrograms();
  }, []);
  
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/programs");
      setPrograms(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch programs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPrograms();
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get(`/api/programs/search?q=${encodeURIComponent(searchQuery)}`);
      setPrograms(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search programs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProgram = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await api.delete(`/api/programs/${id}`);
        toast({
          title: "Success",
          description: "Program deleted successfully",
        });
        fetchPrograms();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete program",
          variant: "destructive",
        });
      }
    }
  };
  
  const filteredPrograms = programs.filter(program => {
    const searchLower = searchQuery.toLowerCase();
    return (
      program.program_title.toLowerCase().includes(searchLower) ||
      program.institution.toLowerCase().includes(searchLower) ||
      program.field_of_study.toLowerCase().includes(searchLower) ||
      program.program_type.toLowerCase().includes(searchLower)
    );
  });
  
  if (loading) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="text-center">Loading programs...</div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Program Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage academic programs and their details
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/programs/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </Link>
          </Button>
        </div>
        
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="h-full">
              <CardHeader>
                <CardTitle>{program.program_title}</CardTitle>
                <CardDescription>{program.institution}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {program.program_type}
                    </Badge>
                    <Badge variant="secondary">
                      {program.field_of_study}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{program.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget:</span>
                      <span>${program.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {program.program_overview}
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/programs/${program.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProgram(program.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredPrograms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No programs found</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminDashboard; 