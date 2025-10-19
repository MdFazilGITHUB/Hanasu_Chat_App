import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import appLogo from "../public/hanasu_neon_favicon.png";

const btnStyle = `btn btn-sm gap-2 rounded-lg shadow-none bg-[#151D24] hover:bg-gray-700 text-white transition-colors border-0 text-center`;

const NavBar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="bg-base-100/80 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="w-auto mx-auto px-4 h-20">
        <div className="flex items-center justify-between h-full">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <img src={appLogo} className="rounded-lg" />
            </div>
            <h1 className=" text-md font-bold tracking-wider">
              HANASU
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 rounded-lg shadow-none transition-colors border-0 text-center"
            >
              <Settings className="size-4" />
              <span className="sm-inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link className="btn btn-sm gap-2 rounded-lg shadow-none transition-colors border-0 text-center" to={"/profile"}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button className={`flex items-center btn btn-sm gap-2 rounded-lg shadow-none  transition-colors border-0 text-center `} onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
