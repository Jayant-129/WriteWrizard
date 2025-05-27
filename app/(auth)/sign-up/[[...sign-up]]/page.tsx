import { SignUp } from "@clerk/nextjs";
import { FileText, Users, Sparkles, Zap, Shield } from "lucide-react";
import Logo from "@/components/Logo";

const SignUpPage = () => {
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
        {/* Left Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <Logo size="md" showText={true} className="justify-center mb-4" />
              <p className="text-gray-400">
                Join thousands of writers and teams.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-2xl">
              <SignUp
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
                    formFieldInputShowPasswordButton:
                      "text-gray-400 hover:text-white",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Branding & Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
          <div className="max-w-lg text-center space-y-8">
            {/* Logo and Title */}
            <div className="space-y-4">
              <Logo size="lg" showText={true} className="justify-center mb-6" />
              <p className="text-xl text-gray-300 leading-relaxed">
                Start your journey with the most powerful collaborative writing
                platform
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Lightning Fast</h3>
                  <p className="text-gray-400 text-sm">
                    Write and collaborate without any lag
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Secure & Private</h3>
                  <p className="text-gray-400 text-sm">
                    Your documents are encrypted and protected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">AI-Enhanced</h3>
                  <p className="text-gray-400 text-sm">
                    Smart suggestions and writing assistance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Team Friendly</h3>
                  <p className="text-gray-400 text-sm">
                    Perfect for teams of any size
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm mb-3">
                Trusted by writers worldwide
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>🚀 Fast & Reliable</span>
                <span>•</span>
                <span>🔒 100% Secure</span>
                <span>•</span>
                <span>✨ AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
