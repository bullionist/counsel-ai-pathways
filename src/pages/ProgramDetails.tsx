import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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

const ProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const handleDeleteProgram = async () => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await api.delete(`/api/programs/${id}`);
        toast({
          title: "Success",
          description: "Program deleted successfully",
        });
        window.location.href = "/admin/dashboard";
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete program",
          variant: "destructive",
        });
      }
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
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{program.program_title}</h1>
              <p className="text-muted-foreground">{program.institution}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to={`/admin/programs/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Program
                </Link>
              </Button>
              <Button variant="destructive" onClick={handleDeleteProgram}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Program
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Overview</h3>
                    <p className="text-muted-foreground">{program.program_overview}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Duration</h3>
                      <p className="text-muted-foreground">{program.duration}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Fees</h3>
                      <p className="text-muted-foreground">${program.fees.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Mode of Delivery</h3>
                      <p className="text-muted-foreground">{program.mode_of_delivery}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Location</h3>
                      <p className="text-muted-foreground">{program.location}</p>
                    </div>
                  </div>
                  
                  {program.additional_notes && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
                      <p className="text-muted-foreground">{program.additional_notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="eligibility">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Qualifications</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {program.eligibility_criteria.qualifications.map((qualification, index) => (
                        <li key={index} className="text-muted-foreground">{qualification}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {program.eligibility_criteria.experience && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Experience</h3>
                      <p className="text-muted-foreground">{program.eligibility_criteria.experience}</p>
                    </div>
                  )}
                  
                  {program.eligibility_criteria.age_limit && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Age Limit</h3>
                      <p className="text-muted-foreground">{program.eligibility_criteria.age_limit}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Other Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {program.eligibility_criteria.other_requirements.map((requirement, index) => (
                        <li key={index} className="text-muted-foreground">{requirement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Core Modules</h3>
                    <div className="space-y-4">
                      {program.curriculum.core_modules.map((module, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium">{module.name}</h4>
                          {module.description && (
                            <p className="text-muted-foreground mt-1">{module.description}</p>
                          )}
                          {module.credits && (
                            <p className="text-sm text-muted-foreground mt-1">Credits: {module.credits}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {program.curriculum.elective_modules && program.curriculum.elective_modules.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Elective Modules</h3>
                      <div className="space-y-4">
                        {program.curriculum.elective_modules.map((module, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-medium">{module.name}</h4>
                            {module.description && (
                              <p className="text-muted-foreground mt-1">{module.description}</p>
                            )}
                            {module.credits && (
                              <p className="text-sm text-muted-foreground mt-1">Credits: {module.credits}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="application">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Application Process</h3>
                    <p className="text-muted-foreground">{program.application_details}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProgramDetails; 