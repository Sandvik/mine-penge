import React from 'react';
import { Helmet } from 'react-helmet-async';

const artikler = [
  "De 7 bedste pengevaner til travle børnefamilier",
  "Billige og sunde madplaner for hele familien",
  "Sådan sparer du på børnetøjet – uden at gå på kompromis",
  "Hvilke tilskud og støtte kan børnefamilier få i 2024?",
  "Er det værd at investere, hvis man har børn?",
  "10 smarte måder at spare på ferien med børn",
  "Sådan lærer du dine børn om penge på en sjov måde",
  "Hvad bruger danske børnefamilier flest penge på?",
  "Før og efter: Vores første investeringsvalg som familie",
  "Challenge: Spar 500 kr. på 7 dage – sådan gør du"
];

export default function ForFamilier() {
  return (
    <div>
      <Helmet>
        <title>For Børnefamilier | MinePenge.dk</title>
        <meta name="description" content="Praktiske råd, madplaner og smarte pengevaner til børnefamilier. Få inspiration og konkrete tips – uden løftede pegefingre." />
      </Helmet>
      <h1>For Børnefamilier</h1>
      <p>Praktiske råd, inspiration og smarte vaner til hele familien – uden løftede pegefingre.</p>
      <h2>Populære artikler</h2>
      <ul>
        {artikler.map((titel, i) => <li key={i}>{titel}</li>)}
      </ul>
    </div>
  );
} 