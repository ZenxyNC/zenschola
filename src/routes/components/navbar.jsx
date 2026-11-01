import { IoPerson } from "react-icons/io5";
import { useState, useRef } from "react";
import { useClickOutside } from "react-haiku";
import { Link, useNavigate } from "react-router-dom";
import ZenSchola from '../../assets/ZenSchola.png';

export default function Navbar({settingsConfig, setSettingsConfig}) {
  const navigate = useNavigate();
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const clickOutside = useRef(null);

  const closeMenu = () => setIsMenuOpened(false);

  useClickOutside(clickOutside, closeMenu);

  return (
    <>
      <div className={`w-full h-15 border-b border-border flex justify-between p-3 fixed z-990 top-0 left-0 transition-all duration-200 ease-in-out ${settingsConfig.advancedVisual ? "bg-primary/40 backdrop-blur-[32px]": "bg-primary backdrop-blur-none"}`}>
        {/* App Icon */}
        <a className="flex gap-2 h-full items-center w-max cursor-pointer" href="/zenschola/">
          <img src={ZenSchola} className="rounded-lg h-full"/>
          <span className="font-bold text-xl">ZenSchola</span>
        </a>

        {/* Profile */}
        <div
          className="flex gap-2 h-full items-center cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => setIsMenuOpened(!isMenuOpened)}
        >
          <span className="font-medium text-base text-text-pri">
            Lucas
          </span>
          <div className="h-full aspect-square rounded-full border border-border bg-secondary/60 flex justify-center items-center">
            <IoPerson size={20} />
          </div>
        </div>
      </div>

      {/* Menu Popup */}
      <div
        className={`
          ${isMenuOpened ? "opacity-100" : "opacity-0 pointer-events-none"}
          w-60 h-max fixed top-19 right-4 border border-border z-50 rounded-independent p-3 flex flex-col gap-3 ${settingsConfig.advancedVisual ? "bg-secondary/40 backdrop-blur-[32px]" : "bg-primary backdrop-blur-none"} transition-all duration-300 ease-in-out
        `}

        ref={clickOutside}
      >
        {/* Buttons: Student ID */}
        <div className="w-full h-max ">
          <Link
            to="#student-id"
            role="button" 
            onClick={closeMenu}
            className="cursor-pointer w-full h-11 hover:bg-primary rounded-xl transition-all duration-100 ease-in-out flex items-center justify-start px-3"
          >
            <span>Student ID</span>
          </Link>
        </div>
        {/* Buttons: Theme */}
        <div className="w-full h-max ">
          <button 
            onClick={() => navigate('/settings')}
            className="cursor-pointer w-full h-11 hover:bg-primary rounded-xl transition-all duration-100 ease-in-out flex items-center justify-start px-3"
          >
            <span>Settings</span>
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-border rounded-full"></div>

        {/* Account */}
        <div className="w-full h-11 bg-primary rounded-xl border border-text-pri/12 p-2 flex gap-3 items-center cursor-pointer">
          {/* Profile */}
          <div className="h-full aspect-square rounded-full border border-border bg-secondary/60 flex justify-center items-center">
            <IoPerson size={12} />
          </div>

          {/* Name and Email */}
          <span className="text-xs">Lucas Harel</span>
        </div>
      </div>
    </>

  )
}