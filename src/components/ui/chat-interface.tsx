
import React, { useState, useRef, useEffect } from "react";
import { Send, PaperclipIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
}

const ChatInterface = ({ initialMessages = [], onSendMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    try {
      if (onSendMessage) {
        await onSendMessage(input);
      } else {
        // If no handler provided, simulate a response
        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Thanks for your message! I'm analyzing your profile to provide personalized program recommendations based on your academic background, preferences, and goals. How can I help you today?",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      if (onSendMessage) {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh] md:max-h-[600px] border rounded-lg overflow-hidden bg-background">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">AI Counselor Chat</h3>
        <p className="text-sm text-muted-foreground">
          Ask questions about programs, academic pathways, or get personalized recommendations
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <BookOpenIcon className="h-12 w-12 mb-4 text-counsel-300" />
            <h3 className="text-lg font-medium">Welcome to CounselAI</h3>
            <p className="max-w-md">
              Start chatting with our AI counselor to get personalized program recommendations
              and guidance for your academic journey.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 animate-fade-in",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role !== "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/ai-avatar.png" />
                  <AvatarFallback className="bg-counsel-100 text-counsel-800">AI</AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "rounded-lg p-3 max-w-[80%]",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className={cn(
                  "text-xs mt-1",
                  message.role === "user" 
                    ? "text-primary-foreground/70" 
                    : "text-muted-foreground"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/20 text-primary">JD</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/ai-avatar.png" />
              <AvatarFallback className="bg-counsel-100 text-counsel-800">AI</AvatarFallback>
            </Avatar>
            <div className="rounded-lg p-3 bg-muted">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[80px] flex-1 resize-none"
          />
          <div className="flex flex-col justify-between">
            <Button 
              size="icon" 
              variant="ghost"
              className="rounded-full"
              type="button"
            >
              <PaperclipIcon className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button 
              size="icon" 
              className="rounded-full"
              onClick={handleSend}
              disabled={isLoading || input.trim() === ""}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

// Helper icon component
const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
