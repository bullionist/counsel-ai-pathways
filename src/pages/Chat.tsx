import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, GraduationCap, MapPin, BookOpen, Calendar, Award, Briefcase, DollarSign, Clock, Languages, Mail, Pencil, X, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { api } from "@/services/auth";
import StudentOnboardingForm from "@/components/StudentOnboardingForm";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Student {
  id: string;
  name?: string;
  email?: string;
  academic_background?: {
    current_education?: string;
    subjects?: string[];
    grades?: string;
    institution?: string;
    year_of_completion?: number;
    achievements?: string[];
  };
  preferred_location?: string[];
  field_of_study?: string;
  exam_scores?: Array<{
    exam_name: string;
    score: string;
    date_taken: string;
    validity_period: number;
  }>;
  additional_preferences?: {
    study_mode?: string;
    budget_range?: string;
    duration_preference?: string;
    start_date_preference?: string;
    special_requirements?: string[];
    career_goals?: string[];
    preferred_languages?: string[];
  };
  conversation_history?: {
    messages?: Array<{
      id: string;
      role: string;
      content: string;
      timestamp: string;
    }>;
  };
}

interface ConversationResponse {
  success: boolean;
  type: 'profile_update' | 'chat';
  message: string;
  extracted_data?: {
    academic_background?: {
      current_education: string;
      subjects: string[];
      grades: string;
      institution?: string;
      year_of_completion?: number;
      achievements?: string[];
    };
    preferred_location?: string;
    field_of_study?: string;
    exam_scores?: Array<{
      exam_name: string;
      score: string;
      date_taken?: string;
    }>;
    additional_preferences?: {
      study_mode?: string;
      budget_range?: string;
      duration_preference?: string;
      start_date_preference?: string;
      career_goals?: string[];
    };
  };
  response?: string;
  error?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [emailConfirmationError, setEmailConfirmationError] = useState("");
  const [storedStudentData, setStoredStudentData] = useState<{id: string, email: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  useEffect(() => {
    initializeStudent();
  }, []);

  // Add auto-scroll effect when messages change
  useEffect(() => {
    // Use setTimeout to ensure the DOM has updated before scrolling
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  }, [messages]);

  const initializeStudent = async () => {
    try {
      // Try to get existing student ID from local storage
      const storedStudentId = localStorage.getItem("studentId");
      console.log("Stored student ID:", storedStudentId);
      
      if (storedStudentId) {
        try {
          // Get existing student profile
          console.log("Fetching student profile for ID:", storedStudentId);
          const response = await api.get(`/api/students/${storedStudentId}`);
          console.log("API Response:", response);
          
          // Check if the response contains valid student data
          if (response.data && response.data.id) {
            console.log("Valid student data received:", response.data);
            
            // Store the student data and show email confirmation
            setStoredStudentData({
              id: response.data.id,
              email: response.data.email || ""
            });
            setShowEmailConfirmation(true);
            setInitializing(false);
          } else {
            // If student data is invalid or missing, show onboarding form
            console.log("Student data is invalid or missing:", response.data);
            localStorage.removeItem("studentId"); // Clear invalid student ID
            setShowOnboarding(true);
            setInitializing(false);
          }
        } catch (error) {
          // If API call fails, show onboarding form
          console.error("Error fetching student profile:", error);
          localStorage.removeItem("studentId"); // Clear invalid student ID
          setShowOnboarding(true);
          setInitializing(false);
        }
      } else {
        // Show onboarding form for new students
        console.log("No stored student ID found, showing onboarding form");
        setShowOnboarding(true);
        setInitializing(false);
      }
    } catch (error) {
      console.error("Error in initialization:", error);
      toast({
        title: "Error",
        description: "Failed to initialize chat. Please try again.",
        variant: "destructive",
      });
      // Show onboarding form on initialization error
      setShowOnboarding(true);
      setInitializing(false);
    }
  };

  const handleEmailConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storedStudentData) return;
    
    // Check if the entered email matches the stored email
    if (emailConfirmation.toLowerCase() === storedStudentData.email.toLowerCase()) {
      // Email matches, proceed to load the student profile
      loadStudentProfile(storedStudentData.id);
    } else {
      // Email doesn't match, show error
      setEmailConfirmationError("Email doesn't match. Please try again or start a new chat.");
    }
  };

  const loadStudentProfile = async (studentId: string) => {
    try {
      const response = await api.get(`/api/students/${studentId}`);
      
      if (response.data && response.data.id) {
        setStudent(response.data);
        setShowEmailConfirmation(false);
        
        // Enhanced chat history loading - handle nested structure
        if (response.data.conversation_history && 
            response.data.conversation_history.messages && 
            Array.isArray(response.data.conversation_history.messages)) {
          
          console.log("Loading existing conversation history:", response.data.conversation_history.messages.length, "messages");
          
          // Ensure all messages have proper timestamps and IDs
          const formattedMessages = response.data.conversation_history.messages.map((msg, index) => ({
            id: msg.id || `msg-${index}`,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          }));
          
          setMessages(formattedMessages);
        } else {
          // Add welcome message for existing students without conversation history
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: `Welcome back ${response.data.name || 'there'}! How can I help you today?`,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error loading student profile:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startNewChat = () => {
    // Clear the stored student ID
    localStorage.removeItem("studentId");
    
    // Show the onboarding form
    setShowEmailConfirmation(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = async (studentId: string) => {
    try {
      const response = await api.get(`/api/students/${studentId}`);
      setStudent(response.data);
      setShowOnboarding(false);
      
      // Store the student ID in local storage
      localStorage.setItem("studentId", studentId);
      
      // Add welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello ${response.data.name}! I'm your AI counselor. I can help you explore academic programs and make informed decisions about your education. I see you're interested in ${response.data.field_of_study || 'your chosen field'}. Would you like to explore some programs in this area?`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load student profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      const response = await api.put(`/api/students/${student.id}/update`, updatedData);
      setStudent(response.data);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to mask email for display
  const maskEmail = (email: string) => {
    if (!email) return "";
    
    const [username, domain] = email.split('@');
    if (!domain) return email;
    
    const [domainName, extension] = domain.split('.');
    if (!extension) return email;
    
    // Mask username (keep first and last character)
    const maskedUsername = username.length > 2 
      ? username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
      : username;
    
    // Mask domain (keep first and last character)
    const maskedDomain = domainName.length > 2
      ? domainName.charAt(0) + '*'.repeat(domainName.length - 2) + domainName.charAt(domainName.length - 1)
      : domainName;
    
    // Mask extension (keep first and last character)
    const maskedExtension = extension.length > 2
      ? extension.charAt(0) + '*'.repeat(extension.length - 2) + extension.charAt(extension.length - 1)
      : extension;
    
    return `${maskedUsername}@${maskedDomain}.${maskedExtension}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !student) return;
    
    const userMessage = {
          id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Log the request details
      console.log("=== CONVERSATION API REQUEST DEBUG ===");
      console.log("Request URL:", `/api/students/${student.id}/conversation`);
      console.log("Request Method:", "POST");
      console.log("Request Payload:", {
        text: userMessage.content
      });
      console.log("Student ID:", student.id);
      
      // Use the new conversation API endpoint
      const response = await api.post(`/api/students/${student.id}/conversation`, {
        text: userMessage.content
      });

      // Log the successful response
      console.log("=== CONVERSATION API RESPONSE DEBUG ===");
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));

      const result = response.data as ConversationResponse;
      
      // Handle the response based on its type
      if (result.success) {
        // Add the AI's response to the chat
        if (result.response) {
          const assistantMessage = {
            id: (Date.now() + 1).toString(),
          role: "assistant" as const,
            content: result.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
        
        // If it's a profile update, we could update the student profile display
        // This would require additional state and UI components
        if (result.type === 'profile_update' && result.extracted_data) {
          console.log("Profile updated with:", result.extracted_data);
          // In a real implementation, you might want to update the student state
          // or show a notification that the profile was updated
          toast({
            title: "Profile Updated",
            description: "Your profile information has been updated based on our conversation.",
          });
        }
      } else {
        // Handle error response
        console.log("=== CONVERSATION API ERROR RESPONSE ===");
        console.log("Error Type:", result.type);
        console.log("Error Message:", result.message);
        console.log("Error Details:", result.error);
        
        toast({
          title: "Error",
          description: result.error || result.message || "Failed to process your message.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Enhanced error logging
      console.error("=== CONVERSATION API ERROR DEBUG ===");
      console.error("Error Status:", error.response?.status);
      console.error("Error Status Text:", error.response?.statusText);
      console.error("Error Headers:", error.response?.headers);
      console.error("Error Data:", error.response?.data);
      console.error("Error Message:", error.message);
      console.error("Error Config:", {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      });
      console.error("Full Error:", error);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <PageLayout>
      <div className="container py-8">
        {initializing ? (
          <div className="text-center">Loading...</div>
        ) : showOnboarding ? (
          <StudentOnboardingForm onComplete={handleOnboardingComplete} />
        ) : showEmailConfirmation ? (
          <div className="container py-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
                <p className="mb-4">
                  We found a previous session for {maskEmail(storedStudentData?.email)}.
                  Please confirm your email to continue your conversation.
                </p>
                <form onSubmit={handleEmailConfirmation} className="space-y-4">
                  <Input
                    type="email"
                    value={emailConfirmation}
                    onChange={(e) => setEmailConfirmation(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Confirming..." : "Confirm Email"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Top Bar with Profile Button */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">AI Counselor Chat</h1>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  setShowProfileDialog(true);
                  setIsEditing(false);
                }}
              >
                <User className="h-4 w-4" />
                <span>Student Profile</span>
              </Button>
            </div>
            
            {/* Chat Area - Full Width */}
            <Card className="flex-1 overflow-hidden">
              <CardContent className="p-6 h-full flex flex-col">
                <ScrollArea className="flex-1 pr-4 overflow-y-auto" ref={chatContainerRef}>
                  <div className="space-y-4">
                    {Array.isArray(messages) && messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "assistant" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.role === "assistant"
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Student Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Student Profile</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
                className="flex items-center gap-1 mr-[50px]"
              >
                {isEditing ? <Eye className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                <span>{isEditing ? "View" : "Edit"}</span>
              </Button>
            </div>
          </div>
          
          {isEditing ? (
            <StudentOnboardingForm 
              onComplete={handleProfileUpdate}
              initialData={student}
              isEditing={true}
            />
          ) : (
            <ScrollArea className="h-[calc(90vh-8rem)]">
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={student?.name || "Student"} />
                    <AvatarFallback>{getInitials(student?.name || "Student")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{student?.name || "Student"}</h3>
                    <p className="text-sm text-muted-foreground">{student?.email || "No email provided"}</p>
                  </div>
                </div>
                
                <Separator />

                {/* Academic Background */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Academic Background</h4>
                  </div>
                  <div className="space-y-2 pl-6">
                    {student?.academic_background ? (
                      <>
                        <div>
                          <p className="text-sm font-medium">Education</p>
                          <p className="text-sm text-muted-foreground">
                            {student.academic_background.current_education || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Subjects</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {student.academic_background.subjects && student.academic_background.subjects.length > 0 ? (
                              student.academic_background.subjects.map((subject, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {subject}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">Not specified</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Grades</p>
                          <p className="text-sm text-muted-foreground">
                            {student.academic_background.grades || "Not specified"}
                          </p>
                        </div>
                        {student.academic_background.institution && (
                          <div>
                            <p className="text-sm font-medium">Institution</p>
                            <p className="text-sm text-muted-foreground">
                              {student.academic_background.institution}
                            </p>
                          </div>
                        )}
                        {student.academic_background.year_of_completion && (
                          <div>
                            <p className="text-sm font-medium">Year of Completion</p>
                            <p className="text-sm text-muted-foreground">
                              {student.academic_background.year_of_completion}
                            </p>
                          </div>
                        )}
                        {student.academic_background.achievements && student.academic_background.achievements.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Achievements</p>
                            <ul className="text-sm text-muted-foreground list-disc pl-2 mt-1">
                              {student.academic_background.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No academic information available</p>
                    )}
                  </div>
                </div>
                
                <Separator />

                {/* Preferences */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Preferences</h4>
                  </div>
                  <div className="space-y-2 pl-6">
                    <div>
                      <p className="text-sm font-medium">Field of Study</p>
                      <p className="text-sm text-muted-foreground">
                        {student?.field_of_study || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Preferred Locations</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {student?.preferred_location && Array.isArray(student.preferred_location) && student.preferred_location.length > 0 ? (
                          student.preferred_location.map((location, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {location}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Not specified</p>
                        )}
                      </div>
                    </div>
                    {student?.additional_preferences && (
                      <>
                        {student.additional_preferences.study_mode && (
                          <div>
                            <p className="text-sm font-medium">Study Mode</p>
                            <p className="text-sm text-muted-foreground">
                              {student.additional_preferences.study_mode}
                            </p>
                          </div>
                        )}
                        {student.additional_preferences.budget_range && (
                          <div>
                            <p className="text-sm font-medium">Budget Range</p>
                            <p className="text-sm text-muted-foreground">
                              {student.additional_preferences.budget_range}
                            </p>
                          </div>
                        )}
                        {student.additional_preferences.duration_preference && (
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">
                              {student.additional_preferences.duration_preference}
                            </p>
                          </div>
                        )}
                        {student.additional_preferences.start_date_preference && (
                          <div>
                            <p className="text-sm font-medium">Start Date</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(student.additional_preferences.start_date_preference)}
                            </p>
                          </div>
                        )}
                        {student.additional_preferences.career_goals && student.additional_preferences.career_goals.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Career Goals</p>
                            <ul className="text-sm text-muted-foreground list-disc pl-2 mt-1">
                              {student.additional_preferences.career_goals.map((goal, index) => (
                                <li key={index}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Exam Scores */}
                {student?.exam_scores && student.exam_scores.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">Exam Scores</h4>
                      </div>
                      <div className="space-y-2 pl-6">
                        {student.exam_scores.map((exam, index) => (
                          <div key={index} className="border rounded-md p-2">
                            <p className="text-sm font-medium">{exam.exam_name}</p>
                            <p className="text-sm text-muted-foreground">Score: {exam.score}</p>
                            {exam.date_taken && (
                              <p className="text-xs text-muted-foreground">
                                Taken: {formatDate(exam.date_taken)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Chat;
