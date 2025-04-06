import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, X, FileText } from "lucide-react";
import { api } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [location, setLocation] = useState("");
  const [programType, setProgramType] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  
  // Curriculum
  const [curriculumDescription, setCurriculumDescription] = useState("");
  const [modules, setModules] = useState<string[]>([]);
  const [newModule, setNewModule] = useState("");
  
  // Requirements
  const [academicRequirements, setAcademicRequirements] = useState<string[]>([]);
  const [newAcademicRequirement, setNewAcademicRequirement] = useState("");
  const [otherRequirements, setOtherRequirements] = useState<string[]>([]);
  const [newOtherRequirement, setNewOtherRequirement] = useState("");
  
  // Add this constant for the list of countries
  const popularCountries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "New Zealand",
    "Singapore",
    "Ireland",
    "Netherlands",
    "Japan"
  ];

  const popularFieldsOfStudy = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Data Science",
    "Medicine",
    "Law",
    "Psychology",
    "Environmental Science",
    "International Relations",
    "Architecture"
  ];
  
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
      setLocation(program.location);
      setProgramType(program.program_type);
      setFieldOfStudy(program.field_of_study);
      setBudget(program.budget.toString());
      setDuration(program.duration);
      
      // Set curriculum
      setCurriculumDescription(program.curriculum.description);
      setModules(program.curriculum.modules);
      
      // Set requirements
      setAcademicRequirements(program.requirements.academic_requirements);
      setOtherRequirements(program.requirements.other_requirements);
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
  
  const handleAddModule = () => {
    if (newModule.trim()) {
      setModules([...modules, newModule.trim()]);
      setNewModule("");
    }
  };
  
  const handleRemoveModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };
  
  const handleAddAcademicRequirement = () => {
    if (newAcademicRequirement.trim()) {
      setAcademicRequirements([...academicRequirements, newAcademicRequirement.trim()]);
      setNewAcademicRequirement("");
    }
  };
  
  const handleRemoveAcademicRequirement = (index: number) => {
    setAcademicRequirements(academicRequirements.filter((_, i) => i !== index));
  };
  
  const handleAddOtherRequirement = () => {
    if (newOtherRequirement.trim()) {
      setOtherRequirements([...otherRequirements, newOtherRequirement.trim()]);
      setNewOtherRequirement("");
    }
  };
  
  const handleRemoveOtherRequirement = (index: number) => {
    setOtherRequirements(otherRequirements.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!programTitle || !institution || !programOverview || !location || !programType || !fieldOfStudy || !budget || !duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (modules.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one module",
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
        location,
        program_type: programType,
        field_of_study: fieldOfStudy,
        budget: parseInt(budget),
        duration,
        curriculum: {
          description: curriculumDescription,
          modules
        },
        requirements: {
          academic_requirements: academicRequirements,
          other_requirements: otherRequirements
        }
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
  
  const populateSampleData = () => {
    setProgramTitle("Master of Science in Computer Science");
    setInstitution("University of California, Berkeley");
    setProgramOverview("A comprehensive program designed to prepare students for advanced careers in computer science. The curriculum covers theoretical foundations and practical applications in areas such as artificial intelligence, machine learning, and software engineering.");
    setLocation("United States");
    setProgramType("postgraduate");
    setFieldOfStudy("Computer Science");
    setBudget("45000");
    setDuration("2 years");
    setCurriculumDescription("The curriculum provides a strong foundation in computer science fundamentals while allowing students to specialize in areas of interest.");
    setModules([
      "Advanced Algorithms",
      "Machine Learning",
      "Distributed Systems",
      "Software Engineering",
      "Database Systems",
      "Computer Networks"
    ]);
    setAcademicRequirements([
      "Bachelor's degree in Computer Science or related field",
      "Minimum GPA of 3.0",
      "GRE scores (optional for 2024-2025)",
      "Programming proficiency in at least one language"
    ]);
    setOtherRequirements([
      "Statement of Purpose",
      "Letters of Recommendation",
      "Resume/CV",
      "English proficiency (TOEFL/IELTS)"
    ]);
    
    toast({
      title: "Sample Data Loaded",
      description: "Form has been populated with sample program data",
    });
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
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Program" : "Create Program"}
          </h1>
        </div>
        
        {!isEditing && (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={populateSampleData}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Populate Sample Data
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the basic information about the program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="programTitle">Program Title *</Label>
                  <Input
                    id="programTitle"
                    value={programTitle}
                    onChange={(e) => setProgramTitle(e.target.value)}
                    required
                    placeholder="Enter program title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    placeholder="Enter institution name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={location}
                    onValueChange={setLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularCountries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programType">Program Type *</Label>
                  <Select
                    value={programType}
                    onValueChange={setProgramType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                  <Select
                    value={fieldOfStudy}
                    onValueChange={setFieldOfStudy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field of study" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularFieldsOfStudy.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                    placeholder="Enter program budget"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    placeholder="e.g., 4 years, 2 semesters"
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
                  placeholder="Enter program overview"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Curriculum</CardTitle>
              <CardDescription>
                Define the program's curriculum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="curriculumDescription">Curriculum Description</Label>
                <Textarea
                  id="curriculumDescription"
                  value={curriculumDescription}
                  onChange={(e) => setCurriculumDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter curriculum description"
                />
              </div>
              <div className="space-y-2">
                <Label>Modules</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {modules.map((module, index) => (
                    <Badge key={index} variant="secondary">
                      {module}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemoveModule(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    placeholder="Enter module name"
                  />
                  <Button
                    type="button"
                    onClick={handleAddModule}
                    disabled={!newModule.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>
                Specify program requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Academic Requirements</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {academicRequirements.map((requirement, index) => (
                    <Badge key={index} variant="secondary">
                      {requirement}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemoveAcademicRequirement(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newAcademicRequirement}
                    onChange={(e) => setNewAcademicRequirement(e.target.value)}
                    placeholder="Enter academic requirement"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAcademicRequirement}
                    disabled={!newAcademicRequirement.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Other Requirements</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {otherRequirements.map((requirement, index) => (
                    <Badge key={index} variant="secondary">
                      {requirement}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemoveOtherRequirement(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newOtherRequirement}
                    onChange={(e) => setNewOtherRequirement(e.target.value)}
                    placeholder="Enter other requirement"
                  />
                  <Button
                    type="button"
                    onClick={handleAddOtherRequirement}
                    disabled={!newOtherRequirement.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
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