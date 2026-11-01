export default function LectureCodeBadge({ lectureCode, className = "" }) {
  
  return (
    <div className={`w-max h-max px-2 py-1 text-xs rounded-lg bg-text-pri/12 dark:bg-secondary text-text-pri font-semibold ${className}`}>
      <span>{lectureCode}</span>
    </div>
  )
}