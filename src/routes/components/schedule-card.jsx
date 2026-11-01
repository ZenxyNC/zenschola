import { useEffect, useState } from "react"
import LectureCodeBadge from "./lecture-code-badge";
import { supabase } from "../../supabase-client";

import { FaLocationArrow } from "react-icons/fa6";
import { IoPerson, IoKeyOutline } from "react-icons/io5";
import { RxExternalLink } from "react-icons/rx";
import { TbClockUp } from "react-icons/tb"; // Upcoming icon
import { TbCircleCheck } from "react-icons/tb"; // Completed icon
import { TbClock } from "react-icons/tb"; // Ongoing icon

export default function ScheduleCard({
  lectureCode,
  lectureName,
  startTime,
  endTime,
  room,
  lecturer,
  major,
  lectureSoftwareName,
  lectureSoftwareUrl,
  cyberUrl,
  dbAttendedLectures,
  userData,
  setUserData
}) {
  const lectureMajor = major;
  const userMajor = userData.major;

  if(!lectureMajor[userMajor]) {
    return;
  }

  const [status, setStatus] = useState("upcoming");

  function getStatus() {
    const now = new Date();

    const [startHours, startMins] = startTime.split(":");
    const [endHours, endMins] = endTime.split(":");

    const lectureStart = new Date();
    lectureStart.setHours(parseInt(startHours), parseInt(startMins), 0, 0);

    const lectureEnd = new Date();
    lectureEnd.setHours(parseInt(endHours), parseInt(endMins), 0, 0);

    if (now >= lectureStart && now <= lectureEnd) {
      setStatus("ongoing");
    } else if (now < lectureStart) {
      setStatus("upcoming");
    } else {
      setStatus("completed");
    }
  }

  function timeBeforeNextLecture() {
    const now = new Date();
    const [startHours, startMins] = startTime.split(":");
    const lectureStart = new Date();
    lectureStart.setHours(parseInt(startHours), parseInt(startMins), 0, 0);
    const diff = lectureStart - now;
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) {
      return `${hours}hrs ${mins}mins`;
    } else {
      return `${mins} mins`;
    }
  }

  useEffect(() => {
    getStatus();
    const interval = setInterval(getStatus, 60000);
    return () => clearInterval(interval);
  }, [])

  async function handlePresent() {
    // Redirect user to present page
    window.location.href = "https://student.unika.ac.id/mahasiswa/presensionline";

    // Check if lectureCode already exists
    if (getIsAttended()) return;

    // Construct new attendanceHistory array
    const now = new Date().toISOString().slice(0, 10);
    var newAttendanceHistory = null;
    try {
      if (!userData.attendanceHistory[lectureCode].includes(now)) {
        newAttendanceHistory = {
          ...userData.attendanceHistory,
          [lectureCode]: [...userData.attendanceHistory[lectureCode], now],
        };
      }
    } catch (err) {
      newAttendanceHistory = {
        ...userData.attendanceHistory,
        [lectureCode]: [now],
      };
    }

    // Save to supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ attendedLectures: [...dbAttendedLectures, lectureCode], attendanceHistory: newAttendanceHistory ? newAttendanceHistory : userData.attendanceHistory })
        .eq('userid', userData?.userid)
        .select();
      if (error) throw error;

      if (data) console.log('Attended lectures updated:', data);

      if (data?.length === 1) {
        setUserData(data[0]);
      }
    } catch (error) {
      console.error('Error updating attended lectures:', error);
    }

  }

  function getIsAttended() {
    if (dbAttendedLectures?.includes(lectureCode)) return true;
    return false;
  }

  return (
    <div className={`relative w-full h-max min-h-10 bg-secondary border border-border rounded-independent p-4 xl:p-5 transition-all duration-200 ${status === "completed" ? "opacity-50 cursor-not-allowed" : ""}`}>
      {/* Status Badge */}
      <div className={`w-max h-max px-3 py-0.5 rounded-full absolute top-4 right-4 xl:top-5 xl:right-5 ${status === "ongoing" ? "bg-ongoing/20" :
        status === "upcoming" ? "bg-upcoming/20" :
          status === "completed" ? "bg-accent/20" : ""
        }`}>
        {status === "ongoing" && (
          <span className="text-ongoing font-medium text-sm">Ongoing</span>
        )}
        {status === "upcoming" && (
          <span className="text-upcoming font-medium text-sm">In {timeBeforeNextLecture()}</span>
        )}
        {status === "completed" && (
          <span className="text-accent font-medium text-sm">Completed</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="
          flex flex-col gap-2
          sm:flex-row sm:items-center sm:gap-4
          md:flex-col md:items-stretch md:gap-2
          xl:flex-row xl:items-center xl:gap-4
        ">
          {/* Time */}
          <div className="flex flex-col gap-0 text-left sm:text-right md:text-left xl:text-right">
            <span className="text-text-pri text-xl font-medium">{startTime.slice(0, 5)}</span>
            <span className="text-text-sec text-base font-medium">{endTime.slice(0, 5)}</span>
          </div>

          <div className="hidden sm:block md:hidden xl:block">
            {status === "ongoing" && (
              <TbClock size={24} color="var(--color-ongoing)" />
            )}
            {status === "upcoming" && (
              <TbClockUp size={24} color="var(--color-upcoming)" />
            )}
            {status === "completed" && (
              <TbCircleCheck size={24} color="var(--color-accent)" />
            )}
          </div>

          {/* Lecture Details */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <LectureCodeBadge lectureCode={lectureCode} className="dark:bg-primary!" />
              <span className="text-text-pri text-base font-bold max-w-[80%] truncate">{lectureName}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLocationArrow className="text-text-sec text-sm" />
              <span className="text-text-sec text-sm font-medium">{room}</span>
            </div>
            <div className="flex items-center gap-2">
              <IoPerson className="text-text-sec text-sm" />
              <span className="text-text-sec text-sm font-medium">{lecturer}</span>
            </div>
          </div>
        </div>


        {/* Lecture Tools */}
        {status === "ongoing" &&
          <>
            <div className="w-full h-px bg-border rounded-full my-1"></div>

            <div className="flex gap-3 flex-wrap">
              <button
                className={`w-max h-max px-3 py-1 rounded-lg border border-border/60 bg-primary transition-all duration-200 flex items-center justify-center gap-2 ${getIsAttended() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-103 active:scale-97"}`}
                onClick={handlePresent}
                disabled={getIsAttended()}
                title={getIsAttended() ? "You've already marked this lecture as attended" : "Present to this lecture"}
              >
                <IoKeyOutline size={16} color="var(--color-text-pri)" />
                <span className="text-text-pri font-medium text-sm">Present</span>
              </button>
              <a
                className="w-max h-max px-3 py-1 rounded-lg border border-border/60 bg-primary transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-103 active:scale-97"
                href={cyberUrl}
                target="_blank"
              >
                <RxExternalLink size={16} color="var(--color-text-pri)" />
                <span className="text-text-pri font-medium text-sm">Open in Cyber</span>
              </a>
              <a
                className="w-max h-max px-3 py-1 rounded-lg border border-border/60 bg-primary transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-103 active:scale-97"
                href={lectureSoftwareUrl}
                target="_blank"
              >
                <RxExternalLink size={16} color="var(--color-text-pri)" />
                <span className="text-text-pri font-medium text-sm">Open in {lectureSoftwareName}</span>
              </a>
            </div>
          </>
        }
      </div>
    </div>
  )
}