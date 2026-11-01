export default function Quote() {  
  function getQuote() {
    const quotes = [
      // Socrates
      { text: "The unexamined life is not worth living.", author: "Socrates" },
      { text: "True wisdom is in knowing you know nothing.", author: "Socrates" },
      { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "Socrates" },

      // Thomas Aquinas
      { text: "All men by nature desire to know.", author: "Thomas Aquinas" },
      { text: "The purpose of study is not merely to consume facts, but to seek understanding.", author: "Thomas Aquinas" },
      { text: "Teaching is not about transferring knowledge, but about encouraging the student to discover it within.", author: "Thomas Aquinas" },

      // Steve Jobs
      { text: "Everybody should learn to program a computer, because it teaches you how to think.", author: "Steve Jobs" },
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },

      // Bonus academic voices (optional layer)
      { text: "Imagination is more important than knowledge. For knowledge is limited, but imagination encircles the whole world.", author: "Albert Einstein" },
      { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" }
    ];

    const pick = quotes[Math.floor(Math.random() * quotes.length)];
    return {
      quote: pick.text,
      author: pick.author
    };
  }

  const quote = getQuote();

  return (
    <>
      <span className="text-text-sec font-bold">[{quote.author}]</span>
      <span className="text-text-sec font-medium italic"> "{quote.quote}"</span>
    </>
  )
}