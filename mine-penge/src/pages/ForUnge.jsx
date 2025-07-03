import React from 'react';
import { Helmet } from 'react-helmet-async';

const artikler = [
  "Sådan får du SU'en til at række hele måneden",
  "10 geniale sparetips til studerende i 2024",
  "Billige og nemme madidéer til travle unge",
  "De bedste apps til at holde styr på pengene som studerende",
  "Er det værd at investere, når du er under 25?",
  "7 fejl unge ofte laver med deres penge – og hvordan du undgår dem",
  "Sådan undgår du dyre impulskøb som studerende",
  "Hvad koster det egentlig at flytte hjemmefra?",
  "Mine bedste råd til at finde billige oplevelser i byen",
  "5 ting jeg ville ønske, jeg vidste om penge som 20-årig"
];

export default function ForUnge() {
  return (
    <div>
      <Helmet>
        <title>For Unge & Studerende | MinePenge.dk</title>
        <meta name="description" content="Få styr på SU, sparetips og hverdagsøkonomi som ung eller studerende. Guides, inspiration og konkrete råd – uden løftede pegefingre." />
      </Helmet>
      <h1>For Unge & Studerende</h1>
      <p>Få styr på pengene – uden at det bliver kedeligt! Her finder du guides, tips og inspiration til at få mere ud af din SU og hverdag.</p>
      <h2>Populære artikler</h2>
      <ul>
        {artikler.map((titel, i) => <li key={i}>{titel}</li>)}
      </ul>
    </div>
  );
} 