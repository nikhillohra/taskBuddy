import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";
import bgImage from "@/assets/bg-rings.png";
import taskViewImage from "@/assets/task-view.svg";
import taskIcon from "@/assets/icons/task-icon.svg";

/*** Login Page*/
export default function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#FFF9F9] relative bg-no-repeat bg-right-top"
      // Background Image
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Main content container*/}
      <div className="relative z-10 flex flex-col gap-10 md:flex-row w-full px-6 md:px-0">
        
        {/* Left Side */}
        <div className="flex-1 flex flex-col max-w-[35rem] gap-4 sm:p-20 sm:items-start items-center justify-center">
          <span>
            <img src={taskIcon} alt="task-logo" />
          </span>
          
          {/* Promotional text */}
          <p className="text-gray-700 text-center sm:text-start text-sm font-semibold sm:max-w-2xl w-full">
            Streamline your workflow and track progress effortlessly with our
            all-in-one task management app.
          </p>

          {/* Google Sign-In Button */}
          <GoogleSignInButton />
        </div>

        {/* Right Side */}
        <div className="flex-1 hidden md:flex justify-end items-center py-10">
          <img
            src={taskViewImage}
            alt="Task Board Preview"
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
