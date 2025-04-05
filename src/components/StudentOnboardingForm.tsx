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
import { X } from "lucide-react";

interface StudentOnboardingFormProps {
  onComplete: (studentId: string) => void;
  initialData?: any;
  isEditing?: boolean;
}

interface ExamScore {
  exam_name: string;
  score: string;
  date_taken: string;
  validity_period: number;
}

// List of countries for location selection
const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", 
  "France", "Japan", "Singapore", "India", "China", "Brazil", "Mexico", 
  "South Korea", "Netherlands", "Sweden", "Switzerland", "Italy", 
  "Spain", "New Zealand", "Ireland"
];

const StudentOnboardingForm = ({ onComplete, initialData, isEditing = false }: StudentOnboardingFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentEducation, setCurrentEducation] = useState("");
  const [subjects, setSubjects] = useState("");
  const [grades, setGrades] = useState("");
  const [institution, setInstitution] = useState("");
  const [yearOfCompletion, setYearOfCompletion] = useState("");
  const [achievements, setAchievements] = useState("");
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [examScores, setExamScores] = useState<ExamScore[]>([]);
  const [examName, setExamName] = useState("");
  const [examScore, setExamScore] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examValidity, setExamValidity] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [durationPreference, setDurationPreference] = useState("");
  const [startDate, setStartDate] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setCurrentEducation(initialData.academic_background?.current_education || "");
      setSubjects(initialData.academic_background?.subjects?.join(", ") || "");
      setGrades(initialData.academic_background?.grades || "");
      setInstitution(initialData.academic_background?.institution || "");
      setYearOfCompletion(initialData.academic_background?.year_of_completion?.toString() || "");
      setAchievements(initialData.academic_background?.achievements?.join(", ") || "");
      setPreferredLocations(initialData.preferred_location || []);
      setFieldOfStudy(initialData.field_of_study || "");
      setExamScores(initialData.exam_scores || []);
      setStudyMode(initialData.additional_preferences?.study_mode || "");
      setBudgetRange(initialData.additional_preferences?.budget_range || "");
      setDurationPreference(initialData.additional_preferences?.duration_preference || "");
      setStartDate(initialData.additional_preferences?.start_date_preference?.split("T")[0] || "");
      setSpecialRequirements(initialData.additional_preferences?.special_requirements?.join(", ") || "");
      setCareerGoals(initialData.additional_preferences?.career_goals?.join(", ") || "");
    }
  }, [initialData]);

  const populateSampleData = () => {
    setName("John Doe");
    setEmail("john.doe@example.com");
    setCurrentEducation("High School");
    setSubjects("Mathematics, Physics, Chemistry");
    setGrades("A");
    setInstitution("Central High School");
    setYearOfCompletion("2023");
    setAchievements("Science Olympiad Winner, Math Competition Finalist");
    setPreferredLocations(["United States", "Canada", "United Kingdom"]);
    setFieldOfStudy("Computer Science");
    
    // Add sample exam scores with proper ISO format
    const satDate = new Date(2023, 4, 15); // May 15, 2023
    satDate.setUTCHours(12, 0, 0, 0);
    
    const apDate = new Date(2023, 5, 10); // June 10, 2023
    apDate.setUTCHours(12, 0, 0, 0);
    
    setExamScores([
      {
        exam_name: "SAT",
        score: "1450",
        date_taken: satDate.toISOString(),
        validity_period: 24
      },
      {
        exam_name: "AP Computer Science",
        score: "5",
        date_taken: apDate.toISOString(),
        validity_period: 24
      }
    ]);
    
    setStudyMode("hybrid");
    setBudgetRange("30000-50000");
    setDurationPreference("4-year");
    
    // Set start date in ISO format
    const startDateObj = new Date(2024, 8, 1); // September 1, 2024
    startDateObj.setUTCHours(12, 0, 0, 0);
    setStartDate(startDateObj.toISOString().split('T')[0]); // Still use YYYY-MM-DD for the input field
    
    setSpecialRequirements("Scholarship opportunities, Internship programs");
    setCareerGoals("Software Development, AI Research");
    
    toast({
      title: "Sample Data Loaded",
      description: "All form fields have been populated with sample data for testing.",
    });
  };

  const handleAddLocation = () => {
    if (selectedLocation && !preferredLocations.includes(selectedLocation)) {
      setPreferredLocations([...preferredLocations, selectedLocation]);
      setSelectedLocation("");
    }
  };

  const handleRemoveLocation = (location: string) => {
    setPreferredLocations(preferredLocations.filter(loc => loc !== location));
  };

  const handleAddExam = () => {
    if (examName && examScore && examDate && examValidity) {
      // Convert date to ISO 8601 format with UTC timezone
      const isoDate = new Date(examDate);
      // Set to noon UTC to avoid timezone issues
      isoDate.setUTCHours(12, 0, 0, 0);
      
      setExamScores([...examScores, {
        exam_name: examName,
        score: examScore,
        date_taken: isoDate.toISOString(), // Store as ISO string with UTC timezone
        validity_period: parseInt(examValidity)
      }]);
      setExamName("");
      setExamScore("");
      setExamDate("");
      setExamValidity("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !currentEducation || !subjects || !grades || preferredLocations.length === 0 || !fieldOfStudy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Format dates to ISO 8601 format with UTC timezone
      const formatDateToISO = (dateString: string) => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        // Set to noon UTC to avoid timezone issues
        date.setUTCHours(12, 0, 0, 0);
        return date.toISOString();
      };
      
      // Create the payload with all dates properly formatted
      const payload = {
        name,
        email: email || undefined,
        academic_background: {
          current_education: currentEducation,
          subjects: subjects.split(",").map(s => s.trim()).filter(s => s),
          grades,
          institution: institution || undefined,
          year_of_completion: yearOfCompletion ? parseInt(yearOfCompletion) : undefined,
          achievements: achievements ? achievements.split(",").map(a => a.trim()).filter(a => a) : undefined
        },
        preferred_location: preferredLocations,
        field_of_study: fieldOfStudy,
        exam_scores: examScores.length > 0 ? examScores.map(score => ({
          exam_name: score.exam_name,
          score: score.score,
          date_taken: formatDateToISO(score.date_taken),
          validity_period: score.validity_period
        })) : undefined,
        additional_preferences: {
          study_mode: studyMode || undefined,
          budget_range: budgetRange || undefined,
          duration_preference: durationPreference || undefined,
          start_date_preference: startDate ? formatDateToISO(startDate) : undefined,
          special_requirements: specialRequirements ? specialRequirements.split(",").map(r => r.trim()).filter(r => r) : undefined,
          career_goals: careerGoals ? careerGoals.split(",").map(g => g.trim()).filter(g => g) : undefined,
          preferred_languages: [] // Empty array as default
        }
      };
      
      // Remove any undefined values
      const cleanPayload = JSON.parse(JSON.stringify(payload));
      
      if (isEditing) {
        onComplete(cleanPayload);
      } else {
        const response = await api.post("/api/students", cleanPayload);
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Profile" : "Welcome to CounselAI"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update your profile information" : "Please tell us about yourself so we can provide better guidance"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-end mb-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={populateSampleData}
              className="text-xs"
            >
              Populate Sample Data
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Academic Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentEducation">Current Education *</Label>
                <Input
                  id="currentEducation"
                  value={currentEducation}
                  onChange={(e) => setCurrentEducation(e.target.value)}
                  placeholder="e.g., High School, Bachelor's Degree"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects *</Label>
                <Input
                  id="subjects"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grades">Grades *</Label>
                <Input
                  id="grades"
                  value={grades}
                  onChange={(e) => setGrades(e.target.value)}
                  placeholder="e.g., 3.8 GPA, 90%"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g., University of Example"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearOfCompletion">Year of Completion</Label>
                <Input
                  id="yearOfCompletion"
                  value={yearOfCompletion}
                  onChange={(e) => setYearOfCompletion(e.target.value)}
                  placeholder="e.g., 2023"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements</Label>
                <Input
                  id="achievements"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="e.g., Dean's List, Best Project Award"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Exam Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name</Label>
                <Input
                  id="examName"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g., GRE, GMAT"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examScore">Score</Label>
                <Input
                  id="examScore"
                  value={examScore}
                  onChange={(e) => setExamScore(e.target.value)}
                  placeholder="Your score"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examDate">Date Taken</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examValidity">Validity (months)</Label>
                <Input
                  id="examValidity"
                  type="number"
                  value={examValidity}
                  onChange={(e) => setExamValidity(e.target.value)}
                  placeholder="Validity period in months"
                />
              </div>
            </div>
            <Button type="button" variant="outline" onClick={handleAddExam}>
              Add Exam Score
            </Button>
            {examScores.length > 0 && (
              <div className="mt-2">
                <Label>Added Exam Scores:</Label>
                <ul className="mt-1 space-y-1">
                  {examScores.map((exam, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {exam.exam_name}: {exam.score} (Taken: {new Date(exam.date_taken).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredLocation">Preferred Locations *</Label>
                <div className="flex gap-2">
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a country" />
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
                    variant="outline" 
                    onClick={handleAddLocation}
                    disabled={!selectedLocation}
                  >
                    Add
                  </Button>
                </div>
                {preferredLocations.length === 0 && (
                  <p className="text-sm text-red-500">Please select at least one location</p>
                )}
                {preferredLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferredLocations.map((location) => (
                      <Badge key={location} variant="secondary" className="flex items-center gap-1">
                        {location}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveLocation(location)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                <Input
                  id="fieldOfStudy"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g., Computer Science, Business"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studyMode">Study Mode</Label>
                <Select value={studyMode} onValueChange={setStudyMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select study mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Budget Range</Label>
                <Input
                  id="budgetRange"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  placeholder="Your budget range"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationPreference">Preferred Duration</Label>
                <Input
                  id="durationPreference"
                  value={durationPreference}
                  onChange={(e) => setDurationPreference(e.target.value)}
                  placeholder="e.g., 2 years, 4 years"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Preferred Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements (comma-separated)</Label>
              <Textarea
                id="specialRequirements"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Any special requirements or accommodations needed"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="careerGoals">Career Goals (comma-separated)</Label>
              <Textarea
                id="careerGoals"
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="What are your career goals?"
                rows={2}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving Profile..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentOnboardingForm; 