import { FaSpinner } from "react-icons/fa";

const LoadingSkeleton = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div
        className="z-50 flex h-16 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800"
        aria-label="Global"
      ></div>
      <div className="mb-20 flex flex-1 items-center justify-center">
        <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
