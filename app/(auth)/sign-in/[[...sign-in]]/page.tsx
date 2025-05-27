import { SignIn } from "@clerk/nextjs";
import { FileText, Users, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";

const SignInPage = () => {
  return (
    <main className="auth-page bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-screen w-full">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
          <div className="max-w-lg text-center space-y-8">
            {/* Logo and Title */}
            <div className="space-y-4">
              <Logo size="lg" showText={true} className="justify-center mb-6" />
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform your ideas into powerful documents with AI-powered
                collaboration
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">
                    Smart Document Editor
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Rich text editing with real-time collaboration
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">
                    Real-time Collaboration
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Work together seamlessly with your team
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">
                    AI-Powered Writing
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Let AI help you write better and faster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <Logo size="md" showText={true} className="justify-center mb-4" />
              <p className="text-gray-400">
                Welcome back! Sign in to continue writing.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-2xl">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "bg-transparent shadow-none",
                    headerTitle: "text-white text-2xl font-bold",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton:
                      "bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300",
                    socialButtonsBlockButtonText: "text-white font-medium",
                    formButtonPrimary:
                      "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg",
                    formFieldInput:
                      "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500/20",
                    formFieldLabel: "text-gray-300 font-medium",
                    footerActionLink:
                      "text-red-400 hover:text-red-300 font-medium transition-colors",
                    identityPreviewText: "text-gray-300",
                    identityPreviewEditButton:
                      "text-red-400 hover:text-red-300",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
