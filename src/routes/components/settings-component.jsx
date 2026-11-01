export default function SettingsComponent({ 
  title = "====== [!] Title Needed [!] ======",
  description,
  children
 }) {
  return (
    <div className="w-full h-max min-h-15 py-4 border-b border-border flex gap-6 justify-between items-center">
      
      {/* Title and description */}
      { title &&
        <div className="w-full h-max flex flex-col gap-1 text-clip">
          <span className="text-base font-normal text-text-pri">{title}</span>
          {description && <span className="text-sm font-normal text-text-sec">{description}</span>}
        </div>
      }

      {/* Children */}
      <div className="w-max max-w-60">
        {children}
      </div>
    </div>
  )
 }