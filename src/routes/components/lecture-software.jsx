import React from 'react';
import LectureCodeBadge from './lecture-code-badge';
import { Link } from 'react-router-dom';

export default function LectureSoftwareUrl({ lectureCode, lectureName, softwareName, softwareUrl }) {
  return (
    <Link to={`?lectureCode=${lectureCode}#edit-lecture-software`} className='w-full h-max bg-secondary border border-border rounded-independent p-3 flex flex-col gap-5 cursor-pointer transition-all duration-400 ease-[cubic-bezier(.40,2,.41,.8)] hover:scale-102 hover:shadow-shadow-sm active:scale-98'>
      <div className='flex flex-col gap-2'>
        <LectureCodeBadge lectureCode={lectureCode} className='dark:bg-primary!'/>
        <span className='w-max max-w-full text-wrap text-text-pri'>{lectureName}</span>
      </div>

      <div className='flex flex-col gap-1'>
        <span className='w-max max-w-full truncate text-text-pri'>{softwareName ? softwareName : "No name is set."}</span>
        <span className='w-max max-w-full truncate text-sm text-text-sec'>{softwareUrl ? softwareUrl : "No URL is set."}</span>
      </div>
    </Link>
  );
}