import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PiggyBank, UsersThree, Robot, ChatCircleDots } from '@phosphor-icons/react';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>MinePenge.dk – Din venlige guide til økonomi</title>
        <meta name="description" content="Få styr på pengene med guides, AI-værktøjer og inspiration til unge og børnefamilier. Sjov, konkret og uden løftede pegefingre." />
      </Helmet>
      <section className="hero">
        <span className="hero-icon"><PiggyBank size={64} weight="duotone" /></span>
        <h1>Velkommen til MinePenge.dk</h1>
        <p>Din venlige, moderne guide til økonomi for unge og børnefamilier – uden løftede pegefingre.</p>
        <p style={{fontSize: '1.15rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>Få konkrete råd, inspiration og smarte AI-værktøjer, der gør økonomi nemt og relaterbart – uanset om du er ung, studerende eller har familie.</p>
        <Link to="/ai"><button>Prøv vores AI-værktøjer</button></Link>
      </section>
      <section className="value-section" style={{margin: '2rem auto', maxWidth: 900, background: 'var(--bg-card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '2rem 1.5rem'}}>
        <h2 style={{color: 'var(--accent)', marginBottom: '1rem'}}>Få mere ud af dine penge – allerede i dag</h2>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem'}}>
          <div style={{flex: 1, minWidth: 260}}>
            <h3 style={{color: 'var(--accent)'}}>Til unge & studerende</h3>
            <ul style={{textAlign: 'left', marginTop: 0}}>
              <li><b>Sådan får du SU'en til at række hele måneden:</b> 7 konkrete tips til at undgå at løbe tør sidst på måneden – uden at leve af pasta!</li>
              <li><b>10 billige madidéer til studerende:</b> Spar penge og spis lækkert – se vores bedste opskrifter til små budgetter.</li>
              <li><b>De bedste apps til at holde styr på pengene:</b> Få styr på økonomien med smarte, gratis apps.</li>
              <li><b>Hvad jeg ville ønske, jeg vidste om penge som 20-årig:</b> Læs ærlige erfaringer fra andre unge.</li>
            </ul>
          </div>
          <div style={{flex: 1, minWidth: 260}}>
            <h3 style={{color: 'var(--accent)'}}>Til børnefamilier</h3>
            <ul style={{textAlign: 'left', marginTop: 0}}>
              <li><b>De 7 bedste pengevaner til travle familier:</b> Gør økonomi til en leg for hele familien med disse simple vaner.</li>
              <li><b>Billige og sunde madplaner for hele familien:</b> Få inspiration til ugens mad – nemt, sundt og billigt.</li>
              <li><b>Sådan sparer du på børnetøjet:</b> Gode råd til at finde billigt og bæredygtigt tøj til børnene.</li>
              <li><b>Er det værd at investere, hvis man har børn?</b> Få svar og inspiration fra andre forældre.</li>
            </ul>
          </div>
        </div>
        <hr style={{margin: '2rem 0', border: 0, borderTop: '1px solid var(--accent2)'}} />
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem'}}>
          <div style={{flex: 1, minWidth: 260}}>
            <h3 style={{color: 'var(--accent)'}}>Prøv vores AI-værktøjer</h3>
            <ul style={{textAlign: 'left', marginTop: 0}}>
              <li><b>Mit penge-DNA:</b> Tag vores hurtige quiz og find ud af, hvilken økonomi-type du er – og få personlige råd med det samme!</li>
              <li><b>Spørg en spare-mor eller spare-studerende:</b> Stil dit spørgsmål og få svar fra vores AI, der bygger på rigtige brugeres bedste tips.</li>
              <li><b>Personlig spareplan:</b> Få 5 konkrete hverdagsvaner, der passer til dig – helt uden regneark.</li>
            </ul>
          </div>
          <div style={{flex: 1, minWidth: 260}}>
            <h3 style={{color: 'var(--accent)'}}>Community – deltag og bliv inspireret</h3>
            <ul style={{textAlign: 'left', marginTop: 0}}>
              <li><b>Ugens afstemning:</b> Hvad bruger du flest penge på? <i>Stem anonymt og se andres svar</i></li>
              <li><b>Mit bedste sparetip:</b> Del dit bedste tip – eller læs andres geniale idéer!</li>
              <li><b>Før og efter:</b> Min første investering – læs og del miniblogs fra andre brugere.</li>
              <li><b>Challenge:</b> Kan du spare 500 kr. på 7 dage? Deltag og følg andres fremskridt.</li>
            </ul>
          </div>
        </div>
        <blockquote style={{marginTop: '2rem', color: 'var(--text-muted)', fontStyle: 'italic'}}>Her er der ingen dumme spørgsmål – kun gode råd og ægte erfaringer. Vi hjælper dig med at få mere ud af dine penge, uden løftede pegefingre.</blockquote>
      </section>
      <div className="card-list">
        <div className="card">
          <UsersThree className="card-icon" weight="duotone" />
          <h2>For Unge</h2>
          <p>Tips, guides og inspiration til SU, hverdagsøkonomi og livet som studerende.</p>
          <Link to="/for-unge"><button>Se artikler</button></Link>
        </div>
        <div className="card">
          <Robot className="card-icon" weight="duotone" />
          <h2>AI & Værktøjer</h2>
          <p>Quiz, chatbots og personlig spareplan – få konkrete råd til din økonomi.</p>
          <Link to="/ai"><button>Prøv AI-funktioner</button></Link>
        </div>
        <div className="card">
          <ChatCircleDots className="card-icon" weight="duotone" />
          <h2>Community</h2>
          <p>Deltag i afstemninger, del tips og bliv inspireret af andre brugere.</p>
          <Link to="/community"><button>Gå til fællesskabet</button></Link>
        </div>
        <div className="card">
          <PiggyBank className="card-icon" weight="duotone" />
          <h2>For Familier</h2>
          <p>Praktiske råd, madplaner og smarte pengevaner til børnefamilier.</p>
          <Link to="/for-familier"><button>Se artikler</button></Link>
        </div>
      </div>
    </>
  );
} 