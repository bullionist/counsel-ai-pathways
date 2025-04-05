import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, BookOpen, Bookmark } from "lucide-react";
import ProgramCard from "@/components/program/ProgramCard";
import { programService, Program } from "@/services/programService";
import { useToast } from "@/components/ui/use-toast";

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      console.log('Fetching programs...');
      const data = await programService.getAllPrograms();
      console.log('Received programs:', data);
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: "Error",
        description: "Failed to load programs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPrograms();
      return;
    }

    try {
      setLoading(true);
      console.log('Searching programs with query:', searchQuery);
      const results = await programService.searchPrograms(searchQuery);
      console.log('Search results:', results);
      setPrograms(results);
    } catch (error) {
      console.error('Error searching programs:', error);
      toast({
        title: "Error",
        description: "Failed to search programs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Academic Programs</h1>
          <p className="text-muted-foreground">
            Explore and discover academic programs that match your interests and goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-counsel-600"></div>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No programs found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
