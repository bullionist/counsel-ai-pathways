import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, X } from "lucide-react";
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

interface Module {
  name: string;
  description?: string;
  credits?: number;
}

const ProgramForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [programTitle, setProgramTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [programOverview, setProgramOverview] = useState("");
  const [duration, setDuration] = useState("");
  const [fees, setFees] = useState("");
  const [modeOfDelivery, setModeOfDelivery] = useState("");
  const [location, setLocation] = useState("");
  const [applicationDetails, setApplicationDetails] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // Eligibility criteria
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [newQualification, setNewQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [ageLimit, setAgeLimit] = useState("");
  const [otherRequirements, setOtherRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  
  // Curriculum
  const [coreModules, setCoreModules] = useState<Module[]>([]);
  const [newCoreModule, setNewCoreModule] = useState<Module>({ name: "", description: "", credits: undefined });
  const [electiveModules, setElectiveModules] = useState<Module[]>([]);
  const [newElectiveModule, setNewElectiveModule] = useState<Module>({ name: "", description: "", credits: undefined });
  
  useEffect(() => {
    if (isEditing) {
      fetchProgramDetails();
    } else {
      setLoading(false);
    }
  }, [id]);
  
  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/programs/${id}`);
      const program = response.data;
      
      // Set form state
      setProgramTitle(program.program_title);
      setInstitution(program.institution);
      setProgramOverview(program.program_overview);
      setDuration(program.duration);
      setFees(program.fees.toString());
      setModeOfDelivery(program.mode_of_delivery);
      setLocation(program.location);
      setApplicationDetails(program.application_details);
      setAdditionalNotes(program.additional_notes || "");
      
      // Set eligibility criteria
      setQualifications(program.eligibility_criteria.qualifications);
      setExperience(program.eligibility_criteria.experience || "");
      setAgeLimit(program.eligibility_criteria.age_limit || "");
      setOtherRequirements(program.eligibility_criteria.other_requirements);
      
      // Set curriculum
      setCoreModules(program.curriculum.core_modules);
      setElectiveModules(program.curriculum.elective_modules || []);
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
  
  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setQualifications([...qualifications, newQualification.trim()]);
      setNewQualification("");
    }
  };
  
  const handleRemoveQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };
  
  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setOtherRequirements([...otherRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };
  
  const handleRemoveRequirement = (index: number) => {
    setOtherRequirements(otherRequirements.filter((_, i) => i !== index));
  };
  
  const handleAddCoreModule = () => {
    if (newCoreModule.name.trim()) {
      setCoreModules([...coreModules, { ...newCoreModule }]);
      setNewCoreModule({ name: "", description: "", credits: undefined });
    }
  };
  
  const handleRemoveCoreModule = (index: number) => {
    setCoreModules(coreModules.filter((_, i) => i !== index));
  };
  
  const handleAddElectiveModule = () => {
    if (newElectiveModule.name.trim()) {
      setElectiveModules([...electiveModules, { ...newElectiveModule }]);
      setNewElectiveModule({ name: "", description: "", credits: undefined });
    }
  };
  
  const handleRemoveElectiveModule = (index: number) => {
    setElectiveModules(electiveModules.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!programTitle || !institution || !programOverview || !duration || !fees || !modeOfDelivery || !location || !applicationDetails) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (coreModules.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one core module",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const programData = {
        program_title: programTitle,
        institution,
        program_overview: programOverview,
        eligibility_criteria: {
          qualifications,
          experience: experience || undefined,
          age_limit: ageLimit || undefined,
          other_requirements: otherRequirements,
        },
        duration,
        fees: parseFloat(fees),
        curriculum: {
          core_modules: coreModules,
          elective_modules: electiveModules.length > 0 ? electiveModules : undefined,
        },
        mode_of_delivery: modeOfDelivery,
        application_details: applicationDetails,
        location,
        additional_notes: additionalNotes || undefined,
      };
      
      if (isEditing) {
        await api.put(`/api/programs/${id}`, programData);
        toast({
          title: "Success",
          description: "Program updated successfully",
        });
      } else {
        await api.post("/api/programs", programData);
        toast({
          title: "Success",
          description: "Program created successfully",
        });
      }
      
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update program" : "Failed to create program",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
          
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Program" : "Add New Program"}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of the program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="programTitle">Program Title *</Label>
                        <Input
                          id="programTitle"
                          value={programTitle}
                          onChange={(e) => setProgramTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution *</Label>
                        <Input
                          id="institution"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="programOverview">Program Overview *</Label>
                      <Textarea
                        id="programOverview"
                        value={programOverview}
                        onChange={(e) => setProgramOverview(e.target.value)}
                        required
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration *</Label>
                        <Input
                          id="duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          required
                          placeholder="e.g., 2 years"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fees">Fees ($) *</Label>
                        <Input
                          id="fees"
                          type="number"
                          value={fees}
                          onChange={(e) => setFees(e.target.value)}
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="modeOfDelivery">Mode of Delivery *</Label>
                        <Input
                          id="modeOfDelivery"
                          value={modeOfDelivery}
                          onChange={(e) => setModeOfDelivery(e.target.value)}
                          required
                          placeholder="e.g., Full-time, Part-time, Online"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          placeholder="e.g., New York, Online"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="eligibility">
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                  <CardDescription>
                    Define the eligibility requirements for the program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Qualifications *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newQualification}
                          onChange={(e) => setNewQualification(e.target.value)}
                          placeholder="Add a qualification"
                        />
                        <Button type="button" onClick={handleAddQualification}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {qualifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No qualifications added yet</p>
                      ) : (
                        <ul className="space-y-2">
                          {qualifications.map((qualification, index) => (
                            <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <span>{qualification}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveQualification(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g., 2 years of relevant work experience"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ageLimit">Age Limit</Label>
                      <Input
                        id="ageLimit"
                        value={ageLimit}
                        onChange={(e) => setAgeLimit(e.target.value)}
                        placeholder="e.g., 18-25 years"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Other Requirements</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          placeholder="Add a requirement"
                        />
                        <Button type="button" onClick={handleAddRequirement}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {otherRequirements.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No other requirements added yet</p>
                      ) : (
                        <ul className="space-y-2">
                          {otherRequirements.map((requirement, index) => (
                            <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <span>{requirement}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveRequirement(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                  <CardDescription>
                    Define the core and elective modules of the program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Core Modules *</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="coreModuleName">Module Name</Label>
                          <Input
                            id="coreModuleName"
                            value={newCoreModule.name}
                            onChange={(e) => setNewCoreModule({ ...newCoreModule, name: e.target.value })}
                            placeholder="Module name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="coreModuleDescription">Description</Label>
                          <Input
                            id="coreModuleDescription"
                            value={newCoreModule.description}
                            onChange={(e) => setNewCoreModule({ ...newCoreModule, description: e.target.value })}
                            placeholder="Module description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="coreModuleCredits">Credits</Label>
                          <Input
                            id="coreModuleCredits"
                            type="number"
                            value={newCoreModule.credits || ""}
                            onChange={(e) => setNewCoreModule({ ...newCoreModule, credits: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="Number of credits"
                            min="0"
                          />
                        </div>
                      </div>
                      <Button type="button" onClick={handleAddCoreModule}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Core Module
                      </Button>
                      
                      {coreModules.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No core modules added yet</p>
                      ) : (
                        <div className="space-y-4 mt-4">
                          {coreModules.map((module, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{module.name}</h4>
                                  {module.description && (
                                    <p className="text-muted-foreground mt-1">{module.description}</p>
                                  )}
                                  {module.credits && (
                                    <p className="text-sm text-muted-foreground mt-1">Credits: {module.credits}</p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveCoreModule(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Elective Modules</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="electiveModuleName">Module Name</Label>
                          <Input
                            id="electiveModuleName"
                            value={newElectiveModule.name}
                            onChange={(e) => setNewElectiveModule({ ...newElectiveModule, name: e.target.value })}
                            placeholder="Module name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="electiveModuleDescription">Description</Label>
                          <Input
                            id="electiveModuleDescription"
                            value={newElectiveModule.description}
                            onChange={(e) => setNewElectiveModule({ ...newElectiveModule, description: e.target.value })}
                            placeholder="Module description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="electiveModuleCredits">Credits</Label>
                          <Input
                            id="electiveModuleCredits"
                            type="number"
                            value={newElectiveModule.credits || ""}
                            onChange={(e) => setNewElectiveModule({ ...newElectiveModule, credits: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="Number of credits"
                            min="0"
                          />
                        </div>
                      </div>
                      <Button type="button" onClick={handleAddElectiveModule}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Elective Module
                      </Button>
                      
                      {electiveModules.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No elective modules added yet</p>
                      ) : (
                        <div className="space-y-4 mt-4">
                          {electiveModules.map((module, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{module.name}</h4>
                                  {module.description && (
                                    <p className="text-muted-foreground mt-1">{module.description}</p>
                                  )}
                                  {module.credits && (
                                    <p className="text-sm text-muted-foreground mt-1">Credits: {module.credits}</p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveElectiveModule(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="application">
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                  <CardDescription>
                    Provide information about the application process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="applicationDetails">Application Process *</Label>
                      <Textarea
                        id="applicationDetails"
                        value={applicationDetails}
                        onChange={(e) => setApplicationDetails(e.target.value)}
                        required
                        rows={6}
                        placeholder="Describe the application process, required documents, deadlines, etc."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-8">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Update Program" : "Create Program"}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default ProgramForm; 