import { useMemo } from "react";

export default function Greeting({ username = "Someone" }) {
  function getTimeOfDay() {
    const hour = new Date().getHours()
    if (hour >= 4 && hour < 10) return "morning"
    if (hour >= 10 && hour < 15) return "afternoon"
    if (hour >= 15 && hour < 19) return "evening"
    if (hour >= 19 && hour < 22) return "night"
    return "midnight" // 0-4
  }

  function getGreeting(username) {
    const templates = {
      morning: [
        `Good morning, ${username}.`,
        `Nice to see you, ${username}.`,
        `Slept well, ${username}?`,
        `Ready to learn, ${username}?`,
        `Fresh start, ${username}.`,
        `Good luck in class, ${username}.`,
        `Coffee first, ${username}?`,
        `Rise and read.`,
        `New day, new notes.`,
        `Small steps count.`
      ],
      afternoon: [
        `Good afternoon, ${username}.`,
        `Everything's okay, ${username}?`,
        `How's class, ${username}?`,
        `Keep it up, ${username}.`,
        `Quick break, ${username}?`,
        `You've got this, ${username}.`,
        `Library time, ${username}?`,
        `Halfway there.`,
        `Notes coming along?`,
        `Progress, not perfection.`
      ],
      evening: [
        `Good evening, ${username}.`,
        `How was class, ${username}?`,
        `Nice work today, ${username}.`,
        `Time to review, ${username}?`,
        `Take a breather, ${username}.`,
        `One more page, ${username}?`,
        `Winding down, ${username}?`,
        `Day's almost done.`,
        `Tea and textbooks?`,
        `Easy does it.`
      ],
      night: [
        `Still studying, ${username}?`,
        `Hanging in there, ${username}?`,
        `Take your time, ${username}.`,
        `Nice focus, ${username}.`,
        `Stretch break, ${username}?`,
        `Almost there, ${username}.`,
        `Save your notes, ${username}.`,
        `Night owl tonight?`,
        `One page at a time.`,
        `Rest is part of learning.`
      ],
      midnight: [
        `Still up, ${username}?`,
        `Hope you're okay, ${username}.`,
        `Late-night reading, ${username}?`,
        `One last edit, ${username}?`,
        `Wrapping up, ${username}?`,
        `Be kind to yourself, ${username}.`,
        `Bed's calling, ${username}.`,
        `Sleep helps memory.`,
        `It can wait till morning.`,
        `Just you and the screen.`
      ]
    };

    const options = templates[getTimeOfDay()];
    return options[Math.floor(Math.random() * options.length)];
  }

  const greeting = useMemo(() => getGreeting(username), [username]);
  return greeting;
}
