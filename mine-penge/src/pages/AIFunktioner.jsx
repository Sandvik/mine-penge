import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const quizQuestions = [
  {
    question: 'Hvordan har du det med at lægge budget?',
    options: ['Elsker det', 'Gør det kun, hvis jeg skal', 'Hader det']
  },
  {
    question: 'Hvad bruger du flest penge på?',
    options: ['Mad', 'Oplevelser', 'Shopping']
  },
  {
    question: 'Hvis du får uventede penge, hvad gør du?',
    options: ['Sparer op', 'Køber noget jeg har ønsket mig', 'Bruger dem spontant']
  }
];

const results = [
  {
    type: 'Den ansvarlige',
    advice: 'Du har styr på tingene! Husk at forkæle dig selv lidt indimellem.'
  },
  {
    type: 'Den spontane',
    advice: 'Du elsker at leve i nuet. Prøv små, sjove sparemål!'
  },
  {
    type: 'Den udsatte',
    advice: 'Du gør dit bedste! Prøv at tage ét lille skridt ad gangen.'
  }
];

function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  function handleAnswer(idx) {
    const nextAnswers = [...answers, idx];
    setAnswers(nextAnswers);
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  }

  if (showResult) {
    // Simpel logik: vælg resultat baseret på flest valgte index
    const counts = [0,0,0];
    answers.forEach(i => counts[i]++);
    const maxIdx = counts.indexOf(Math.max(...counts));
    const result = results[maxIdx];
    return (
      <div className="card">
        <h3>Du er: {result.type}</h3>
        <p>{result.advice}</p>
        <button onClick={() => { setStep(0); setAnswers([]); setShowResult(false); }}>Prøv igen</button>
      </div>
    );
  }

  const q = quizQuestions[step];
  return (
    <div className="card">
      <h3>{q.question}</h3>
      {q.options.map((opt, i) => (
        <button key={i} onClick={() => handleAnswer(i)} style={{display:'block', margin:'0.5rem 0'}}>{opt}</button>
      ))}
    </div>
  );
}

function ChatMockup() {
  const [messages, setMessages] = useState([
    {from:'bot', text:'Hej! Stil mig et spørgsmål om at spare penge.'}
  ]);
  const [input, setInput] = useState('');

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, {from:'user', text:input}, {from:'bot', text:'Tak for dit spørgsmål! Her er et tip: Lav en madplan og køb stort ind én gang om ugen.'}]);
    setInput('');
  }

  return (
    <div className="card" style={{marginTop:'1.5rem'}}>
      <h3>Spørg en Spare-mor/Studerende</h3>
      <div style={{minHeight:'60px'}}>
        {messages.map((m,i) => (
          <div key={i} style={{textAlign: m.from==='user'?'right':'left', margin:'0.3rem 0'}}>
            <span style={{background:m.from==='user'?'#b2e5db':'#fff', padding:'0.4rem 0.7rem', borderRadius:'8px', display:'inline-block'}}>{m.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{marginTop:'0.5rem', display:'flex', gap:'0.5rem'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Skriv dit spørgsmål..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function AIFunktioner() {
  return (
    <div>
      <Helmet>
        <title>AI & Værktøjer | MinePenge.dk</title>
        <meta name="description" content="Prøv vores AI-quiz, chatbots og få en personlig spareplan. Få sjove, konkrete råd til din økonomi – uden løftede pegefingre." />
      </Helmet>
      <h1>AI & Værktøjer</h1>
      <section>
        <h2>Mit Penge-DNA (Quiz)</h2>
        <Quiz />
      </section>
      <section>
        <ChatMockup />
      </section>
      <section>
        <h2>Personlig Spareplan</h2>
        <div className="card">
          <p>Vælg din situation, og få konkrete forslag til hverdagsvaner – uden at skulle lave budget.</p>
          <ul>
            <li>Byt én cafékaffe om ugen ud med hjemmelavet – spar 100 kr./md.</li>
            <li>Lav madplan og køb stort ind én gang om ugen.</li>
            <li>Sæt et lille mål, fx at spare 200 kr. til en oplevelse.</li>
          </ul>
        </div>
      </section>
    </div>
  );
} 