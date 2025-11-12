import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { useTheme } from "../context/ThemeContext"; // ✅ Add this later if you have theme support
// import socket from "../hooks/useSocket";

const GetStarted = () => {
  const navigate = useNavigate();

  // const { darkMode, setDarkMode } = useTheme(); // Uncomment when useTheme exists

  // useEffect(() => {
  //   document.title = "Welcome to Zordly";
  //   socket.connect();
  // }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div className="text-center max-w-2xl w-full">
        <h2 className="text-3xl font-semibold mb-7">
          Welcome Get Started
          <br />
          <span className="text-blue-600 font-bold dark:text-blue-400">
            This is template Project
          </span>
        </h2>

        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
          Template Project
        </p>

        {/* Example button for future navigation */}
        {/* <button 
          onClick={() => navigate('/login')} 
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          Get Started
        </button> */}
      </div>
    </div>
  );
};

export default GetStarted;
