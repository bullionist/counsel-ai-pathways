import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, FileText } from "lucide-react";

interface EducationalQualification {
  qualification: string;
  grade: string;
  year_of_completion: number;
}

interface StudentOnboardingFormProps {
  onComplete: (studentId: string) => void;
  initialData?: any;
  isEditing?: boolean;
}

// List of countries for location selection
const countries = [
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

// List of fields of study
const fieldsOfStudy = [
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

const StudentOnboardingForm = ({ onComplete, initialData, isEditing = false }: StudentOnboardingFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Basic Information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Educational Qualifications
  const [educationalQualifications, setEducationalQualifications] = useState<EducationalQualification[]>([]);
  const [newQualification, setNewQualification] = useState<EducationalQualification>({
    qualification: "",
    grade: "",
    year_of_completion: new Date().getFullYear()
  });

  // Preferences
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [preferredProgram, setPreferredProgram] = useState("");
  const [preferredFieldsOfStudy, setPreferredFieldsOfStudy] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState("");
  const [budget, setBudget] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setEducationalQualifications(initialData.educational_qualifications || []);
      setPreferredLocations(initialData.preferred_location || []);
      setPreferredProgram(initialData.preferred_program || "");
      setPreferredFieldsOfStudy(initialData.preferred_field_of_study || []);
      setBudget(initialData.budget?.toString() || "");
      setSpecialRequirements(initialData.special_requirements || []);
    }
  }, [initialData]);

  const handleAddQualification = () => {
    if (newQualification.qualification && newQualification.grade) {
      setEducationalQualifications([...educationalQualifications, { ...newQualification }]);
      setNewQualification({
        qualification: "",
        grade: "",
        year_of_completion: new Date().getFullYear()
      });
    }
  };

  const handleRemoveQualification = (index: number) => {
    setEducationalQualifications(educationalQualifications.filter((_, i) => i !== index));
  };

  const handleAddLocation = () => {
    if (selectedLocation && !preferredLocations.includes(selectedLocation)) {
      setPreferredLocations([...preferredLocations, selectedLocation]);
      setSelectedLocation("");
    }
  };

  const handleRemoveLocation = (location: string) => {
    setPreferredLocations(preferredLocations.filter(l => l !== location));
  };

  const handleAddFieldOfStudy = () => {
    if (selectedField && !preferredFieldsOfStudy.includes(selectedField)) {
      setPreferredFieldsOfStudy([...preferredFieldsOfStudy, selectedField]);
      setSelectedField("");
    }
  };

  const handleRemoveFieldOfStudy = (field: string) => {
    setPreferredFieldsOfStudy(preferredFieldsOfStudy.filter(f => f !== field));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setSpecialRequirements([...specialRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (requirement: string) => {
    setSpecialRequirements(specialRequirements.filter(r => r !== requirement));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || educationalQualifications.length === 0 || !preferredProgram || !budget) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        educational_qualifications: educationalQualifications,
        preferred_location: preferredLocations,
        preferred_program: preferredProgram,
        preferred_field_of_study: preferredFieldsOfStudy,
        budget: parseInt(budget),
        special_requirements: specialRequirements.length > 0 ? specialRequirements : undefined
      };
      
      if (isEditing) {
        const response = await api.put(`/api/students/${initialData.id}`, payload);
        onComplete(response.data.id);
      } else {
        const response = await api.post("/api/students", payload);
        localStorage.setItem("studentId", response.data.id);
        onComplete(response.data.id);
      }
      
      toast({
        title: "Success",
        description: isEditing ? "Profile updated successfully!" : "Profile created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const populateSampleData = () => {
    // Basic Information
    setName("Rahul Sharma");
    setEmail("rahul.sharma@example.com");

    // Educational Qualifications
    setEducationalQualifications([
      {
        qualification: "Bachelor of Technology in Computer Science",
        grade: "8.5 CGPA",
        year_of_completion: 2023
      },
      {
        qualification: "Higher Secondary (12th)",
        grade: "92%",
        year_of_completion: 2019
      }
    ]);

    // Program Preferences
    setPreferredProgram("postgraduate");
    setPreferredLocations(["United States", "Canada", "United Kingdom"]);
    setPreferredFieldsOfStudy(["Computer Science", "Data Science"]);
    setBudget("50000");

    // Special Requirements
    setSpecialRequirements([
      "Work permit assistance",
      "On-campus housing preferred",
      "Research opportunities"
    ]);

    toast({
      title: "Sample Data Loaded",
      description: "Form has been populated with sample student data",
    });
  };

  return (
    <>
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
              Please provide your basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Educational Qualifications</CardTitle>
            <CardDescription>
              Add your educational qualifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {educationalQualifications.map((qualification, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <p className="font-medium">{qualification.qualification}</p>
                    <p className="text-sm text-muted-foreground">
                      Grade: {qualification.grade} | Year: {qualification.year_of_completion}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveQualification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  value={newQualification.qualification}
                  onChange={(e) => setNewQualification({
                    ...newQualification,
                    qualification: e.target.value
                  })}
                  placeholder="e.g., High School"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  value={newQualification.grade}
                  onChange={(e) => setNewQualification({
                    ...newQualification,
                    grade: e.target.value
                  })}
                  placeholder="e.g., A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year of Completion *</Label>
                <Input
                  id="year"
                  type="number"
                  value={newQualification.year_of_completion}
                  onChange={(e) => setNewQualification({
                    ...newQualification,
                    year_of_completion: parseInt(e.target.value)
                  })}
                  placeholder="e.g., 2023"
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={handleAddQualification}
              disabled={!newQualification.qualification || !newQualification.grade}
            >
              Add Qualification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Preferences</CardTitle>
            <CardDescription>
              Tell us about your program preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredProgramType">Preferred Program Type *</Label>
              <Select
                value={preferredProgram}
                onValueChange={setPreferredProgram}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preferred Locations</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {preferredLocations.map((location) => (
                  <Badge key={location} variant="secondary">
                    {location}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => handleRemoveLocation(location)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleAddLocation}
                  disabled={!selectedLocation}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Fields of Study</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {preferredFieldsOfStudy.map((field) => (
                  <Badge key={field} variant="secondary">
                    {field}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => handleRemoveFieldOfStudy(field)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedField}
                  onValueChange={setSelectedField}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select field of study" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldsOfStudy.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleAddFieldOfStudy}
                  disabled={!selectedField}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD) *</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                placeholder="Enter your budget in USD"
              />
            </div>

            <div className="space-y-2">
              <Label>Special Requirements</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {specialRequirements.map((requirement) => (
                  <Badge key={requirement} variant="secondary">
                    {requirement}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => handleRemoveRequirement(requirement)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Enter special requirement"
                />
                <Button
                  type="button"
                  onClick={handleAddRequirement}
                  disabled={!newRequirement.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default StudentOnboardingForm; 