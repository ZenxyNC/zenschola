import { useState, useRef, useEffect } from "react";
import { HiOutlineDotsVertical, HiOutlinePencil, HiOutlineTrash, HiOutlineGlobeAlt } from "react-icons/hi";
import { useClickOutside } from "react-haiku";
import { Link } from "react-router-dom";

export default function StudyUtilitiesApp({ softwareName, softwareUrl, id, settingsConfig, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isMenuOpen]);

  // Empty function: handle edit logic
  function handleEdit(e) {
    e?.preventDefault();
    e?.stopPropagation();
    setIsMenuOpen(false);
    if (onEdit) {
      onEdit();
    }
    // Handle edit logic here
  }

  // Empty function: handle delete logic
  function handleDelete(e) {
    e?.preventDefault();
    e?.stopPropagation();
    setIsMenuOpen(false);
    if (onDelete) {
      onDelete();
    }
    // Handle delete logic here
  }

  // Get favicon of the url
  function getIcon() {
    try {
      if (softwareUrl.includes(".unika.ac.id")) {
        const faviconUrl = `https://www.google.com/s2/favicons?domain=cyber.unika.ac.id&sz=128`;
        return <img src={faviconUrl} alt="favicon" className='aspect-auto w-full rounded-md' />;
      } else {
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(softwareUrl).hostname}&sz=128`;
        return <img src={faviconUrl} alt="favicon" className='aspect-auto w-full rounded-md' />;
      }
    } catch (err) {
      return <HiOutlineGlobeAlt size={48} className="text-text-sec" />;
    }
  }

  function sanitizeUrl(url) {
    if (url.includes("https://")) {
      return url.replace("https://", "")
    } else if (url.includes("http://")) {
      return url.replace("http://", "")
    } else {
      return url
    }
  }

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setIsMenuOpen(true);
      }}
      className="
        relative w-full h-35 bg-secondary rounded-independent border border-border transition-all duration-200 ease-in-out hover:scale-102 active:scale-98 cursor-pointer group
      "
    >
      <a
        href={softwareUrl}
        target="_blank"
        className="w-full h-full flex flex-col justify-center items-center gap-1"
      >
        <div className="p-2 border border-border bg-[#F5F5F5] rounded-xl w-12 h-12 flex items-center justify-center transition-all duration-200 ease-in-out group-hover:shadow-[0_0_28px_-6px_var(--color-text-sec)]">
          {getIcon()}
        </div>
        <div className='text-center w-max flex flex-col'>
          <span className="text-base text-text-pri font-semibold">{softwareName}</span>
          <span className="text-sm text-text-sec font-normal max-w-full truncate">{sanitizeUrl(softwareUrl)}</span>
        </div>
      </a>

      {/* Context Menu Trigger & Pop-up */}
      <div
        ref={menuRef}
        className="absolute top-2 right-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="More options"
          aria-expanded={isMenuOpen}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          className="p-1.5 rounded-2xl bg-secondary text-text-sec transition-all duration-200 ease-in-out hover:bg-primary hover:text-text-pri hover:scale-110 active:scale-95 cursor-pointer"
        >
          <HiOutlineDotsVertical size={18} />
        </button>

        {isMenuOpen && (
          <div
            className={`absolute right-0 top-full mt-1.5 w-32 p-2 transition-all duration-200 ease-in-out border border-border rounded-xl shadow-lg flex flex-col z-30 overflow-hidden ${settingsConfig.advancedVisual ? "bg-primary/60 backdrop-blur-lg" : "bg-secondary"}`}
          >
            <Link
              to={`?id=${id}#edit-study-utility`}
              role="button"
              type="button"
              className="w-full h-8 px-3 py-1.5 text-left text-sm font-medium text-text-pri rounded-md hover:bg-primary/50 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <HiOutlinePencil size={16} className="text-text-sec" />
              <span>Edit</span>
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full h-8 px-3 py-1.5 text-left text-sm font-medium text-danger rounded-md hover:bg-danger/10 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <HiOutlineTrash size={16} className="text-danger" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}