import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { usePreventBodyScroll, useClickOutside } from 'react-haiku';
import { supabase } from '../../../supabase-client';
import { apiHitCounter } from '../../../functions';

export default function EditStudyUtility({ userData, setUserData }) {
  const { isScrollLocked, toggleScrollLock } = usePreventBodyScroll();
  const [searchParams] = useSearchParams();
  const utilityId = searchParams.get("id");
  const navigate = useNavigate();
  const location = useLocation();
  const [utilityDetails, setUtilityDetails] = useState({
    name: "",
    url: "",
  });
  const clickOutsideRef = useRef(null);
  const emptyRef = useRef(null);
  useClickOutside(clickOutsideRef, closeModal);

  function findUtilityById(key, utilityID) {
    const studyUtilities = userData?.studyUtilities.find(ut => ut.id === utilityID);
    const targetUtility = studyUtilities?.[key]
    return targetUtility;
  }

  function closeModal() {
    setUtilityDetails({
      name: "",
      url: ""
    });
    navigate(location.pathname);
  }

  useEffect(() => {
    if (location.hash == "#edit-study-utility") {
      setUtilityDetails({
        name: findUtilityById("name", utilityId),
        url: findUtilityById("url", utilityId),
      });
      if (!isScrollLocked) {
        toggleScrollLock();
      }
    } else {
      if (isScrollLocked) {
        toggleScrollLock();
      }
    }
  }, [location.hash]);

  function handleChange(event) {
    setUtilityDetails({
      ...utilityDetails,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Replace the matching entry by id — do NOT push a new one
    const updatedStudyUtilities = userData.studyUtilities.map((ut) =>
      ut.id === utilityId
        ? { ...ut, name: utilityDetails.name, url: utilityDetails.url }
        : ut
    );

    setUserData({
      ...userData,
      studyUtilities: updatedStudyUtilities,
    });

    // update in database
    try {
      const { error } = await supabase
        .from("users")
        .update({
          studyUtilities: updatedStudyUtilities
        })
        .eq("userid", userData.userid);
      if (error) throw error;
    } catch (error) {
      console.log("error: ", error);
    } finally {
      console.log(`API hit for Editing Study Utility. Total Hit count: ${apiHitCounter + 1}`);
    }

    closeModal();
  }

  return (
    <div className={`fixed w-dvw h-dvh top-0 flex items-center justify-center p-5 bg-[#000000]/16 z-999 transition-all duration-400 ease-in-out ${location.hash == "#edit-study-utility" ? "backdrop-blur-lg opacity-100" : "backdrop-blur-0 opacity-0 pointer-events-none"}`}>
      <div className={`
        w-full max-w-125 h-max bg-secondary border border-border rounded-outer p-4 pt-3 transition-all duration-400 ease-in-out ${location.hash == "#edit-study-utility" ? "scale-100 blur-none opacity-100" : "scale-70 blur-[32px] opacity-20"}
        lg:p-5 lg:pt-3
      `}
        ref={location.hash == "#edit-study-utility" ? clickOutsideRef : emptyRef}
      >
        <h2 className='mb-4'>Edit Study Utility</h2>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label className='font-medium text-text-sec'>Study Utility Name<span className='text-danger'>*</span></label>
            <input
              className='w-full h-10 rounded-xl bg-transparent border border-border px-3 focus:-outline-offset-1 focus:outline-1 focus:outline-accent focus:shadow-[0_0_6px_-1px_var(--color-accent)]'
              placeholder='ZenSchola'
              name='name'
              value={utilityDetails.name}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='font-medium text-text-sec'>Study Utility URL<span className='text-danger'>*</span></label>
            <input
              className='w-full h-10 rounded-xl bg-transparent border border-border px-3 focus:-outline-offset-1 focus:outline-1 focus:outline-accent focus:shadow-[0_0_6px_-1px_var(--color-accent)]'
              placeholder='https://zenschola.io'
              name='url'
              value={utilityDetails.url}
              onChange={handleChange}
            />
          </div>
          <div className='w-full flex gap-1 mt-6 justify-end'>
            <button type='button' onClick={closeModal} className='w-max h-max px-4 py-1 bg-secondary text-text-sec text-base! font-medium cursor-pointer'>Cancel</button>
            <button type='submit' className='w-max h-max px-4 py-1 rounded-xl bg-accent text-[#F5F5F5] text-base! font-medium cursor-pointer'>Done</button>
          </div>
        </form>
      </div>
    </div>
  )
}
