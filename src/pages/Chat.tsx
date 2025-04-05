import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { api } from "@/services/auth";
import StudentOnboardingForm from "@/components/StudentOnboardingForm";
import { Label } from "@/components/ui/label";

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
  academic_background?: string;
  preferences?: string;
  conversation_history?: Message[];
  field_of_study?: string;
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

  const handleEmailConfirmation = () => {
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

  if (initializing) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="text-center">Initializing chat...</div>
        </div>
      </PageLayout>
    );
  }

  if (showEmailConfirmation && storedStudentData) {
    return (
      <PageLayout>
        <div className="container py-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
              <p className="mb-4">
                We found a previous session for {maskEmail(storedStudentData.email)}.
                Please confirm your email to continue your conversation.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailConfirmation}
                    onChange={(e) => setEmailConfirmation(e.target.value)}
                    placeholder="Enter your full email address"
                    className={emailConfirmationError ? "border-red-500" : ""}
                  />
                  {emailConfirmationError && (
                    <p className="text-red-500 text-sm mt-1">{emailConfirmationError}</p>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleEmailConfirmation}
                    className="flex-1"
                  >
                    Continue Session
                  </Button>
                  <Button 
                    onClick={startNewChat}
                    variant="outline"
                    className="flex-1"
                  >
                    Start New Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (showOnboarding) {
    return (
      <PageLayout>
        <div className="container py-8">
          <StudentOnboardingForm onComplete={handleOnboardingComplete} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <Card className="h-[calc(100vh-12rem)]">
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
    </PageLayout>
  );
};

export default Chat;
