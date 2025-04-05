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
        // Get existing student profile
        const response = await api.get(`/api/students/${storedStudentId}`);
        setStudent(response.data);
        if (response.data.conversation_history) {
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
        // Show onboarding form for new students
        setShowOnboarding(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize chat. Please try again.",
        variant: "destructive",
      });
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
          content: `Hello ${response.data.name}! I'm your AI counselor. I can help you explore academic programs and make informed decisions about your education. I see you're interested in ${response.data.preferences}. Would you like to explore some programs in this area?`,
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
      // First, analyze the student input for profile enhancement
      await api.post(`/api/students/${student.id}/analyze`, {
        text: userMessage.content,
      });

      // Then, send the message to get AI response
      const response = await api.post(`/api/students/${student.id}/chat`, {
        message: userMessage.content,
      });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If the AI suggests getting recommendations, fetch them
      if (response.data.should_get_recommendations) {
        const recommendationsResponse = await api.get(`/api/students/${student.id}/recommendations`);
        if (recommendationsResponse.data.recommendations?.length > 0) {
          const recommendationsMessage = {
            id: (Date.now() + 2).toString(),
            role: "assistant" as const,
            content: "Based on our conversation, here are some program recommendations for you:\n\n" +
              recommendationsResponse.data.recommendations
                .map((rec: any) => `• ${rec.program_title} at ${rec.institution}`)
                .join("\n"),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, recommendationsMessage]);
        }
      }
    } catch (error) {
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
                {messages.map((message) => (
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
