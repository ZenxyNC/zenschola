import { useMemo } from "react";

export default function Greeting({ username = "Someone" }) {
  const current = new Date();

  function getTimeOfDay() {
    const hour = current.getHours()
    if (hour >= 4 && hour < 10) return "morning"
    if (hour >= 10 && hour < 15) return "afternoon"
    if (hour >= 15 && hour < 19) return "evening"
    if (hour >= 19 && hour < 22) return "night"
    return "midnight" // 0-4
  }

  function getGreeting(username) {
    const weekdayTemplates = {
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
        `One last edit, ${username}?`,
        `Be kind to yourself, ${username}.`,
        `Bed's calling, ${username}.`,
        `Sleep helps memory.`,
        `It can wait 'till morning.`,
        `It's ${current.getHours()}:${current.getMinutes()}, ${username}.`
      ]
    };

    const weekendTemplates = {
      morning: [
        `Happy weekend, ${username}.`,
        `No alarm today, ${username}?`,
        `Slow morning, ${username}.`,
        `Weekend mode on, ${username}.`,
        `Breakfast first, ${username}?`,
        `Good morning, ${username}.`,
        `Nothing urgent today.`,
        `Sleep in, no guilt.`,
        `Fresh weekend ahead.`,
        `Pick one fun thing today.`
      ],
      afternoon: [
        `Good afternoon, ${username}.`,
        `Enjoying the weekend, ${username}?`,
        `Side project time, ${username}?`,
        `Go touch some grass, ${username}.`,
        `Lazy afternoon, ${username}?`,
        `Take it easy, ${username}.`,
        `Snack break, ${username}?`,
        `No deadlines right now.`,
        `Nap is a valid plan.`,
        `Do something just for fun.`
      ],
      evening: [
        `Good evening, ${username}.`,
        `How was your day, ${username}?`,
        `Nice weekend so far, ${username}?`,
        `Dinner plans, ${username}?`,
        `Time to unwind, ${username}.`,
        `Movie or game tonight, ${username}?`,
        `Relax, you earned it.`,
        `Weekend vibes only.`,
        `Maybe plan the week, lightly.`,
        `Easy evening ahead.`
      ],
      night: [
        `Weekend night, ${username}.`,
        `Still up, ${username}? It's the weekend.`,
        `Late-night project, ${username}?`,
        `Enjoy the quiet, ${username}.`,
        `One more episode, ${username}?`,
        `No rush tonight, ${username}.`,
        `Recharge well, ${username}.`,
        `Night owl mode.`,
        `Tomorrow is still free.`,
        `Rest is productive too.`
      ],
      midnight: [
        `Still awake, ${username}?`,
        `Weekend or not, sleep matters.`,
        `Don't forget to rest, ${username}.`,
        `Last task, then bed, ${username}?`,
        `Be kind to yourself, ${username}.`,
        `Tomorrow can wait.`,
        `Bed's calling, ${username}.`
      ]
    }

    // Get day
    const day = current.getDay();
    var options;

    // Check if its weekend
    if (day == 0 || day == 6)  options = weekendTemplates[getTimeOfDay()];
    else options = weekdayTemplates[getTimeOfDay()];

    return options[Math.floor(Math.random() * options.length)];
  }

  const greeting = useMemo(() => getGreeting(username), [username]);
  return greeting;
}
