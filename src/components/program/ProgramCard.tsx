
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Clock, BookOpen, ExternalLink } from "lucide-react";

interface ProgramProps {
  id: string;
  name: string;
  institution: string;
  location: string;
  duration: string;
  level: string;
  description: string;
  match?: number; // optional match percentage for recommendations
}

const ProgramCard = ({
  id,
  name,
  institution,
  location,
  duration,
  level,
  description,
  match
}: ProgramProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        {match && (
          <div className="flex justify-end">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {match}% Match
            </Badge>
          </div>
        )}
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="flex items-center">
          <GraduationCap className="h-4 w-4 mr-1" />
          {institution}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
        </div>
        <Badge variant="secondary">{level}</Badge>
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <BookOpen className="h-4 w-4 mr-1" />
          Details
        </Button>
        <Button size="sm">
          <ExternalLink className="h-4 w-4 mr-1" />
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
