import { useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import taskIcon from "@/assets/icons/list-icon.svg";
import boardIcon from "@/assets/icons/board-icon.svg";
import taskLogo from "@/assets/icons/task-icon2.svg";
import logoutIcon from "@/assets/icons/logout.svg";

interface HeaderProps {
  currentView: "list" | "board";
  setView: (view: "list" | "board") => void;
}

const Header = ({ currentView, setView }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="flex justify-between items-start sm:px-6 px-2 relative">
      <div>
        {/* App Logo */}
        <img src={taskLogo} alt="TaskLogo" className="w-[80%]" />

        {/* View toggle buttons */}
        <div className="gap-6 mt-8 hidden sm:flex">
          {[
            { label: "List", icon: taskIcon, value: "list" },
            { label: "Board", icon: boardIcon, value: "board" },
          ].map(({ label, icon, value }) => {
            const isActive = currentView === value;
            return (
              <button key={value} onClick={() => setView(value as "list" | "board")}>
                <span
                  className={`relative flex items-center gap-2 text-sm transition-all 
                    ${isActive ? "font-semibold text-black after:content-['']" : "text-slate-700 after:hidden"} 
                    after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[2px] after:bg-black`}
                >
                  <img src={icon} alt={`${label} icon`} className="inline-block" />
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Avatar and Logout Toggle */}
      <div className="flex flex-col items-end gap-1 relative">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLogout(!showLogout)}>
          <Avatar>
            <AvatarImage src={user?.photoURL || ""} alt="User avatar" />
            <AvatarFallback>
              {user?.displayName?.[0]?.toUpperCase() || <User size={16} />}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-[#00000099]">{user?.displayName}</span>
        </div>

        {/* Logout Button */}
        {showLogout && (
          <Button
            variant="outline"
            onClick={logout}
            className="flex justify-center items-center gap-1 bg-[#FFF9F9] border-[#7B198426] text-sm rounded-xl mt-1"
          >
            <img src={logoutIcon} alt="logoutIcon" /> Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
