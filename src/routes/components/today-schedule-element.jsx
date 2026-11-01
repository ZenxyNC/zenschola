import { TbAlertCircle, TbCircleCheck, TbClock, TbClockUp } from "react-icons/tb";
import LectureCodeBadge from "./lecture-code-badge";


export default function TodayAttendanceSchedule({
  lectureCode,
  lectureName,
  isAttended,
  startTime,
  endTime,
  major,
  userData
}) {
  const lectureMajor = major;
  const userMajor = userData.major;

  if (!lectureMajor[userMajor]) {
    return;
  }

  // Derive status directly — no useState to avoid setState-during-render bug
  function getStatus() {
    const now = new Date();
    const [startHour, startMin] = startTime.split(":");
    const [endHour, endMin] = endTime.split(":");
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(startHour), parseInt(startMin));
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(endHour), parseInt(endMin));

    if (now > end) return "finished";
    if (now >= start) return "ongoing";
    return "upcoming";
  }

  const status = getStatus();
  const isFinished = status === "finished";

  function getIcon() {
    if (isAttended) return <TbCircleCheck size={24} color="var(--color-accent)" />;
    if (status === "upcoming") return <TbClockUp size={22} color="var(--color-upcoming)" />;
    if (status === "ongoing") return <TbClock size={24} color="var(--color-ongoing)" />;
    return <TbAlertCircle size={24} color="var(--color-danger)" />;
  }

  return (
    <div className="w-full h-max flex gap-2 items-center">
      {getIcon()}
      <LectureCodeBadge lectureCode={lectureCode} />
      <span className={`${isFinished || isAttended ? "text-text-sec line-through decoration-1" : "text-text-pri"} max-w-full truncate`}>{lectureName}</span>
      <span className="text-text-sec text-sm ml-1">
        {isAttended ? "Attended" : isFinished && !isAttended ? "Missed" : ""}
      </span>
    </div>
  )
}