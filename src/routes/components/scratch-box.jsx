import { HiOutlineClipboard, HiOutlineTrash, HiCheck } from "react-icons/hi";
import { useDebounce, useClipboard } from 'react-haiku';
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase-client";

export default function ScratchBox({ isSavingScratchPad, setIsSavingScratchPad, id, content, pads, setPads, autoFocus, userid }) {
  const textareaRef = useRef(null);
  const hasMounted = useRef(false);
  const [typedContent, setTypedContent] = useState(content);
  const debounce = useDebounce(typedContent, 1500);
  const clipboard = useClipboard({ timeout: 2000 });

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const OnType = (e) => {
    const filteredPads = pads.filter((pad) => pad.id !== id);
    setPads([{ id, content: e.target.value }, ...filteredPads]);
    setTypedContent(e.target.value);
    setIsSavingScratchPad(true);
  }

  async function savePads(newPads) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ scratchPad: newPads })
        .eq("userid", userid);
      if (error) throw error;
    } catch (error) {
      console.log("error: ", error)
    } finally {
      setIsSavingScratchPad(false);
    }
  }

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    savePads(pads);
  }, [debounce])

  function deletePad() {
    const filteredPads = pads.filter((pad) => pad.id !== id);
    setPads(filteredPads);
    savePads(filteredPads);
  }

  function copyPad(e) {
    e.preventDefault();
    clipboard.copy(typedContent);
  }

  return (
    <div className="relative h-max bg-primary rounded-inner border border-border flex flex-col gap-3 items-end p-3 pt-2 lg:p-4 lg:pt-3 has-focus:-outline-offset-1 has-focus:outline-1 has-focus:outline-accent has-focus:shadow-[0_0_6px_-1px_var(--color-accent)]">
      <span className="text-sm text-text-sec w-full text-left!">ID: {id}</span>
      <textarea
        ref={textareaRef}
        value={typedContent}
        placeholder="Texts or thoughts..."
        onChange={OnType}
        className="block w-full m-0! min-h-14 field-sizing-content font-normal text-text-pri resize-none outline-none"
      />

      <div className="w-max h-max flex items-center justify-center gap-3 bottom-3 right-3">
        {/* Copy button */}
        <button
          className="w-8 h-8 backdrop-blur-xs rounded-lg bg-secondary/40 text-text-pri transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-border"
          onClick={copyPad}
        >
          {clipboard.copied ? <HiCheck size={18} /> : <HiOutlineClipboard size={18} />}
        </button>

        {/* Trash Button */}
        <button
          className="w-8 h-8 backdrop-blur-xs rounded-lg bg-danger/8 text-danger transition-all duration-200 ease-in-out hover:bg-danger/24 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
          onClick={deletePad}
        >
          <HiOutlineTrash size={18} />
        </button>
      </div>
    </div>
  )
}