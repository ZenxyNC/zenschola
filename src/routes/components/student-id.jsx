import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePreventBodyScroll, useClickOutside } from 'react-haiku';
import { useEffect, useRef } from 'react';
import { IoPerson } from "react-icons/io5";


export default function StudentID({ nim, username, major, settingsConfig }) {
  const { isScrollLocked, toggleScrollLock } = usePreventBodyScroll();
  const location = useLocation();
  const navigate = useNavigate();

  const clickOutsideRef = useRef(null);
  const emptyRef = useRef(null);

  function closeModal() {
    navigate(location.pathname);
  }

  useClickOutside(clickOutsideRef, closeModal)

  useEffect(() => {
    if (location.hash == "#student-id") {
      if (!isScrollLocked) {
        toggleScrollLock();
      }
    } else {
      if (isScrollLocked) {
        toggleScrollLock();
      }
    }
  }, [location.hash]);

  function translateMajor() {
    if(major == 'TI') return "Teknik Informatika"
    else if (major == "AI") return "Artificial Intelligence and Big Data"
  }
  return (
    <div className={`fixed w-dvw h-dvh top-0 flex items-center justify-center p-5 bg-[#000000]/16 z-999 transition-all duration-400 ease-in-out ${location.hash == "#student-id" ? `${settingsConfig.advancedVisual ? "backdrop-blur-lg opacity-100" : "backdrop-blur-xs opacity-100"}` : "backdrop-blur-0 opacity-0 pointer-events-none"}`}>
      <div className={`
        w-full max-w-125 h-max bg-secondary border border-border rounded-outer p-4 flex flex-col gap-5 transition-all duration-400 ease-in-out ${location.hash == "#student-id" ? "scale-100 blur-none opacity-100" : `${settingsConfig.advancedVisual ? "scale-70 blur-[32px] opacity-20" : "scale-70 blur-none opacity-20"}`}}
        lg:p-5
      `}
        ref={location.hash == "#student-id" ? clickOutsideRef : emptyRef}
      >
        {/* Identity */}
        <div className='w-full h-max flex gap-3'>
          <div className='aspect-square w-15 bg-primary border border-border rounded-xl flex items-center justify-center p-2.5'>
            <img src={`https://api.dicebear.com/10.x/identicon/svg?seed=${nim}`} />
          </div>

          <div className='flex flex-col'>
            <span className='font-bold text-2xl'>{username ? username : 'Someone'}</span>
            <span className='font-medium text-sm'>
              {translateMajor()}
            </span>
          </div>
        </div>

        {/* QR */}
        <div className='w-full h-max p-5 pb-4 bg-[#F5F5F5] rounded-xl gap-5 flex flex-col items-center border border-border'>
          <QRCodeSVG value={nim} size={200} bgColor='#F5F5F5' />
          {/* Details */}
          <div className='w-full h-max flex flex-col gap-3'>
            <div className='w-full h-0.5 bg-[#111111]/24 rounded-full'></div>
            <div className='flex justify-between items-center'>
              <span className='text-[#111111] font-bold text-base'>Student ID</span>
              <span className='text-[#111111]/40 font-semibold text-base'>{nim}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}