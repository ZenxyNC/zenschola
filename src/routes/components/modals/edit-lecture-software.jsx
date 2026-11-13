import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { usePreventBodyScroll, useClickOutside } from 'react-haiku';
import { supabase } from '../../../supabase-client';
import { apiHitCounter } from '../../../functions';
import LectureCodeBadge from '../lecture-code-badge';

export default function EditLectureSoftware({ userData, setUserData, lectures, settingsConfig }) {
  const { isScrollLocked, toggleScrollLock } = usePreventBodyScroll();
  const [searchParams] = useSearchParams();
  const lectureCode = searchParams.get("lectureCode");
  const navigate = useNavigate();
  const location = useLocation();

  const [softwareDetails, setSoftwareDetails] = useState({
    name: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const clickOutsideRef = useRef(null);
  const emptyRef = useRef(null);
  useClickOutside(clickOutsideRef, closeModal);

  /** Find the existing entry in lecturesSoftwareUrl by lectureCode */
  function findByLectureCode(code) {
    return userData?.lecturesSoftwareUrl?.find((entry) => entry.lectureCode === code) ?? null;
  }

  function closeModal() {
    setSoftwareDetails({ name: "", url: "" });
    navigate(location.pathname);
  }

  useEffect(() => {
    if (location.hash === "#edit-lecture-software") {
      const existing = findByLectureCode(lectureCode);
      setSoftwareDetails({
        name: existing?.name ?? "",
        url: existing?.url ?? "",
      });
      if (!isScrollLocked) toggleScrollLock();
    } else {
      if (isScrollLocked) toggleScrollLock();
    }
  }, [location.hash, lectureCode]);

  function handleChange(event) {
    setSoftwareDetails({
      ...softwareDetails,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    // Build the updated lecturesSoftwareUrl array:
    // Replace the entry with matching lectureCode, or append if it doesn't exist yet.
    const prevList = Array.isArray(userData?.lecturesSoftwareUrl)
      ? [...userData.lecturesSoftwareUrl]
      : [];

    const existingIndex = prevList.findIndex((entry) => entry.lectureCode === lectureCode);
    const updatedEntry = {
      lectureCode,
      name: softwareDetails.name,
      url: softwareDetails.url,
    };

    if (existingIndex !== -1) {
      prevList[existingIndex] = updatedEntry;
    } else {
      prevList.push(updatedEntry);
    }

    // Optimistic UI update
    setUserData({
      ...userData,
      lecturesSoftwareUrl: prevList,
    });

    // Persist to Supabase
    try {
      const { error } = await supabase
        .from("users")
        .update({ lecturesSoftwareUrl: prevList })
        .eq("userid", userData.userid);
       if (error) throw error;
    } catch (error) {
      console.error("Error updating lecture software:", error);
      // Roll back optimistic update on failure
      setUserData(userData);
    } finally {
      setIsLoading(false);
      console.log(`API hit for Editing Lecture Software. Total Hit count: ${apiHitCounter + 1}`);
    }

    closeModal();
  }

  const isOpen = location.hash === "#edit-lecture-software";

  useEffect(() => {
    console.log(lectures)
  }, [])

  return (
    <div className={`fixed w-dvw h-dvh top-0 flex items-center justify-center p-5 bg-[#000000]/16 z-999 transition-all duration-400 ease-in-out ${isOpen ? `${settingsConfig.advancedVisual ? "backdrop-blur-lg opacity-100" : "backdrop-blur-xs opacity-100"}` : "backdrop-blur-0 opacity-0 pointer-events-none"}`}>
      <div
        className={`w-full max-w-125 h-max bg-secondary border border-border rounded-outer p-4 pt-3 transition-all duration-400 ease-in-out ${isOpen ? "scale-100 blur-none opacity-100" : `${settingsConfig.advancedVisual ? "scale-70 blur-[32px] opacity-20" : "scale-70 blur-none opacity-20"}`} lg:p-5 lg:pt-3`}
        ref={isOpen ? clickOutsideRef : emptyRef}
      >
        <h2 className='mb-3'>Edit Lecture Software</h2>
        <div className='text-text-sec text-sm mb-4 flex items-center gap-2 max-w-full truncate'>
          <LectureCodeBadge lectureCode={lectureCode} className='dark:bg-primary!'/> {lectures?.find((lec) => lec.lectureCode === lectureCode)?.lectureName}
        </div>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label className='font-medium text-text-sec'>
              Software Name<span className='text-danger'>*</span>
            </label>
            <input
              className='w-full h-10 rounded-xl bg-transparent border border-border px-3 focus:-outline-offset-1 focus:outline-1 focus:outline-accent focus:shadow-[0_0_6px_-1px_var(--color-accent)]'
              placeholder='Notion'
              name='name'
              value={softwareDetails.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='font-medium text-text-sec'>
              Software URL<span className='text-danger'>*</span>
            </label>
            <input
              className='w-full h-10 rounded-xl bg-transparent border border-border px-3 focus:-outline-offset-1 focus:outline-1 focus:outline-accent focus:shadow-[0_0_6px_-1px_var(--color-accent)]'
              placeholder='https://notion.so'
              name='url'
              value={softwareDetails.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className='w-full flex gap-1 mt-6 justify-end'>
            <button
              type='button'
              onClick={closeModal}
              className='w-max h-max px-4 py-1 bg-secondary text-text-sec text-base! font-medium cursor-pointer'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='w-max h-max px-4 py-1 rounded-xl bg-accent text-[#F5F5F5] text-base! font-medium cursor-pointer disabled:opacity-60'
            >
              {isLoading ? "Saving..." : "Done"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
