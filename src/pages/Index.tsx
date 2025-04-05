import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, School, Award, ChevronRight, BarChart, Sparkles, Brain, Target, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-counsel-50/50 to-background py-32">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2 text-base">
                  <Sparkles className="h-4 w-4 mr-2 inline-block" />
                  AI-Powered Academic Guidance
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-counsel-600 to-purple-600 bg-clip-text text-transparent">
                  Your Personal AI Academic Counselor
                </h1>
                <p className="text-xl text-muted-foreground">
                  Get instant, personalized guidance for your academic journey. Explore programs, receive recommendations, and make informed decisions about your future.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/chat">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <h4 className="text-2xl font-bold">10k+</h4>
                  <p className="text-muted-foreground">Students Guided</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <h4 className="text-2xl font-bold">98%</h4>
                  <p className="text-muted-foreground">Success Rate</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <h4 className="text-2xl font-bold">24/7</h4>
                  <p className="text-muted-foreground">AI Support</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-counsel-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000" 
                alt="Students celebrating graduation by throwing caps in the air" 
                className="relative rounded-3xl shadow-2xl border border-border/50 object-cover h-[600px] w-full"
                style={{ objectPosition: "center 30%" }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
        <div className="container relative">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2 text-base">
              <Brain className="h-4 w-4 mr-2 inline-block" />
              Smart Features
            </Badge>
            <h2 className="text-4xl font-bold">How CounselAI Helps You Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive support throughout your academic journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare className="h-10 w-10 text-counsel-600" />}
              title="Smart Conversations"
              description="Engage in natural, context-aware discussions about your academic goals and receive personalized guidance."
            />
            <FeatureCard 
              icon={<Target className="h-10 w-10 text-counsel-600" />}
              title="Tailored Recommendations"
              description="Get program suggestions that perfectly match your academic background, interests, and career aspirations."
            />
            <FeatureCard 
              icon={<School className="h-10 w-10 text-counsel-600" />}
              title="Comprehensive Analysis"
              description="Receive detailed insights about programs, universities, and career paths based on your profile."
            />
          </div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section className="py-24 bg-gradient-to-b from-background to-counsel-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
        <div className="container relative">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2 text-base">
              <BookOpen className="h-4 w-4 mr-2 inline-block" />
              Academic Programs
            </Badge>
            <h2 className="text-4xl font-bold">Discover Your Perfect Program</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore thousands of programs across various disciplines and find the one that matches your aspirations
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ProgramCategoryCard 
              icon={<School className="h-8 w-8" />}
              title="Undergraduate Programs"
              count={2500}
              color="bg-blue-50 text-blue-700"
            />
            <ProgramCategoryCard 
              icon={<BookOpen className="h-8 w-8" />}
              title="Graduate Studies"
              count={1800}
              color="bg-purple-50 text-purple-700"
            />
            <ProgramCategoryCard 
              icon={<Award className="h-8 w-8" />}
              title="Professional Certificates"
              count={950}
              color="bg-amber-50 text-amber-700"
            />
            <ProgramCategoryCard 
              icon={<BarChart className="h-8 w-8" />}
              title="Business & Management"
              count={1200}
              color="bg-green-50 text-green-700"
            />
            <ProgramCategoryCard 
              icon={<span className="flex h-8 w-8 items-center justify-center rounded-full">🧬</span>}
              title="Science & Technology"
              count={1350}
              color="bg-indigo-50 text-indigo-700"
            />
            <ProgramCategoryCard 
              icon={<span className="flex h-8 w-8 items-center justify-center rounded-full">🎨</span>}
              title="Arts & Humanities"
              count={1100}
              color="bg-rose-50 text-rose-700"
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
        <div className="container relative">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2 text-base">
              <Award className="h-4 w-4 mr-2 inline-block" />
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold">What Our Students Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from students who found their path with CounselAI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard 
              quote="CounselAI's personalized recommendations helped me discover my passion for data science and find the perfect graduate program."
              name="Sarah Johnson"
              role="MS in Data Science Student"
              image="https://randomuser.me/api/portraits/women/45.jpg"
            />
            <TestimonialCard 
              quote="The AI counselor provided invaluable guidance throughout my PhD application process, making it much less overwhelming."
              name="Michael Chen"
              role="PhD Candidate in Computer Science"
              image="https://randomuser.me/api/portraits/men/32.jpg"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-counsel-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="container relative text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-base">
              <Sparkles className="h-4 w-4 mr-2 inline-block" />
              Get Started Today
            </Badge>
            <h2 className="text-4xl font-bold text-white">Ready to Shape Your Academic Future?</h2>
            <p className="text-xl text-counsel-100">
              Join thousands of students who have found their perfect academic path with CounselAI's personalized guidance.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/chat">
                Start Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

// Helper components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow">
    <div className="p-3 rounded-2xl bg-counsel-50 w-fit">{icon}</div>
    <h3 className="text-2xl font-semibold">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </Card>
);

const ProgramCategoryCard = ({ icon, title, count, color }: { icon: React.ReactNode, title: string, count: number, color: string }) => (
  <Link to="/chat" className="block">
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${color}`}>{icon}</div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{count}+ programs</p>
        </div>
      </div>
    </Card>
  </Link>
);

const TestimonialCard = ({ quote, name, role, image }: { quote: string, name: string, role: string, image: string }) => (
  <Card className="p-8 space-y-6">
    <p className="text-lg leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-4">
      <img 
        src={image} 
        alt={name} 
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </Card>
);

export default Index;
