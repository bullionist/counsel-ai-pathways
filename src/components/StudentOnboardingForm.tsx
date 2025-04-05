import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentOnboardingFormProps {
  onComplete: (studentId: string) => void;
}

interface ExamScore {
  exam_name: string;
  score: string;
  date_taken: string;
  validity_period: number;
}

const StudentOnboardingForm = ({ onComplete }: StudentOnboardingFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentEducation, setCurrentEducation] = useState("");
  const [subjects, setSubjects] = useState("");
  const [grades, setGrades] = useState("");
  const [institution, setInstitution] = useState("");
  const [yearOfCompletion, setYearOfCompletion] = useState("");
  const [achievements, setAchievements] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
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

  const populateSampleData = () => {
    setName("John Doe");
    setEmail("john.doe@example.com");
    setCurrentEducation("Bachelor's Degree");
    setSubjects("Computer Science, Mathematics, Physics");
    setGrades("3.8 GPA");
    setInstitution("University of Example");
    setYearOfCompletion("2023");
    setAchievements("Dean's List, Best Project Award, Hackathon Winner");
    setPreferredLocation("New York");
    setFieldOfStudy("Computer Science");
    
    // Add sample exam scores with proper ISO format
    const greDate = new Date(2024, 1, 29); // February 29, 2024
    greDate.setUTCHours(16, 0, 0, 0);
    
    setExamScores([
      {
        exam_name: "GRE",
        score: "320",
        date_taken: greDate.toISOString(),
        validity_period: 24
      }
    ]);
    
    setStudyMode("full-time");
    setBudgetRange("30000-50000");
    setDurationPreference("long-term");
    
    // Set start date in ISO format
    const startDateObj = new Date(2024, 7, 31); // August 31, 2024
    startDateObj.setUTCHours(0, 0, 0, 0);
    setStartDate(startDateObj.toISOString().split('T')[0]); // Still use YYYY-MM-DD for the input field
    
    setSpecialRequirements("Evening classes, Online options");
    setCareerGoals("Software Development, AI Research");
    
    toast({
      title: "Sample Data Loaded",
      description: "All form fields have been populated with sample data for testing.",
    });
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
    if (!name || !currentEducation || !subjects || !grades || !preferredLocation || !fieldOfStudy) {
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
        preferred_location: preferredLocation,
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
      
      // Log the payload for debugging
      console.log("=== API REQUEST DEBUG ===");
      console.log("Request URL:", "/api/students");
      console.log("Request Method:", "POST");
      console.log("Request Headers:", {
        "Content-Type": "application/json",
        "Authorization": "Bearer [REDACTED]"
      });
      console.log("Request Payload:", JSON.stringify(cleanPayload, null, 2));
      
      // Log each date field separately for debugging
      console.log("=== DATE FIELDS DEBUG ===");
      if (cleanPayload.exam_scores) {
        cleanPayload.exam_scores.forEach((score, index) => {
          console.log(`Exam ${index + 1} date_taken:`, score.date_taken);
        });
      }
      if (cleanPayload.additional_preferences?.start_date_preference) {
        console.log("Start date preference:", cleanPayload.additional_preferences.start_date_preference);
      }
      
      const response = await api.post("/api/students", cleanPayload);
      
      // Log the response for debugging
      console.log("=== API RESPONSE DEBUG ===");
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));

      localStorage.setItem("studentId", response.data.id);
      
      toast({
        title: "Success",
        description: "Profile created successfully!",
      });

      onComplete(response.data.id);
    } catch (error: any) {
      // Log the error for debugging
      console.error("=== API ERROR DEBUG ===");
      console.error("Error Status:", error.response?.status);
      console.error("Error Headers:", error.response?.headers);
      console.error("Error Data:", error.response?.data);
      console.error("Error Message:", error.message);
      console.error("Full Error:", error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Welcome to CounselAI</CardTitle>
        <CardDescription>
          Please tell us about yourself so we can provide better guidance
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
                <Label htmlFor="email">Email Address</Label>
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
                  placeholder="e.g., Bachelor's Degree"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Name of your institution"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects (comma-separated) *</Label>
                <Input
                  id="subjects"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="e.g., Computer Science, Mathematics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grades">Grades *</Label>
                <Input
                  id="grades"
                  value={grades}
                  onChange={(e) => setGrades(e.target.value)}
                  placeholder="Your grades or GPA"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearOfCompletion">Year of Completion</Label>
                <Input
                  id="yearOfCompletion"
                  type="number"
                  value={yearOfCompletion}
                  onChange={(e) => setYearOfCompletion(e.target.value)}
                  placeholder="Expected completion year"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements (comma-separated)</Label>
                <Input
                  id="achievements"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="List your achievements"
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
                <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                <Input
                  id="fieldOfStudy"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="Your desired field of study"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredLocation">Preferred Location</Label>
                <Input
                  id="preferredLocation"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="Where would you like to study?"
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
            {loading ? "Creating Profile..." : "Start Chat"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentOnboardingForm; 