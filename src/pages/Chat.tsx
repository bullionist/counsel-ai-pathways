import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, GraduationCap, MapPin, BookOpen, Calendar, Award, Briefcase, DollarSign, Clock, Languages, Mail, Pencil, X, Eye, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Add SpeechRecognition type definitions
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

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
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // Initialize speech recognition
  useEffect(() => {
    // We'll create a new instance when needed instead of initializing here
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
    };
  }, []);

  // Add keyboard shortcut for voice input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + M to toggle microphone
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        toggleRecording();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Create a speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance();
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set up event handlers
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      speechSynthesisRef.current = utterance;
      
      return () => {
        if (speechSynthesisRef.current) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

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
        duration: 3000,
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
        duration: 3000,
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
        duration: 3000,
      });
    }
  };

  const handleProfileUpdate = async (data: any) => {
    try {
      setLoading(true);
      const response = await api.put(`/api/students/${student.id}`, {
        name: data.name,
        email: data.email,
        educational_qualifications: data.educational_qualifications,
        preferred_location: data.preferred_location,
        preferred_program: data.preferred_program,
        preferred_field_of_study: data.preferred_field_of_study,
        budget: parseInt(data.budget),
        special_requirements: data.special_requirements || undefined
      });
      
      setStudent(response.data);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setShowProfileDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    
    // Stop recording if active
    if (isRecording && recognitionRef.current) {
      try {
        // Set isRecording to false first to prevent the onend handler from restarting
        setIsRecording(false);
        // Then stop the recognition
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
        setIsRecording(false);
      }
    }
    
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
          
          // Auto-speak the response if enabled
          if (autoSpeak) {
            speakText(result.response, assistantMessage.id);
          }
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
            duration: 3000,
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
          duration: 3000,
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
        duration: 3000,
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

  // Toggle recording
  const toggleRecording = () => {
    if (typeof window === 'undefined' || (!window.SpeechRecognition && !window.webkitSpeechRecognition)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use a modern browser like Chrome.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (isRecording) {
      // Stop recording
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
        setIsRecording(false);
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
        setIsRecording(false);
      }
    } else {
      // Start recording
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const transcriptText = result[0].transcript;
          
          setTranscript(transcriptText);
          
          if (result.isFinal) {
            setInput(transcriptText);
          }
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          recognitionRef.current = null;
          
          if (event.error !== 'aborted') {
            toast({
              title: "Speech Recognition Error",
              description: `Error: ${event.error}. Please try again.`,
              variant: "destructive",
              duration: 3000,
            });
          }
        };
        
        recognition.onend = () => {
          // Only restart if we're still supposed to be recording
          if (isRecording) {
            try {
              recognition.start();
            } catch (error) {
              console.error("Error restarting speech recognition:", error);
              setIsRecording(false);
              recognitionRef.current = null;
            }
          }
        };
        
        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
        setTranscript("");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({
          title: "Speech Recognition Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  // Function to speak text
  const speakText = (text: string, messageId: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !speechSynthesisRef.current) {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech. Please use a modern browser.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Set the text to speak
      speechSynthesisRef.current.text = text;
      
      // Try to select a female voice
      const voices = window.speechSynthesis.getVoices();
      
      // If voices are available immediately
      if (voices.length > 0) {
        // Find a female English voice
        const femaleVoice = voices.find(
          voice => 
            (voice.name.includes('female') || 
             voice.name.includes('Female') || 
             voice.name.includes('Samantha') || 
             voice.name.includes('Google US English Female') ||
             voice.name.includes('Microsoft Zira') ||
             voice.name.includes('Microsoft Jenny')) && 
            voice.lang.includes('en')
        );
        
        if (femaleVoice) {
          speechSynthesisRef.current.voice = femaleVoice;
        } else {
          // Fallback to any English voice
          const englishVoice = voices.find(voice => voice.lang.includes('en'));
          if (englishVoice) {
            speechSynthesisRef.current.voice = englishVoice;
          }
        }
      } else {
        // If voices aren't loaded yet, wait for them
        window.speechSynthesis.onvoiceschanged = () => {
          const voices = window.speechSynthesis.getVoices();
          
          // Find a female English voice
          const femaleVoice = voices.find(
            voice => 
              (voice.name.includes('female') || 
               voice.name.includes('Female') || 
               voice.name.includes('Samantha') || 
               voice.name.includes('Google US English Female') ||
               voice.name.includes('Microsoft Zira') ||
               voice.name.includes('Microsoft Jenny')) && 
              voice.lang.includes('en')
          );
          
          if (femaleVoice) {
            speechSynthesisRef.current.voice = femaleVoice;
          } else {
            // Fallback to any English voice
            const englishVoice = voices.find(voice => voice.lang.includes('en'));
            if (englishVoice) {
              speechSynthesisRef.current.voice = englishVoice;
            }
          }
          
          // Speak the text after setting the voice
          window.speechSynthesis.speak(speechSynthesisRef.current);
          setIsSpeaking(true);
          setSpeakingMessageId(messageId);
        };
        
        // Trigger voices to load
        window.speechSynthesis.getVoices();
        return;
      }
      
      // Speak the text
      window.speechSynthesis.speak(speechSynthesisRef.current);
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
    } catch (error) {
      console.error("Error starting speech synthesis:", error);
      toast({
        title: "Speech Synthesis Error",
        description: "Failed to read the message. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Function to stop speaking
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  };
  
  // Toggle auto-speak
  const toggleAutoSpeak = () => {
    setAutoSpeak(!autoSpeak);
    
    // If turning off auto-speak, stop any ongoing speech
    if (autoSpeak && isSpeaking) {
      stopSpeaking();
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
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Welcome Back to CounselAI
                </h1>
                <p className="text-xl text-muted-foreground">
                  Your personal AI counselor is ready to assist you
                </p>
              </div>
              
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Continue Your Journey</CardTitle>
                  <CardDescription className="text-center">
                    We found your previous session. Please confirm your email to continue.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <p className="text-center mb-6 text-muted-foreground">
                    Previous session found for: <br />
                    <span className="font-medium text-foreground">{maskEmail(storedStudentData?.email)}</span>
                  </p>
                  
                  <form onSubmit={handleEmailConfirmation} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={emailConfirmation}
                        onChange={(e) => setEmailConfirmation(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full"
                        required
                      />
                      {emailConfirmationError && (
                        <p className="text-sm text-red-500">{emailConfirmationError}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Confirming...</span>
                        </div>
                      ) : (
                        "Continue Chat"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Not your account?{" "}
                  <Button 
                    variant="link" 
                    className="text-primary font-medium p-0 h-auto"
                    onClick={startNewChat}
                  >
                    Start a new chat
                  </Button>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Top Bar with Profile Button */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">AI Counselor Chat</h1>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          if (isSpeaking) {
                            stopSpeaking();
                            setAutoSpeak(false);
                          } else {
                            setAutoSpeak(true);
                            // Don't automatically speak the last message
                            // Just enable auto-speak for future responses
                          }
                        }}
                        className={isSpeaking ? "bg-primary/10" : ""}
                      >
                        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSpeaking ? "Stop speaking" : "Enable speech"}</p>
                      <p className="text-xs text-muted-foreground mt-1">AI responses will be read aloud</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowProfileDialog(true);
                    setIsEditing(true);
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </div>
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
                  <div className="relative flex-1">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      disabled={loading}
                    />
                    {isRecording && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{transcript || "Listening..."}</span>
                      </div>
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={toggleRecording}
                          className={isRecording ? "bg-red-100 hover:bg-red-200" : ""}
                          disabled={loading}
                        >
                          {isRecording ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isRecording ? "Stop recording" : "Start voice input"}</p>
                        <p className="text-xs text-muted-foreground mt-1">Press Alt+M to toggle</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
          <StudentOnboardingForm 
            onComplete={handleProfileUpdate}
            initialData={student}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Chat;
