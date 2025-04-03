
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User, Pencil, Save, School, MapPin, Briefcase, BookOpen, FileText } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Mock user data
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Computer Science student interested in artificial intelligence and machine learning. Looking for graduate programs in these fields.",
    education: [
      {
        id: "1",
        institution: "NYU",
        degree: "Bachelor of Science",
        field: "Computer Science",
        year: "2021-2025"
      }
    ],
    interests: ["Artificial Intelligence", "Machine Learning", "Data Science"],
    examScores: {
      GRE: {
        verbal: 160,
        quantitative: 167,
        writing: 4.5
      },
      TOEFL: 110
    }
  });
  
  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>
      
      <div className="grid gap-8 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-counsel-100 text-counsel-800">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {user.interests.map((interest, idx) => (
                  <Badge key={idx} variant="outline" className="bg-counsel-50">
                    {interest}
                  </Badge>
                ))}
              </div>
              
              <div className="w-full space-y-4">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <School className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.education[0].institution}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.education[0].field}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="academic">
                <School className="h-4 w-4 mr-2" />
                Academic
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <BookOpen className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={user.name} 
                        disabled={!isEditing}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={user.email} 
                        disabled={!isEditing}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={user.phone} 
                        disabled={!isEditing}
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={user.location} 
                        disabled={!isEditing}
                        onChange={(e) => setUser({...user, location: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={user.bio} 
                      disabled={!isEditing}
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value="••••••••" disabled />
                  </div>
                  
                  <Button variant="outline" disabled={!isEditing}>
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="academic" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Education History</CardTitle>
                  <CardDescription>
                    Your academic background and educational history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{edu.institution}</h3>
                          <p className="text-sm text-muted-foreground">
                            {edu.degree} in {edu.field}
                          </p>
                        </div>
                        <Badge variant="outline">{edu.year}</Badge>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm" className="mt-2">
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <Button variant="outline" className="w-full">
                      + Add Education
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Test Scores</CardTitle>
                  <CardDescription>
                    Standardized test scores and certifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">GRE</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Verbal</p>
                        <p className="font-medium">{user.examScores.GRE.verbal}/170</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantitative</p>
                        <p className="font-medium">{user.examScores.GRE.quantitative}/170</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Analytical Writing</p>
                        <p className="font-medium">{user.examScores.GRE.writing}/6.0</p>
                      </div>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">TOEFL</h3>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Total Score</p>
                      <p className="font-medium">{user.examScores.TOEFL}/120</p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  {isEditing && (
                    <Button variant="outline" className="w-full">
                      + Add Test Score
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Upload and manage your academic documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-counsel-600" />
                      <div>
                        <p className="font-medium">Resume_JohnDoe.pdf</p>
                        <p className="text-sm text-muted-foreground">Uploaded on Apr 1, 2025</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  
                  {isEditing && (
                    <Button variant="outline" className="w-full">
                      + Upload Document
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Interests</CardTitle>
                  <CardDescription>
                    Fields of study and academic areas you're interested in
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Field of Interest</Label>
                    <Select disabled={!isEditing} defaultValue="ai">
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai">Artificial Intelligence</SelectItem>
                        <SelectItem value="ds">Data Science</SelectItem>
                        <SelectItem value="se">Software Engineering</SelectItem>
                        <SelectItem value="cs">Cybersecurity</SelectItem>
                        <SelectItem value="hci">Human-Computer Interaction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Secondary Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="py-1 px-2">
                          {interest}
                          {isEditing && (
                            <button className="ml-2 text-muted-foreground hover:text-foreground">
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Button variant="outline" size="sm">+ Add</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Program Preferences</CardTitle>
                  <CardDescription>
                    Your preferences for educational programs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred Program Level</Label>
                      <Select disabled={!isEditing} defaultValue="masters">
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelors">Bachelor's</SelectItem>
                          <SelectItem value="masters">Master's</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="certificate">Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preferred Start Date</Label>
                      <Select disabled={!isEditing} defaultValue="fall2025">
                        <SelectTrigger>
                          <SelectValue placeholder="Select date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fall2025">Fall 2025</SelectItem>
                          <SelectItem value="spring2026">Spring 2026</SelectItem>
                          <SelectItem value="fall2026">Fall 2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Location Preference</Label>
                      <Select disabled={!isEditing} defaultValue="northeast">
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="northeast">Northeast US</SelectItem>
                          <SelectItem value="midwest">Midwest US</SelectItem>
                          <SelectItem value="south">Southern US</SelectItem>
                          <SelectItem value="west">Western US</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Program Format</Label>
                      <Select disabled={!isEditing} defaultValue="inperson">
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inperson">In-Person</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Preferences</CardTitle>
                  <CardDescription>
                    Other factors important to your program selection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="additional">Additional Considerations</Label>
                    <Textarea 
                      id="additional" 
                      disabled={!isEditing}
                      placeholder="Enter any additional preferences, such as scholarship requirements, specific curriculum interests, etc."
                      className="min-h-[100px]"
                    />
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

export default Profile;
