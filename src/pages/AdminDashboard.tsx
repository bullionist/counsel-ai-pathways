import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye, Pencil } from "lucide-react";
import { api } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";

interface Program {
  id: string;
  program_title: string;
  institution: string;
  program_overview: string;
  eligibility_criteria: {
    qualifications: string[];
    experience?: string;
    age_limit?: string;
    other_requirements: string[];
  };
  duration: string;
  fees: number;
  curriculum: {
    core_modules: Array<{
      name: string;
      description?: string;
      credits?: number;
    }>;
    elective_modules?: Array<{
      name: string;
      description?: string;
      credits?: number;
    }>;
  };
  mode_of_delivery: string;
  application_details: string;
  location: string;
  additional_notes?: string;
}

const AdminDashboard = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

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

  const filteredPrograms = programs.filter(program => 
    program.program_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage academic programs</p>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button asChild>
              <Link to="/admin/programs/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Program
              </Link>
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Programs</CardTitle>
            <CardDescription>
              View, edit, and delete academic programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading programs...</div>
            ) : filteredPrograms.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm ? "No programs match your search" : "No programs found"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Program Title</th>
                      <th className="text-left py-3 px-4">Institution</th>
                      <th className="text-left py-3 px-4">Duration</th>
                      <th className="text-left py-3 px-4">Fees</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrograms.map((program) => (
                      <tr key={program.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{program.program_title}</td>
                        <td className="py-3 px-4">{program.institution}</td>
                        <td className="py-3 px-4">{program.duration}</td>
                        <td className="py-3 px-4">${program.fees.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/programs/${program.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/programs/${program.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProgram(program.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard; 