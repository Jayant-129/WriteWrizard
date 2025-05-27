import AddDocumentBtn from "@/components/AddDocumentBtn";
import DocumentCard from "@/components/DocumentCard";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import Logo from "@/components/Logo";
import { getDocuments } from "@/lib/actions/room.actions";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import {
  FileText,
  Search,
  Filter,
  Sparkles,
  Users,
  Brain,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Check,
  Star,
  Quote,
} from "lucide-react";
import { redirect } from "next/navigation";
import RealTimeDashboard from "@/components/RealTimeDashboard";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    // Show landing page for non-authenticated users
    return <LandingPage />;
  }

  const roomDocuments = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );

  const userEmail = clerkUser.emailAddresses[0].emailAddress;
  const ownedDocuments = roomDocuments.ownedDocuments || [];
  const sharedDocuments = roomDocuments.sharedDocuments || [];
  const totalDocuments = roomDocuments.data?.length || 0;

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      <RealTimeDashboard userEmail={userEmail}>
        <div className="max-w-7xl mx-auto px-6 py-8">
        {totalDocuments > 0 ? (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">
                  Your Documents
                </h1>
                <p className="text-gray-400">
                  {totalDocuments} document
                  {totalDocuments !== 1 ? "s" : ""} • {ownedDocuments.length} owned • {sharedDocuments.length} shared
                </p>
              </div>
              <AddDocumentBtn
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress}
              />
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors duration-300">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:block">Filter</span>
              </button>
            </div>

            {/* My Documents Section */}
            {ownedDocuments.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">My Documents</h2>
                  <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                    {ownedDocuments.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedDocuments.map((document: any) => (
                    <DocumentCard
                      key={document.id}
                      id={document.id}
                      metadata={document.metadata}
                      createdAt={document.createdAt}
                      currentUserEmail={userEmail}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Shared Documents Section */}
            {sharedDocuments.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">Shared with Me</h2>
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    {sharedDocuments.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sharedDocuments.map((document: any) => (
                    <DocumentCard
                      key={document.id}
                      id={document.id}
                      metadata={document.metadata}
                      createdAt={document.createdAt}
                      currentUserEmail={userEmail}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
            <div className="relative">
              <div className="p-8 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full">
                <FileText className="w-20 h-20 text-red-400" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse" />
            </div>

            <div className="space-y-3 max-w-md">
              <h2 className="text-3xl font-bold text-white">
                Welcome to WriteWrizard
              </h2>
              <p className="text-gray-400 text-lg">
                Create your first document to start writing and collaborating
                with AI assistance.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Real-time collaboration</li>
                <li>• AI-powered writing assistance</li>
                <li>• Rich text editing</li>
              </ul>
            </div>

            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
        )}
        </div>
      </RealTimeDashboard>
    </main>
  );
};

// Landing Page Component for non-authenticated users
function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-dark-100/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo size="sm" showText={true} />
              <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                AI-Powered
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/sign-in"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </a>
              <a
                href="/sign-up"
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Write Smarter with{" "}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  AI Magic
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                The collaborative document editor that supercharges your writing
                with AI assistance, real-time collaboration, and intelligent
                suggestions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/sign-up"
                className="btn-primary px-8 py-4 text-lg flex items-center gap-2"
              >
                Start Writing Free
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#features" className="btn-secondary px-8 py-4 text-lg">
                Explore Features
              </a>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Setup in 30 seconds</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="floating-card max-w-4xl mx-auto">
              <div className="bg-gray-900/50 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-sm text-gray-400">
                    WriteWrizard Document
                  </div>
                </div>
                <div className="text-left space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  <div className="flex items-center gap-2 mt-4">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <div className="h-3 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Powerful Features for Modern Writing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create, collaborate, and craft exceptional
              documents with the power of AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="floating-card p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                AI Writing Assistant
              </h3>
              <p className="text-gray-400">
                Get intelligent suggestions, generate titles, and improve your
                writing with advanced AI that understands context.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="floating-card p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Real-time Collaboration
              </h3>
              <p className="text-gray-400">
                Work together seamlessly with your team. See changes instantly
                and collaborate without conflicts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="floating-card p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Lightning Fast
              </h3>
              <p className="text-gray-400">
                Experience blazing-fast performance with our optimized editor
                that handles large documents effortlessly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="floating-card p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Secure & Private
              </h3>
              <p className="text-gray-400">
                Your data is encrypted and secure. We prioritize privacy and
                give you full control over your documents.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="floating-card p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Access Anywhere
              </h3>
              <p className="text-gray-400">
                Work from any device, anywhere. Your documents sync
                automatically across all your devices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="floating-card p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Smart Formatting
              </h3>
              <p className="text-gray-400">
                Rich text editing with intelligent formatting, markdown support,
                and beautiful typography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Loved by Writers Worldwide
            </h2>
            <p className="text-xl text-gray-400">
              See what our users are saying about WriteWrizard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="floating-card p-8 space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <Quote className="w-8 h-8 text-indigo-400" />
              <p className="text-gray-300">
                "WriteWrizard has completely transformed how our team
                collaborates on documents. The AI suggestions are incredibly
                helpful!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">SJ</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Sarah Johnson</div>
                  <div className="text-gray-400 text-sm">Content Manager</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="floating-card p-8 space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <Quote className="w-8 h-8 text-indigo-400" />
              <p className="text-gray-300">
                "The real-time collaboration is seamless, and the AI writing
                assistant helps me overcome writer's block instantly."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">MC</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Mike Chen</div>
                  <div className="text-gray-400 text-sm">Technical Writer</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="floating-card p-8 space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <Quote className="w-8 h-8 text-indigo-400" />
              <p className="text-gray-300">
                "Finally, a document editor that understands modern workflows.
                The AI features are a game-changer for productivity."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">AR</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Alex Rodriguez</div>
                  <div className="text-gray-400 text-sm">
                    Marketing Director
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="floating-card p-12 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Transform Your Writing?
              </h2>
              <p className="text-xl text-gray-400">
                Join thousands of writers who are already using WriteWrizard to
                create better content faster.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/sign-up"
                className="btn-primary px-8 py-4 text-lg flex items-center gap-2"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/sign-in" className="btn-secondary px-8 py-4 text-lg">
                Sign In
              </a>
            </div>

            <p className="text-sm text-gray-500">
              No credit card required • Free forever plan • Setup in 30 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">WriteWrizard</span>
            </div>

            <div className="flex items-center gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Help
              </a>
            </div>

            <div className="text-gray-500 text-sm">
              © 2024 WriteWrizard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
