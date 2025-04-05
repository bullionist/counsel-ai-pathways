import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, School, Award, ChevronRight, BarChart } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const Index = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-counsel-50 to-background py-20">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl mb-6">
            AI-Powered Guidance for Your Academic Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Get personalized program recommendations and academic counseling tailored to your unique background and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/chat">
                Chat with AI Counselor
                <MessageSquare className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80" 
              alt="Student using a laptop" 
              className="w-full h-auto object-cover max-w-3xl" 
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How CounselAI Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform analyzes your academic background, interests, and career goals to provide personalized guidance every step of the way.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare className="h-10 w-10 text-counsel-600" />}
              title="Chat with AI Counselor"
              description="Engage in natural conversations with our AI to explore educational options and receive guidance."
            />
            <FeatureCard 
              icon={<Award className="h-10 w-10 text-counsel-600" />}
              title="Get Recommendations"
              description="Receive personalized program recommendations based on your profile and conversations."
            />
            <FeatureCard 
              icon={<School className="h-10 w-10 text-counsel-600" />}
              title="Explore Programs"
              description="Discover academic programs that match your interests, qualifications, and career goals."
            />
          </div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section className="py-16 bg-gradient-to-b from-background to-counsel-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Academic Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through thousands of programs across various disciplines and institutions to find your perfect fit.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ProgramCategoryCard 
              icon={<School className="h-8 w-8" />}
              title="Undergraduate"
              count={2500}
              color="bg-blue-50 text-blue-700"
            />
            <ProgramCategoryCard 
              icon={<BookOpen className="h-8 w-8" />}
              title="Graduate"
              count={1800}
              color="bg-purple-50 text-purple-700"
            />
            <ProgramCategoryCard 
              icon={<Award className="h-8 w-8" />}
              title="Certificate"
              count={950}
              color="bg-amber-50 text-amber-700"
            />
            <ProgramCategoryCard 
              icon={<BarChart className="h-8 w-8" />}
              title="Business"
              count={1200}
              color="bg-green-50 text-green-700"
            />
            <ProgramCategoryCard 
              icon={<span className="flex h-8 w-8 items-center justify-center rounded-full">🧬</span>}
              title="Sciences"
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
          
          <div className="text-center mt-10">
            <Button asChild>
              <Link to="/chat">
                Start Chatting with AI
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from students who found their ideal academic path with CounselAI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard 
              quote="The AI counselor helped me narrow down my options and find a program that perfectly matched my interests in data science and healthcare."
              name="Sarah Johnson"
              role="MS in Data Science Student"
              image="https://randomuser.me/api/portraits/women/45.jpg"
            />
            <TestimonialCard 
              quote="I was overwhelmed by the graduate school application process until I found CounselAI. The personalized guidance made all the difference."
              name="Michael Chen"
              role="PhD Candidate in Computer Science"
              image="https://randomuser.me/api/portraits/men/32.jpg"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-counsel-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Academic Path?</h2>
          <p className="text-counsel-100 max-w-2xl mx-auto mb-8">
            Start chatting with our AI counselor today to discover educational opportunities tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/chat">
                Chat with AI Counselor
                <MessageSquare className="ml-2 h-4 w-4" />
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
  <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
    <div className="mb-4 p-3 rounded-full bg-counsel-50">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const ProgramCategoryCard = ({ icon, title, count, color }: { icon: React.ReactNode, title: string, count: number, color: string }) => (
  <Link to="/chat" className="block">
    <div className="flex items-center p-6 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{count}+ programs</p>
      </div>
    </div>
  </Link>
);

const TestimonialCard = ({ quote, name, role, image }: { quote: string, name: string, role: string, image: string }) => (
  <div className="p-6 rounded-lg border bg-white shadow-sm">
    <p className="text-lg italic mb-6">"{quote}"</p>
    <div className="flex items-center">
      <img 
        src={image} 
        alt={name} 
        className="h-12 w-12 rounded-full mr-4 object-cover" 
      />
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

export default Index;
