
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/ui/chat-interface";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Info, Lightbulb } from "lucide-react";

// Mock data for conversation history
const initialConversation = [
  {
    id: "1",
    role: "system" as const,
    content: "Hello! I'm your AI Counselor. I can help you find the right academic programs based on your interests, background, and goals. What would you like to know today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 24)
  },
  {
    id: "2",
    role: "user" as const,
    content: "I'm interested in studying computer science but not sure which specialization to choose.",
    timestamp: new Date(Date.now() - 1000 * 60 * 23)
  },
  {
    id: "3",
    role: "assistant" as const,
    content: "That's great! Computer Science offers many exciting specializations. Based on current industry trends and your interests, you might consider:\n\n1. Artificial Intelligence & Machine Learning\n2. Cybersecurity\n3. Data Science\n4. Software Engineering\n5. Human-Computer Interaction\n\nCould you tell me a bit more about your interests or career goals so I can provide more tailored recommendations?",
    timestamp: new Date(Date.now() - 1000 * 60 * 22)
  }
];

const Chat = () => {
  const [messages, setMessages] = useState(initialConversation);
  
  const handleSendMessage = async (message: string) => {
    // Here you would integrate with a real AI service
    // For now, we'll simulate a response
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const botMessage = {
          id: Date.now().toString(),
          role: "assistant" as const,
          content: "I understand your interest in computer science. To provide more specific recommendations, could you share more about your previous academic background and any particular areas of computer science that interest you the most?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        resolve();
      }, 1500);
    });
  };
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-bold">AI Counselor</h1>
        <p className="text-muted-foreground">
          Chat with our AI counselor to get personalized program recommendations and guidance
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ChatInterface 
            initialMessages={messages} 
            onSendMessage={handleSendMessage} 
          />
        </div>
        
        <div className="space-y-6">
          <Tabs defaultValue="tips">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tips">Tips</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-4">
                    <Lightbulb className="h-5 w-5 mr-2 mt-0.5 text-yellow-500" />
                    <div>
                      <h3 className="text-sm font-medium">Be Specific</h3>
                      <p className="text-sm text-muted-foreground">
                        Provide details about your academic background, interests, and goals for better recommendations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <Lightbulb className="h-5 w-5 mr-2 mt-0.5 text-yellow-500" />
                    <div>
                      <h3 className="text-sm font-medium">Ask Follow-up Questions</h3>
                      <p className="text-sm text-muted-foreground">
                        Don't hesitate to ask for clarification or more details about programs
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Lightbulb className="h-5 w-5 mr-2 mt-0.5 text-yellow-500" />
                    <div>
                      <h3 className="text-sm font-medium">Share Your Constraints</h3>
                      <p className="text-sm text-muted-foreground">
                        Mention any constraints like location, budget, or time commitment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-2">Sample Questions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="cursor-pointer hover:text-primary">
                      "What are the top computer science programs in the Northeast?"
                    </li>
                    <li className="cursor-pointer hover:text-primary">
                      "I want to study data science. What prerequisites should I focus on?"
                    </li>
                    <li className="cursor-pointer hover:text-primary">
                      "Compare MBA programs vs. specialized business masters"
                    </li>
                    <li className="cursor-pointer hover:text-primary">
                      "What scholarships are available for international students?"
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="info">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 mt-0.5 text-counsel-600" />
                    <div>
                      <h3 className="text-sm font-medium">About AI Counselor</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI counselor is trained on comprehensive educational data including programs, 
                        admission requirements, career outcomes, and more.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 mt-0.5 text-counsel-600" />
                    <div>
                      <h3 className="text-sm font-medium">Personalized Guidance</h3>
                      <p className="text-sm text-muted-foreground">
                        The more you interact with the AI, the better it understands your needs 
                        and can provide tailored recommendations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 mt-0.5 text-counsel-600" />
                    <div>
                      <h3 className="text-sm font-medium">Privacy</h3>
                      <p className="text-sm text-muted-foreground">
                        Your conversations are stored securely and used only to improve your 
                        counseling experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="explore">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-4">Explore Topics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Undergraduate Programs", "Graduate Programs", "Scholarships", "Admissions Process", 
                      "Career Paths", "Test Preparation", "Study Abroad", "Research Opportunities"].map((topic) => (
                      <div 
                        key={topic} 
                        className="flex items-center p-2 rounded-md border hover:bg-muted cursor-pointer"
                      >
                        <BookOpen className="h-4 w-4 mr-2 text-counsel-600" />
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Chat;
