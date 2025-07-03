import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function OmMinePenge() {
  return (
    <div>
      <Helmet>
        <title>Om MinePenge.dk</title>
        <meta name="description" content="Læs om vores værdier, mission og hvordan vi gør økonomi forståeligt og sjovt for alle. Kontakt os for samarbejde eller idéer." />
      </Helmet>
      <h1>Om MinePenge.dk</h1>
      <p>Vi gør økonomi forståeligt, sjovt og relaterbart – uden løftede pegefingre. Her er plads til alle, uanset om du er studerende eller har børn.</p>
      <h2>Vores værdier</h2>
      <ul>
        <li>Vi taler i øjenhøjde – ingen jargon eller dom.</li>
        <li>Vi deler ægte historier og erfaringer.</li>
        <li>Vi er åbne om samarbejder og annoncering.</li>
        <li>Vi svarer hurtigt på henvendelser.</li>
      </ul>
      <h2>Kontakt</h2>
      <p>Har du spørgsmål, idéer eller vil du bidrage? Skriv til <a href="mailto:kontakt@minepenge.dk">kontakt@minepenge.dk</a></p>
    </div>
  );
} 