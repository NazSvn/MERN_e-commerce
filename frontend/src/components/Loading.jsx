import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="relative">
        <div className="flex text-white">
          <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loading;
