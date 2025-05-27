import { FileText } from "lucide-react";

const Loader = () => {
  return (
    <div className="loader">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-red-500 rounded-full animate-spin"></div>
        <FileText className="w-5 h-5 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-white font-medium">Loading document...</p>
        <p className="text-gray-400 text-sm">
          Preparing your collaborative workspace
        </p>
      </div>
    </div>
  );
};

export default Loader;
