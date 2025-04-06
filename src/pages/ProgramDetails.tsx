import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { api } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";

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

const ProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProgramDetails();
  }, [id]);
  
  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/programs/${id}`);
      setProgram(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch program details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="text-center">Loading program details...</div>
        </div>
      </PageLayout>
    );
  }
  
  if (!program) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="text-center">Program not found</div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/programs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{program.program_title}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{program.program_overview}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
                {program.curriculum.description && (
                  <CardDescription>{program.curriculum.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {program.curriculum.modules.map((module, index) => (
                      <Badge key={index} variant="secondary">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Academic Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {program.requirements.academic_requirements.map((requirement, index) => (
                      <Badge key={index} variant="secondary">
                        {requirement}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Other Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {program.requirements.other_requirements.map((requirement, index) => (
                      <Badge key={index} variant="secondary">
                        {requirement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Program Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Institution</h3>
                  <p>{program.institution}</p>
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p>{program.location}</p>
                </div>
                <div>
                  <h3 className="font-medium">Program Type</h3>
                  <p className="capitalize">{program.program_type}</p>
                </div>
                <div>
                  <h3 className="font-medium">Field of Study</h3>
                  <p>{program.field_of_study}</p>
                </div>
                <div>
                  <h3 className="font-medium">Budget</h3>
                  <p>${program.budget.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p>{program.duration}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProgramDetails; 