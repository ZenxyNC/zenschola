import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Greeting from "./components/greeting";
import Quote from "./components/quote";
import BasicLineChart from "./components/line-graph";
import TodayAttendanceSchedule from "./components/today-schedule-element";
import ScheduleCard from "./components/schedule-card";
import LatticeLoader from "./components/lattice-loader";
import StudyUtilitiesApp from "./components/study-utilities-app";
import { IoAdd } from "react-icons/io5";
import ShinyText from "./components/shiny-text";
import ScratchPad from "./components/scratch-pad";
import { supabase } from "../supabase-client";

export default function Main({
  userData,
  setUserData,
  userInfo,
  isUserLoading,
  lectures,
  isLecturesLoading,
}) {
  const [settingsConfig, setSettingsConfig] = useState(() => {
    const localSettings = localStorage.getItem("zenschola-settings");
    if (localSettings) {
      try {
        const html = document.documentElement;
        html.classList.remove("dark", "light");
        html.classList.add(JSON.parse(localSettings).theme);
        return JSON.parse(localSettings);
      } catch (e) {
        console.error("Error parsing local settings:", e);
      }
    }
    return {
      theme: "light",
      advancedVisual: true,
    };
  });

  const [isSavingScratchPad, setIsSavingScratchPad] = useState(false);

  const location = useLocation();

  function getLectureSoftwareUrl(lectureCode) {
    try {
      const lectureSoftwareUrl = userData.lecturesSoftwareUrl.find((lec) => lec.lectureCode === lectureCode)?.url || userData.studySoftwareUrl;
      return lectureSoftwareUrl
    } catch (error) {
      console.error("Error fetching lecture software url:", error);
      return userData.studySoftwareUrl;
    }
  }

  async function deleteStudyUtility(id) {
    try {
      const updatedLectures = userData.studyUtilities.filter((lec) => lec.id !== id);
      setUserData({ ...userData, studyUtilities: updatedLectures });
      //Update Supabase
      const { data, error } = await supabase
        .from("users")
        .update({
          studyUtilities: updatedLectures
        })
        .eq("userid", userInfo.userid);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  }

  return (
    <>
      <main className="
        w-full h-max p-4 mt-15 flex flex-col gap-15
        lg:p-15 lg:pt-8
        xl:p-20 xl:pt-10
        2xl:p-70 2xl:pt-10
      ">
        <header>
          {/* Greeting */}
          <div className="text-4xl font-bold lg:text-5xl xl:text-[52px] transition-all duration-300 ease-in-out">
            <Greeting username={userInfo?.first_name} />
          </div>

          {/* Quote */}
          <div className="mt-2 text-base">
            <Quote />
          </div>
        </header>

        {/* Attendance Tracker and Today's Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-8 xl:gap-10">
          {/* Attendance Tracker */}
          <div>
            <h1>Attendance Tracker</h1>
            <div className="bg-secondary border border-border rounded-outer flex flex-col gap-5 h-max min-h-30 mt-3 p-4 pt-3 lg:p-5 lg:pt-3">
              <div className="flex flex-col gap-2">
                <h2>Today</h2>
                <div className="w-full h-max min-h-30 bg-primary rounded-inner border border-border p-4 flex flex-col gap-3">
                  {lectures?.length > 0 ? lectures.map((lec) => (
                    <TodayAttendanceSchedule
                      key={lec.lectureCode}
                      lectureCode={lec.lectureCode}
                      lectureName={lec.lectureName}
                      isAttended={userData?.attendedLectures ? userData.attendedLectures.includes(lec.lectureCode) : false}
                      startTime={lec.startTime}
                      endTime={lec.endTime}
                      major={lec.major}
                      userData={userData}
                    />
                  )) : isLecturesLoading ? (
                    <div className="w-full h-full min-h-30 flex items-center justify-center">
                      <LatticeLoader
                        status="working"
                        label="Loading"
                        doneLabel="Done in"
                        errorLabel="Failed to fetch schedule."
                        pattern="arrow"
                        grid={3}
                        shape="round"
                        doneColor="#22c55e"
                        errorColor="#ef4444"
                        cellSize={5}
                        gap={2}
                        fontSize={14}
                        step={90}
                        idleOpacity={0.15}
                        glow={true}
                        glowColor="var(--color-text-pri)"
                        showTimer
                        color="var(--color-text-pri)"
                      />
                    </div>
                  ) : (
                    <p className="text-text-sec">Wind down, no lectures today.</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2>Overall</h2>
                <div className="w-full h-max pb-10 lg:pb-0 min-h-30 overflow-x-auto bg-primary rounded-inner border border-border">
                  <BasicLineChart
                    settingsConfig={settingsConfig}
                    attendanceHistory={userData?.attendanceHistory}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div>
            <h1>Today's Schedule</h1>
            <div className="mt-3 flex flex-col gap-5 h-max">
              {lectures?.length > 0 ? lectures.map((lec) => (
                <ScheduleCard
                  key={lec.lectureCode}
                  lectureCode={lec.lectureCode}
                  lectureName={lec.lectureName}
                  startTime={lec.startTime}
                  endTime={lec.endTime}
                  room={lec.room}
                  lecturer={lec.lecturer}
                  major={lec.major}
                  cyberUrl={lec.cyberUrl}
                  lectureSoftwareName={userData?.studySoftwareName}
                  lectureSoftwareUrl={getLectureSoftwareUrl(lec.lectureCode)}
                  dbAttendedLectures={userData?.attendedLectures ? userData.attendedLectures : []}
                  userData={userData}
                  setUserData={setUserData}
                />
              )) : isLecturesLoading ? (
                <div className="w-full h-full min-h-30 flex items-center justify-center">
                  <LatticeLoader
                    status="working"
                    label="Loading"
                    doneLabel="Done in"
                    errorLabel="Failed to fetch schedule."
                    pattern="arrow"
                    grid={3}
                    shape="round"
                    doneColor="#22c55e"
                    errorColor="#ef4444"
                    cellSize={5}
                    gap={2}
                    fontSize={14}
                    step={90}
                    idleOpacity={0.15}
                    glow={true}
                    glowColor="var(--color-text-pri)"
                    showTimer
                    color="var(--color-text-pri)"
                  />
                </div>
              ) : (
                <p className="text-text-sec">Wind down, no lectures today.</p>
              )}
            </div>
          </div>
        </div>

        {/* Study Utilities */}
        <div className="flex flex-col gap-4">
          <h1>Study Utilities</h1>
          <div className="w-full h-max flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-8 xl:gap-10">
            <div className="
              w-full h-max grid grid-cols-2 gap-4
              lg:gap-5
              xl:grid-cols-3
            ">
              {userData?.studyUtilities ? userData.studyUtilities.map((m) => (
                <StudyUtilitiesApp
                  key={m.id}
                  softwareName={m.name}
                  softwareUrl={m.url}
                  settingsConfig={settingsConfig}
                  id={m.id}
                  onDelete={() => deleteStudyUtility(m.id)}
                />
              )) : isUserLoading && (
                <div className="w-full h-full min-h-30 flex items-center justify-center">
                  <LatticeLoader
                    status="working"
                    label="Loading"
                    doneLabel="Done in"
                    errorLabel="Failed to fetch schedule."
                    pattern="arrow"
                    grid={3}
                    shape="round"
                    doneColor="#22c55e"
                    errorColor="#ef4444"
                    cellSize={5}
                    gap={2}
                    fontSize={14}
                    step={90}
                    idleOpacity={0.15}
                    glow={true}
                    glowColor="var(--color-text-pri)"
                    showTimer
                    color="var(--color-text-pri)"
                  />
                </div>
              )}

              {/* Add new study utilities */}
              <Link
                to="#add-study-utility"
                role="button"
                className={`
                  w-full h-35 bg-transparent rounded-independent border-2 border-dashed border-border text-border transition-all duration-200 ease-in-out hover:border-text-pri/40 hover:text-text-pri/40 hover:scale-102 active:scale-98
                  flex flex-col gap-1 items-center justify-center cursor-pointer opacity-0
                  ${!isUserLoading && "opacity-100 pointer-events-auto"
                  }
                `}
              >
                <IoAdd size={32} className="transition-all duration-200 ease-in-out" />
              </Link>
            </div>

            {/* Scratch Pad */}
            <div className="w-full h-max min-h-60 bg-secondary rounded-outer border border-border p-4 pt-3 xl:p-5 xl:pt-4">
              {/* Header */}
              <div className="flex items-center justify-between px-2">
                <h2>Scratch Pad</h2>
                {isSavingScratchPad ? (
                  <ShinyText
                    text="Saving..."
                    speed={1.5}
                    delay={0.3}
                    color="var(--color-text-sec)"
                    shineColor="var(--color-text-pri)"
                    spread={120}
                    direction="left"
                    yoyo={false}
                    pauseOnHover={false}
                    disabled={false}
                  />
                ) : (
                  <span className="text-text-sec">
                    Saved
                  </span>
                )
                }
              </div>

              <div className="w-full h-px bg-border rounded-full mt-1 mb-3" />

              {/* Content */}
              <ScratchPad
                isSavingScratchPad={isSavingScratchPad}
                setIsSavingScratchPad={setIsSavingScratchPad}
                scratchPads={userData?.scratchPad}
                userid={userData?.userid}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
