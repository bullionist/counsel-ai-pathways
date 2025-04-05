import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Clock, GraduationCap, DollarSign, Info } from "lucide-react";
import { Program } from "@/services/programService";
import { Badge } from "@/components/ui/badge";

interface ProgramCardProps {
  program: Program;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{program.program_title}</h3>
            <p className="text-sm text-muted-foreground">{program.institution}</p>
          </div>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm">{program.program_overview}</p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {program.location}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {program.duration}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="mr-2 h-4 w-4" />
            {program.fees.toLocaleString()} USD
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <GraduationCap className="mr-2 h-4 w-4" />
            {program.mode_of_delivery}
          </div>
          
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Eligibility</h4>
            <div className="flex flex-wrap gap-1">
              {program.eligibility_criteria.qualifications.map((qualification, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {qualification}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Core Modules</h4>
            <div className="flex flex-wrap gap-1">
              {program.curriculum.core_modules.slice(0, 2).map((module, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {module.name}
                </Badge>
              ))}
              {program.curriculum.core_modules.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{program.curriculum.core_modules.length - 2} more
                </Badge>
              )}
            </div>
          </div>
          
          {program.additional_notes && (
            <div className="flex items-start text-sm text-muted-foreground mt-2">
              <Info className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{program.additional_notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Learn More</Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
