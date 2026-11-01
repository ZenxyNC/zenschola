import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import ScratchBox from "./scratch-box";
import { v7 as randomUUID } from "uuid";

export default function ScratchPad({ isSavingScratchPad, setIsSavingScratchPad, scratchPads, userid }) {
  const [pads, setPads] = useState(scratchPads ?? []);
  const [focusPadId, setFocusPadId] = useState(null);

  useEffect(() => {
    if (scratchPads) setPads(scratchPads);
  }, [scratchPads]);

  function addNewPad() {
    // check if there's already blank pad
    const isFirstBlank = pads[0]?.content === "";

    if (isFirstBlank) {
      setFocusPadId(pads[0].id);
      return;
    }

    const id = randomUUID();
    setFocusPadId(id);
    setPads(prevPads => [{ id, content: "" }, ...prevPads]);
  }

  return (
    <div className="w-full h-max max-h-100 overflow-y-scroll flex flex-col gap-4 scrollbar-none px-px">
      <button
        onClick={() => addNewPad()}
        role="button"
        tabIndex={0}
        className='w-full min-h-15 bg-primary rounded-inner border-2 border-dashed border-border text-border transition-all duration-200 ease-in-out hover:border-text-sec hover:text-text-sec active:scale-99 flex flex-col gap-1 items-center justify-center'
      >
        <IoAdd size={24} color='var(--text-main)' />
      </button>
      {/* Mapping the Pads */}
      {pads.map(pad => (
        <ScratchBox
          key={pad.id}
          id={pad.id}
          content={pad.content}
          isSavingScratchPad={isSavingScratchPad}
          setIsSavingScratchPad={setIsSavingScratchPad}
          pads={pads}
          setPads={setPads}
          autoFocus={pad.id === focusPadId}
          userid={userid}
        />
      ))}
    </div>
  )
}