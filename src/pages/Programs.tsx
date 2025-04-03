
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, BookOpen, Bookmark } from "lucide-react";
import ProgramCard from "@/components/program/ProgramCard";

// Mock data
const allPrograms = [
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
  },
  {
    id: "4",
    name: "Computer Engineering",
    institution: "UC Berkeley",
    location: "Berkeley, CA",
    duration: "4 years",
    level: "Bachelor's",
    description: "Combines computer science with electrical engineering to develop computer hardware and software.",
    match: 82
  },
  {
    id: "5",
    name: "Cybersecurity",
    institution: "Georgia Tech",
    location: "Atlanta, GA",
    duration: "2 years",
    level: "Master's",
    description: "Focus on protecting systems, networks, and programs from digital attacks.",
    match: 80
  },
  {
    id: "6",
    name: "Information Systems",
    institution: "NYU",
    location: "New York, NY",
    duration: "4 years",
    level: "Bachelor's",
    description: "Study the application of technology in business environments and organizational settings.",
    match: 78
  }
];

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredPrograms = allPrograms.filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-bold">Browse Programs</h1>
        <p className="text-muted-foreground">
          Discover and explore educational programs that match your interests and goals
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs, institutions, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="md:w-auto w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Program Level</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="bachelor">Bachelor's</SelectItem>
                    <SelectItem value="master">Master's</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Field of Study</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Fields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="eng">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Location</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="northeast">Northeast US</SelectItem>
                    <SelectItem value="midwest">Midwest US</SelectItem>
                    <SelectItem value="south">Southern US</SelectItem>
                    <SelectItem value="west">Western US</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Duration</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Any Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Duration</SelectItem>
                    <SelectItem value="1-2">1-2 Years</SelectItem>
                    <SelectItem value="3-4">3-4 Years</SelectItem>
                    <SelectItem value="5+">5+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" size="sm">Reset</Button>
              <Button size="sm">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="animate-slide-up">
          {filteredPrograms.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map(program => (
                <ProgramCard key={program.id} {...program} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Programs Found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters to find programs.
              </p>
              <Button className="mt-4" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommended" className="animate-slide-up">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allPrograms.slice(0, 3).map(program => (
              <ProgramCard key={program.id} {...program} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="animate-slide-up">
          <div className="text-center py-12">
            <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Saved Programs</h3>
            <p className="text-muted-foreground mt-2">
              You haven't saved any programs yet. Browse and save programs to find them here.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setActiveTab("all")}
            >
              Browse Programs
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Programs;
