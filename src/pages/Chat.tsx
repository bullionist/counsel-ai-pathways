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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeStudent();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeStudent = async () => {
    try {
      // Try to get existing student ID from local storage
      const storedStudentId = localStorage.getItem("studentId");
      
      if (storedStudentId) {
        try {
          // Get existing student profile
          const response = await api.get(`/api/students/${storedStudentId}`);
          
          // Check if the response contains valid student data
          if (response.data && response.data.id) {
            setStudent(response.data);
            if (response.data.conversation_history && Array.isArray(response.data.conversation_history)) {
              setMessages(response.data.conversation_history);
            } else {
              // Add welcome message for existing students without conversation history
              setMessages([
                {
                  id: "welcome",
                  role: "assistant",
                  content: "Welcome back! How can I help you today?",
                  timestamp: new Date(),
                },
              ]);
            }
          } else {
            // If student data is invalid or missing, show onboarding form
            console.log("Student data is invalid or missing, showing onboarding form");
            localStorage.removeItem("studentId"); // Clear invalid student ID
            setShowOnboarding(true);
          }
        } catch (error) {
          // If API call fails, show onboarding form
          console.error("Error fetching student profile:", error);
          localStorage.removeItem("studentId"); // Clear invalid student ID
          setShowOnboarding(true);
        }
      } else {
        // Show onboarding form for new students
        setShowOnboarding(true);
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
    } finally {
      setInitializing(false);
    }
  };

  const handleOnboardingComplete = async (studentId: string) => {
    try {
      const response = await api.get(`/api/students/${studentId}`);
      setStudent(response.data);
      setShowOnboarding(false);
      
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
            <ScrollArea className="flex-1 pr-4">
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
