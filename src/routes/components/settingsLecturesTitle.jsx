import React from 'react';
import LectureCodeBadge from './lecture-code-badge';

export default function SettingsLecturesTitle({ lectureCode, lectureName, lectureMajor, userMajor }) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-3 items-center'>
        <LectureCodeBadge lectureCode={lectureCode} />
        {lectureName}
      </div>
      {!lectureMajor[userMajor] && <span className='text-danger'>You're not enrolled in this lecture.</span>}
    </div>
  );
}