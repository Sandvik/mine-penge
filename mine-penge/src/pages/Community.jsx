import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const pollOptions = [
  'Mad & dagligvarer',
  'Oplevelser & fritid',
  'Shopping',
  'Transport',
  'Andet'
];

const initialTips = [
  'Lav madplan og køb stort ind',
  'Sæt et fast beløb til fornøjelser hver måned',
  'Brug genbrug – både til dig selv og børnene',
];

function Poll() {
  const [votes, setVotes] = useState(Array(pollOptions.length).fill(0));
  const [voted, setVoted] = useState(null);

  function handleVote(idx) {
    if (voted !== null) return;
    const newVotes = [...votes];
    newVotes[idx]++;
    setVotes(newVotes);
    setVoted(idx);
  }

  return (
    <div className="card">
      <h3>Hvad bruger du mest penge på?</h3>
      {pollOptions.map((opt, i) => (
        <button key={i} onClick={() => handleVote(i)} disabled={voted!==null} style={{display:'block', margin:'0.5rem 0'}}>{opt}</button>
      ))}
      {voted!==null && (
        <div style={{marginTop:'1rem'}}>
          <b>Resultat:</b>
          <ul>
            {pollOptions.map((opt, i) => (
              <li key={i}>{opt}: {votes[i]} stemmer</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Tips() {
  const [tips, setTips] = useState(initialTips);
  const [input, setInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setTips([input, ...tips]);
    setInput('');
  }

  return (
    <div className="card" style={{marginTop:'1.5rem'}}>
      <h3>Mit bedste sparetip</h3>
      <form onSubmit={handleSubmit} style={{marginBottom:'1rem'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Skriv dit tip..." />
        <button type="submit">Del tip</button>
      </form>
      <ul>
        {tips.map((tip, i) => <li key={i}>{tip}</li>)}
      </ul>
    </div>
  );
}

export default function Community() {
  return (
    <div>
      <Helmet>
        <title>Community | MinePenge.dk</title>
        <meta name="description" content="Deltag i afstemninger, del dine bedste sparetips og bliv inspireret af andre. Fællesskab om økonomi – uden løftede pegefingre." />
      </Helmet>
      <h1>Community</h1>
      <Poll />
      <Tips />
      <section>
        <h2>Før og efter: Mit første investeringsvalg</h2>
        <p>Læs og del miniblogs om, hvordan det gik, da du (eller andre) investerede første gang.</p>
      </section>
      <section>
        <h2>Challenge: Spar 500 kr. på 7 dage</h2>
        <p>Vær med i udfordringen, del din status og vind små præmier!</p>
      </section>
      <section>
        <h2>Del din madplan</h2>
        <p>Upload eller skriv din madplan – inspirer andre og få feedback.</p>
      </section>
    </div>
  );
} 