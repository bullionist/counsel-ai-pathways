
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, School, Award, Calendar, Target, MessageCircle, ArrowRight } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ProgramCard from "@/components/program/ProgramCard";
import { Link } from "react-router-dom";

// Mock data
const recommendedPrograms = [
  {
    id: "1",
    name: "Computer Science",
    institution: "MIT",
    location: "Cambridge, MA",
    duration: "4 years",
    level: "Bachelor's",
    description: "A comprehensive program covering algorithms, data structures, and software engineering principles.",
    match: 94
  },
  {
    id: "2",
    name: "Data Science",
    institution: "Stanford University",
    location: "Stanford, CA",
    duration: "2 years",
    level: "Master's",
    description: "Learn to analyze and interpret complex data with cutting-edge techniques and technologies.",
    match: 89
  },
  {
    id: "3",
    name: "Artificial Intelligence",
    institution: "Carnegie Mellon",
    location: "Pittsburgh, PA",
    duration: "2 years",
    level: "Master's",
    description: "Explore machine learning, neural networks, and AI applications across various domains.",
    match: 85
  }
];

const upcomingEvents = [
  { id: "1", title: "Application Deadline: MIT", date: "May 15, 2025", type: "deadline" },
  { id: "2", title: "Virtual Campus Tour: Stanford", date: "April 10, 2025", type: "event" },
  { id: "3", title: "Scholarship Application Workshop", date: "April 05, 2025", type: "workshop" }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">View your recommendations, track your progress, and chat with the AI counselor.</p>
        </div>
        <Button asChild>
          <Link to="/chat">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat with AI Counselor
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Programs Viewed"
          value={12}
          icon={<BookOpen />}
          trend={{ value: 20, isPositive: true }}
        />
        <StatsCard
          title="Matching Score"
          value="85%"
          icon={<Target />}
          description="Based on your profile and preferences"
        />
        <StatsCard
          title="Counseling Sessions"
          value={3}
          icon={<MessageCircle />}
          trend={{ value: 33, isPositive: true }}
        />
        <StatsCard
          title="Application Deadlines"
          value={2}
          icon={<Calendar />}
          description="Upcoming in the next 30 days"
        />
      </div>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-slide-up">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Program Matches</CardTitle>
                <CardDescription>
                  Personalized recommendations based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recommendedPrograms.slice(0, 2).map(program => (
                  <div key={program.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50 cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium">{program.name}</span>
                      <span className="text-sm text-muted-foreground">{program.institution}</span>
                    </div>
                    <CustomBadge className="bg-counsel-100 text-counsel-800">{program.match}%</CustomBadge>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/programs">
                    View all programs
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Important dates and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50 cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                    </div>
                    <EventBadge type={event.type} />
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">
                  View all events
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Providing more information helps us give better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <School className="h-5 w-5 mr-2 text-counsel-600" />
                    <span>Academic Background</span>
                  </div>
                  <CustomBadge className="bg-counsel-100 text-counsel-800 border-counsel-200">Complete</CustomBadge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-counsel-600" />
                    <span>Career Goals</span>
                  </div>
                  <CustomBadge className="text-amber-600 border-amber-200 bg-amber-50">75%</CustomBadge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-counsel-600" />
                    <span>Test Scores</span>
                  </div>
                  <CustomBadge className="text-red-600 border-red-200 bg-red-50">Missing</CustomBadge>
                </div>
                
                <Button asChild>
                  <Link to="/profile">Update Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Recommended Programs</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedPrograms.map(program => (
              <ProgramCard key={program.id} {...program} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>Academic Timeline</CardTitle>
              <CardDescription>
                Important dates and milestones for your educational journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l ml-4 space-y-6">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id} className="relative pb-6">
                    <div className="absolute -left-10 top-0 rounded-full w-4 h-4 bg-counsel-600" />
                    <div className="mb-1 text-lg font-semibold">{event.title}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {event.date}
                    </div>
                    <p className="mt-2 text-sm">
                      {event.type === "deadline" 
                        ? "Don't miss this important deadline! Make sure to submit your application on time." 
                        : event.type === "event" 
                        ? "Join this virtual event to learn more about the campus and programs offered."
                        : "Attend this workshop to get help with your scholarship applications."}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper components
const CustomBadge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${className || 'bg-counsel-100 text-counsel-800'}`}>
    {children}
  </span>
);

const EventBadge = ({ type }: { type: string }) => {
  let classes = '';
  
  switch (type) {
    case 'deadline':
      classes = 'bg-red-50 text-red-700 border-red-200';
      break;
    case 'event':
      classes = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'workshop':
      classes = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    default:
      classes = 'bg-gray-50 text-gray-700 border-gray-200';
  }
  
  return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${classes}`}>{type}</span>;
};

export default Dashboard;
