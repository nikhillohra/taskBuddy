import GoogleIcon from "@/assets/icons/googl.svg";
import {auth, provider} from "@/services/firebase-config"
import { signInWithPopup } from "firebase/auth";


export default function GoogleSignInButton() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Redirect to dashboard (task list page)
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-3 px-6 py-3 bg-black text-white sm:text-lg text-sm rounded-2xl shadow hover:bg-gray-900 transition"
    >
       <img src={GoogleIcon} alt="Google Icon" className="w-6 h-6 bg-black rounded-full bg-blend-multiply" />
      Continue with Google
    </button>
  );
}
