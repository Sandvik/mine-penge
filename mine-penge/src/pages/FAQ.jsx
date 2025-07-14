import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumbs from '../components/Breadcrumbs';

const FAQ = () => {
  const [openCategory, setOpenCategory] = useState(null);

  // FAQ data struktur (beholdes uændret)
  const faqData = {
    investering: {
      title: '💰 Investering',
      icon: '💰',
      questions: [
        {
          id: 'investering-1',
          question: 'Hvordan starter jeg med at investere som begynder?',
          answer: `Som begynder er det vigtigt at starte simpelt:

1️⃣ Start med månedsopsparing - 100-500 kr/måned
2️⃣ Vælg brede fonde - Sparindex INDEX Globale Aktier
3️⃣ Brug Nordnet eller Saxo - Gratis månedsopsparing
4️⃣ Tålmodighed - Investering er langsigtet

💡 Tip: Du behøver ikke være ekspert for at starte. Månedsopsparing er perfekt til begyndere!`,
          tags: ['begynder', 'månedsopsparing', 'fonde'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-2',
          question: 'Hvad er forskellen på aktier og fonde?',
          answer: `Aktier = Enkelt virksomheder
- Du ejer dele af én virksomhed
- Højere risiko og potentiel afkast
- Kræver mere research og tid

Fonde = Mange virksomheder samlet
- Du ejer dele af mange virksomheder
- Lavere risiko gennem diversificering
- Automatisk forvaltning

🎯 For begyndere: Start med fonde (ETF'er) for at sprede risikoen.`,
          tags: ['aktier', 'fonde', 'risiko', 'diversificering'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-3',
          question: 'Hvor meget skal jeg spare op hver måned?',
          answer: `Det afhænger af dine mål og situation:

📊 Generel regel: 10-20% af din indkomst
💰 Minimum: 100-500 kr/måned
🎯 Mål: 1000-2000 kr/måned

Eksempler:
- Studerende: 100-300 kr/måned
- Fuldtidsjob: 500-1500 kr/måned
- Familie: 1000-3000 kr/måned

💡 Start med hvad du kan, og øg gradvist. Det er bedre at starte med 100 kr end at vente på "perfekte" forhold.`,
          tags: ['spareop', 'budget', 'mål'],
          related: []
        },
        {
          id: 'investering-4',
          question: 'Hvad er ASK (Aktiesparekonto)?',
          answer: `ASK (Aktiesparekonto) er en skattebegunstiget konto til investering i aktiebaserede værdipapirer.

✅ Fordele:
- Maksimalt indskud i 2024: 106.600 kr
- Beskattes med 17% i lagerbeskatning (årlig værdistigning)
- Gælder kun for aktier og aktiebaserede fonde

📋 Sådan gør du:
1. Opret konto hos Nordnet/Saxo
2. Indsæt penge
3. Køb fonde/aktier
4. Betal kun 17% skat

🎯 Velegnet til langsigtet investering i f.eks. Sparindex Globale Aktier.`,
          tags: ['ASK', 'skat', 'skattefordel', 'lagerbeskatning'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-5',
          question: 'Hvilke fonde skal jeg vælge som begynder?',
          answer: `Top 3 fonde til begyndere:

1️⃣ Sparindex INDEX Globale Aktier
   - Verdens største virksomheder
   - Billig (0,5% omkostninger)
   - Automatisk diversificering

2️⃣ Sparindex INDEX Emerging Markets
   - Vækstmarkeder (Kina, Indien, etc.)
   - Højere risiko, højere potentielt afkast
   - 10-20% af din portefølje

3️⃣ Sparindex INDEX Danmark
   - Danske virksomheder
   - Skattefordel (realisationsbeskatning)
   - 10-20% af din portefølje

💡 Start med: 100% Sparindex INDEX Globale Aktier, og tilføj andre senere.`,
          tags: ['fonde', 'sparindex', 'begynder'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-6',
          question: 'Hvad er renters rente effekt?',
          answer: `Renters rente betyder, at du tjener afkast på tidligere afkast.

📈 Sådan virker det:
- År 1: 10.000 kr → 11.000 kr (10% afkast)
- År 2: 11.000 kr → 12.100 kr (10% afkast)
- År 3: 12.100 kr → 13.310 kr (10% afkast)

💰 Eksempel med månedsopsparing:
- Du investerer 100 kr/måned i 30 år
- Gennemsnitligt årligt afkast: 7%
- Du har indbetalt 36.000 kr
- Din investering kan vokse til ca. 120.000 kr

💡 Start tidligt – effekten vokser over tid.`,
          tags: ['renters rente', 'sammensat rente', 'langsigtet'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-7',
          question: 'Hvad er forskellen på aktiv og passiv forvaltning?',
          answer: `Aktiv forvaltning:
- Porteføljeforvaltere forsøger at slå markedet
- Ofte højere omkostninger (1-2%)
- Nogle slår markedet – men de fleste klarer sig dårligere efter omkostninger

Passiv forvaltning:
- Følger automatisk et indeks (f.eks. MSCI World)
- Meget lave omkostninger (0,1-0,5%)
- Over tid klarer det sig typisk bedre

🎯 Passiv investering anbefales generelt til privatpersoner.`,
          tags: ['aktiv', 'passiv', 'ETF', 'forvaltning'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-8',
          question: 'Hvornår skal jeg sælge mine investeringer?',
          answer: `Generelt: Hold fast i lang tid!

✅ God grund til at sælge:
- Du har brug for pengene (bolig, nødstilfælde)
- Du nærmer dig pension
- Du vil rebalancere porteføljen

❌ Dårlig grund til at sælge:
- Markedet falder (køb i stedet!)
- Du er nervøs
- Du hører dårlige nyheder

💡 Regel: Køb når andre er bange, hold når andre panikerer.

🎯 Langsigtet investering = 10+ år minimum!`,
          tags: ['sælg', 'timing', 'langsigtet', 'panik'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-9',
          question: 'Hvad er diversificering og hvorfor er det vigtigt?',
          answer: `Diversificering = Ikke sæt alle æg i én kurv!

🎯 Sådan diversificerer du:
- Forskellige virksomheder (fonde vs enkelt aktier)
- Forskellige lande (Danmark, USA, Asien)
- Forskellige sektorer (tech, sundhed, finans)
- Forskellige aktivklasser (aktier, obligationer)

✅ Fordele:
- Lavere risiko
- Mere stabilt afkast
- Mindre chancen for totalt tab

💡 Eksempel: Hvis Apple falder 50%, påvirker det kun 2% af din globale fond.`,
          tags: ['diversificering', 'risiko', 'portefølje'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-10',
          question: 'Hvad er forskellen på realisationsbeskatning og lagerbeskatning?',
          answer: `Realisationsbeskatning:
- Du betaler skat når du sælger
- Kun på danske aktier/fonde
- Kan udskyde skatten mange år
- Bedre for langsigtet investering

Lagerbeskatning:
- Du betaler skat hvert år
- På udenlandske aktier/fonde
- Skatten betales automatisk
- Mindre fleksibilitet

💡 Strategi: Brug danske fonde til langsigtet investering, udenlandske til ASK.`,
          tags: ['skat', 'realisation', 'lager', 'danske fonde'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-11',
          question: 'Hvad betyder det at sprede sin investering?',
          answer: `At sprede sin investering (diversificering) betyder, at du investerer i forskellige virksomheder, brancher og lande.

✅ Fordele:
- Mindsker risikoen for store tab
- Én dårlig investering ødelægger ikke hele porteføljen
- Fonde og ETF'er er automatisk spredte

💡 En god tommelfingerregel: Brug max 10% på enkeltaktier – resten i fonde.`,
          tags: ['diversificering', 'spredning', 'risiko'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-12',
          question: 'Hvad er forskellen på lager- og realisationsbeskatning?',
          answer: `Lagerbeskatning:
- Du betaler skat af værdistigning hvert år – uanset om du sælger

Realisationsbeskatning:
- Du betaler først skat, når du sælger med gevinst

💡 De fleste danske fonde er realisationsbeskattede. ETF'er og ASK bruger lagerbeskatning.`,
          tags: ['skat', 'lager', 'realisation', 'beskatning'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-13',
          question: 'Hvad er en ETF?',
          answer: `ETF står for "Exchange Traded Fund" – en børsnoteret fond.

✅ Fordele:
- Fungerer som en fond, men handles som en aktie
- Passiv forvaltning → lave omkostninger
- Populær blandt investorer globalt

📊 Eksempler:
- iShares MSCI World
- Vanguard FTSE All-World`,
          tags: ['ETF', 'fond', 'passiv', 'børsnoteret'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-14',
          question: 'Skal jeg investere som selvstændig?',
          answer: `Ja – men adskil privat og erhverv:

✅ Strategi:
- Brug frie midler eller pensionsopsparing
- Undgå at investere firmaets driftskapital
- Overvej firmapensionsordning gennem bank

🎯 Investering for selvstændige kræver mere planlægning – men giver stor frihed.`,
          tags: ['selvstændig', 'erhverv', 'pension'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-15',
          question: 'Hvordan påvirker inflation min opsparing?',
          answer: `Inflation betyder, at dine penge bliver mindre værd over tid.

📊 Eksempel:
- 2% inflation → 10.000 kr mister 20% værdi over 10 år
- Investering hjælper med at bevare købekraft

💡 En kontantopsparing uden afkast taber værdi hvert år.`,
          tags: ['inflation', 'købekraft', 'opsparing'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-16',
          question: 'Hvad er en bæredygtig investering?',
          answer: `Bæredygtige investeringer tager hensyn til miljø (E), sociale forhold (S) og god ledelse (G) – kaldet ESG.

✅ Fordele:
- Mange fonde tilbyder ESG-venlige alternativer
- Afkast kan stadig være konkurrencedygtigt

💡 Kig efter mærkninger som "ESG", "SRI" eller "Artikel 8/9" i fondsbeskrivelser.`,
          tags: ['bæredygtig', 'ESG', 'grøn', 'investering'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-17',
          question: 'Er det for sent at begynde at investere?',
          answer: `Nej – det er aldrig for sent:

✅ Muligheder:
- Selv 5-10 år giver effekt via renters rente
- Du kan skræddersy investering til din tidshorisont
- Lav risiko → obligationsfonde
- Middel risiko → fonde med stor spredning

💡 Start hellere i dag med lidt end aldrig.`,
          tags: ['sen start', 'tidshorisont', 'aldersgruppe'],
          related: ['/investering-guide']
        },
        {
          id: 'investering-18',
          question: 'Hvad er forskellen på frie midler og pension?',
          answer: `Frie midler:
- Du kan investere og hæve når som helst
- Beskattes løbende (kapitalindkomst)

Pension:
- Du får fradrag nu – men betaler skat ved udbetaling
- Midlerne er bundet til pensionsalder

🎯 Brug begge dele strategisk – fx frie midler til fleksibilitet, pension til langsigtet opsparing.`,
          tags: ['frie midler', 'pension', 'skat', 'fleksibilitet'],
          related: ['/investering-guide']
        }
      ]
    },
    bolig: {
      title: '🏠 Bolig & Hus',
      icon: '🏠',
      questions: [
        {
          id: 'bolig-1',
          question: 'Hvordan får jeg boliglån?',
          answer: `Sådan får du boliglån:

1️⃣ Spar op til udbetaling
   - Minimum 20% af boligprisen
   - Jo mere, jo bedre lånevilkår

2️⃣ Få styr på din økonomi
   - Ingen højforrentet gæld
   - Stabil indkomst
   - God kreditvurdering

3️⃣ Få lånebevis
   - 6 måneder før køb
   - Sammenlign banker
   - Forhandl om renter

4️⃣ Find bolig og køb
   - Maksimum 4x din årsindkomst
   - Husk ejerudgifter

💡 Tip: Start med at spare op og få lånebevis, før du begynder at kigge på boliger.`,
          tags: ['boliglån', 'udbetaling', 'lånebevis'],
          related: ['/bolig-hus-guide']
        },
        {
          id: 'bolig-2',
          question: 'Hvor meget skal jeg spare op til bolig?',
          answer: `Minimum 20% af boligprisen:

🏠 Eksempler:
- Bolig til 2 mio = 400.000 kr
- Bolig til 3 mio = 600.000 kr
- Bolig til 4 mio = 800.000 kr

💰 Hvor meget skal du spare op:
- 2 mio bolig: 16.700 kr/måned i 2 år
- 3 mio bolig: 25.000 kr/måned i 2 år
- 4 mio bolig: 33.300 kr/måned i 2 år

💡 Jo mere du sparer op, jo:
- Lavere månedlig ydelse
- Bedre lånevilkår
- Mindre risiko

🎯 Start tidligt - Jo før du begynder at spare, jo lettere bliver det!`,
          tags: ['spareop', 'udbetaling', 'bolig'],
          related: ['/bolig-hus-guide']
        },
        {
          id: 'bolig-3',
          question: 'Hvad koster det at købe hus?',
          answer: `Samlede omkostninger ved boligkøb:

🏠 Boligpris: 2.000.000 kr
💰 Udbetaling (20%): 400.000 kr
📋 Omkostninger:
- Tinglysning: 1.650 kr
- Advokat: 15.000-25.000 kr
- Bankomkostninger: 5.000-10.000 kr
- Total: 21.650-36.650 kr

💸 Månedlige udgifter:
- Afdrag: 6.000 kr
- Renter: 4.000 kr
- Ejendomsskat: 1.500 kr
- Forsikring: 500 kr
- Total: 12.000 kr/måned

💡 Husk: Det er ikke kun udbetalingen - der er også omkostninger og månedlige udgifter!`,
          tags: ['omkostninger', 'boligkøb', 'udgifter'],
          related: ['/bolig-hus-guide']
        },
        {
          id: 'bolig-4',
          question: 'Hvad er forskellen på fast og variabel rente?',
          answer: `Fast rente:
- Renten ændrer sig ikke i låneperioden
- Sikkerhed - du ved præcis hvad du betaler
- Ofte højere rente end variabel
- God når renterne er lave

Variabel rente:
- Renten følger markedet (op og ned)
- Kan være billigere i starten
- Usikkerhed - kan stige meget
- God når renterne er høje

💡 Anbefaling: Blandet strategi - fast rente på størstedelen, variabel på mindre del.`,
          tags: ['rente', 'fast', 'variabel', 'boliglån'],
          related: ['/bolig-hus-guide']
        },
        {
          id: 'bolig-5',
          question: 'Skal jeg købe eller leje bolig?',
          answer: `Det afhænger af din situation:

✅ Køb hvis:
- Du har sparet op til udbetaling
- Du vil bo der i 5+ år
- Du har stabil økonomi
- Du vil eje din bolig

❌ Lej hvis:
- Du er usikker på fremtiden
- Du vil have fleksibilitet
- Du ikke har sparet op
- Du vil undgå vedligeholdelse

💰 Økonomisk: Køb er ofte billigere på lang sigt, men kræver mere kapital.

💡 Start med at leje og spare op til køb senere.`,
          tags: ['køb', 'leje', 'bolig', 'beslutning'],
          related: ['/bolig-hus-guide']
        },
        {
          id: 'bolig-6',
          question: 'Hvad er ejerudgifter og hvor meget koster de?',
          answer: `Ejerudgifter = Alle udgifter til at eje bolig:

🏠 Typiske ejerudgifter:
- Ejendomsskat: 1.000-3.000 kr/år
- Forsikring: 500-1.500 kr/år
- Vedligeholdelse: 5.000-15.000 kr/år
- Varme/vand/el: 8.000-20.000 kr/år
- Internet: 3.000-6.000 kr/år

💰 Total: 17.500-45.500 kr/år

💡 Husk: Ejerudgifter er ud over boliglån. Sørg for at have råd til begge dele!`,
          tags: ['ejerudgifter', 'vedligeholdelse', 'forsikring'],
          related: ['/bolig-hus-guide']
        },
        {
          id: 'bolig-7',
          question: 'Hvad er forskellen på andelsbolig og ejerbolig?',
          answer: `Andelsbolig:
- Du ejer en andel i en forening
- Billigere at komme ind på markedet
- Mindre frihed til at renovere
- Andelsforeningen bestemmer meget
- Ofte lavere månedlige udgifter

Ejerbolig:
- Du ejer hele boligen
- Dyrere at komme ind på markedet
- Fuld frihed til at renovere
- Du bestemmer alt selv
- Ofte højere månedlige udgifter

💡 Andelsbolig er god til at komme ind på boligmarkedet, ejerbolig giver mere frihed.`,
          tags: ['andelsbolig', 'ejerbolig', 'boligtype'],
          related: ['/bolig-hus-guide']
        },
        {
          id: 'bolig-8',
          question: 'Hvordan fungerer boligskat?',
          answer: `Boligskat i Danmark:

🏠 Ejendomsskat:
- 1% af boligværdien årligt
- Betales i 2 rater (marts og november)
- Baseret på offentlig vurdering

💰 Eksempel:
- Bolig til 2 mio = 20.000 kr/år
- Betales: 10.000 kr i marts + 10.000 kr i november

💡 Tip: Sæt penge til side hver måned til boligskat, så du ikke bliver overrasket!`,
          tags: ['boligskat', 'ejendomsskat', 'skat'],
          related: ['/bolig-hus-guide']
        },
        {
          id: 'bolig-ordbog',
          question: 'Hvilke begreber skal jeg kende, når jeg køber bolig?',
          answer: `
A conto: En a conto betaling er en forudbetaling af forventet udgift eller en foreløbig betaling. En a conto betaling vil efterfølgende blive afregnet endeligt, eksempelvis betales der i flerfamilieejendomme a conto for varme og el.

A meta: En aftale om fordeling af omkostninger.

Acceptdato: Datoen for at man indgår aftale om et lån.

Acceptfrist: Det seneste tidspunkt for at et tilbud skal være accepteret.

Adkomst: Besidde ret til noget, eksempelvis fast ejendom. Står man som ejer på skødet til en given grund, har man adkomst til denne grund.

Administrationsbidrag: Den del af ydelsen på et realkreditlån, som skal dække realkreditinstituttets udgifter til administration. Administrationsbidraget kan trækkes fra i skat.

Administrator: Person, der varetager de administrative opgaver i en forening, heriblandt huslejeopkrævning, drift og betaling af løbende udgifter.

Advokatforbehold: Et advokatforbehold betyder, at en ellers underskrevet købsaftale er betinget af, at købers advokat kan godkende hele købsaftalen i sin helhed. Købers advokat skal have minimum fem arbejdsdage til at kigge alle dokumenter igennem.

Afdrag: Den del af ydelsen på et realkreditlån, som skal dække realkreditinstituttets udgifter til administration. Administrationsbidraget kan trækkes fra i skat.

Afdragsfrie lån: Låntype hvor der løbende kun betales renter og gebyrer, hvorimod der ikke afdrages på selve gælden.

Aflæsning af målere: Ved ind- og udflytning er det vigtigt at aflæse el-, vand-, varme- og gasmålere. Dette gør man for at sikre, at udgifterne bliver retfærdigt fordelt mellem tidligere og efterfølgende ejer(e). Aflæsningen bruges til at udfærdige refusionsopgørelsen.

Aftægtsydelse: I ejendomshandler kan der eksempelvis indgå en aftale om at sælger efterfølgende har brugsretten til en ejendom, fri varme, fri kost el.lign. Dette kaldes en aftægtsydelse og kan indgå som en del af den samlede købesum.

Akkord: En aftale om at kreditor nedsætter sit krav til skyldner, akkorden gives typisk for at skyldner undgår konkurs.

Almindelig frit salg: Ejendomshandel mellem uafhængige parter i modsætning til eksempelvis familiehandler

Amortisation: Fast tilbagebetaling af gæld.

Andelsbevis: Dokument, der beviser, at man ejer en del af en andelsforening og har brugsret over en bolig i foreningen.

Andelsbolig: En bolig, der er en del af en andelsforening. Andelsboliger er typisk lejligheder.

Anpartslejlighed: Lejlighed i en ejendom med to anparter. Forholdet mellem anparterne reguleres ved en samejeoverenskomst. Der er til den ideelle anpart ikke tilknyttet egentligt ejerskab men kun eksklusiv brugsret over boligen.

Anslået teknisk pris: En andelsboligs samlede pris. Den anslåede tekniske pris beregnes som summen af indskuddet og den anslåede andel af andelsforeningens nettogæld. Den anslåede tekniske pris er et godt sammenligningsgrundlag til kontantprisen på en ejerbolig.

Auktion: Handel, som foregår på auktion.

Bankgæld: Gæld, som er optaget i et pengeinstitut.

Banklån: Lån, der er optaget i et pengeinstitut.

Basisfinansiering: Et realkreditlån, som ligger inden for en lånegrænse på maksimalt 80 procent af ejendommens værdi i boligejendomme og 75 procent i fritidshuse.

BBR: Forkortelse for Bygnings- og Boligregistret, som er et register med oplysninger om samtlige af landets bygninger og boliger. Det er boligejerens eget ansvar at sikre, at alle oplysninger om boligejerens egen bolig er korrekte og opdateret.

BBR-ejermeddelelse: En BBR-meddelelse er en opsummering af oplysninger, der er registreret i Bygnings- og Boligregisteret (BBR) hos kommunen for den pågældende ejendom.

BBR-meddelelse: En sammenfatning af de oplysninger, der er registreret i BBR-registret. Sammenfatningen viser oplysninger om ejendommens størrelse, opførelsestidspunkt, beliggenhed, indretning og tekniske forhold.

Bebyggelsesprocent: Den procentvise andel af grunden, som må bebygges. Bebyggelsesprocenten er typisk på 30 procent.

Bebygget areal: Det areal på grunden, som er godkendt til bebyggelse

Behæftelse: En behæftelse er en gæld, som er sikret med pant. Panten kan eksempelvis være i form af en fast ejendom.

Belåne: At stille konkret definerede aktiver som sikkerhed for et lån.

Belåningsgrad: Den andel af ejendommens handelsværdi, som er belånt. Har man f.eks. en gæld på 800.000 kr. i en ejendom til en handelsværdi på 1,0 mio. kroner, så er belåningsgraden 80 procent.

Belåningsværdi: Den vurderede kontante handelsværdi af en ejendom. Belåningsværdien afgør, hvor meget der kan lånes i boligen og er med til at sikre, at de lovmæssigt fastsatte lånegrænser overholdes. For helårsboliger er lånegrænsen 80 procent, og for fritidshuse er den 75 procent.

Berigtigelse: Når en ejendom er berigtiget, betyder det, at handelen er gennemført i overensstemmelse med de aftalte vilkår. Mere konkret kan en berigtigelse dække over, at sælger har modtaget sine penge, at køber har fået skødet tinglyst og har opnået adkomst (ejendomsret) på ejendommen, at der er udarbejdet et pantebreve mm.

Besigtigelse: En sagkyndigs undersøgelse og vurdering af tilstanden for eksempelvis en bolig.

Besøgsstatistik: På Boligsiden kan du se, hvor mange der har været interesseret i den enkelte ejendom. Det kaldes besøgsstatistikken for ejendomme.

Bestyrelse: Den øverste ledelse eksempelvis i en forening. Bestyrelsen vælges på foreningens generalforsamling og varetager den overordnede ledelse og daglige drift i foreningen.

Betalingsgaranti: Når der stilles betalingsgaranti, afgives der et juridisk bindende løfte om at overtage den økonomiske risiko, som ellers ville ligge hos kreditor selv.

Betinget købsaftale: En købsaftale, der er betinget af visse omstændigheder, eksempelvis at køber får solgt sit eget hus. Kun hvis de betingelser, der er opført i købsaftalen, opfyldes, kan handlen gennemføres.

Betinget skøde: Et skøde, der er betinget af, at nogle specifikke betingelser skal være opfyldt, før der kan udstedes et endeligt skøde og ejendommen kan overdrages.

Bevaringsdeklaration: En servitut, der indeholder bestemmelser om bevaring af ejendom, der er fredet. Er servitutten godkendt af Kulturarvsstyrelsen fritager den ejer fra bl.a. at skulle betale ejendomsskat.

BFE nummer: BFE står for Bestemt Fast Ejendom. Det er en syvcifret talkombination som kæder alle registrerede oplysninger om den specifikke faste ejendom sammen.

Blandede ejendomme: En ejendom, der anvendes til flere formål, f.eks. både beboelse og erhverv, kalder man en blandet ejendom. Dette gælder også for ejendomme, hvor underetagen bruges til butikslejemål, mens resten er beregnet til almindelig beboelse.

Blanko lån: Et usikret forbrugslån, der typisk ansøges gennem finansieringsselskabernes hjemmesider eller pr. telefon. Da lånet er uden sikkerhed, betales der ofte højere renter.

Bodelingsoverenskomst: En skriftlig aftale om opgørelse og fordeling af ægtefællers aktiver og passiver ved separation eller skilsmisse.

Bolig i udbud: Bolig, der er udbudt til salg og er mulig for interesserede købere at byde på. De fleste boliger i udbud annonceres på internettet, men de kan også udbydes uden annoncering.

Boligadvokat: En advokat, der specialiserer sig i ejendomshandel, som yder rådgivning til dig som køber og/eller sælger og sørger for, at du føler dig tryg i forbindelse med din bolighandel.

Boligafgift: Som andelshaver i en andelsforening betaler du et månedlight beløb, som populært sagt kaldes husleje. Beløbet går til at dække foreningens udgifter (skatter, afgifter, prioritetsydelser m.v.) og kan derfor variere. Boligafgiften udregnes som regel på baggrund af boligens areal (fordelingstal).

Boligareal: Den del af ejendommens areal, der er blevet godkendt til beboelse af kommunen.

Boligboble: Længerevarende og kraftig stigning i boligpriserne, der ikke bygger på den reelle vækst i samfundsøkonomien, men som er løsrevet fra den øvrige økonomiske udvikling.

Boligbyrde: Den beregnede andel af en boligejers nettoindkomst, der går til boliglån og boligskatter.

Boligfinansiering: Boligfinansiering er et begreb, der dækker over, hvordan man finansierer købet af en ejerbolig. Ofte består finansieringen af en bolig af både realkreditlån (op til 80 procent), boliglån i banken (15 procent) og egenfinansieret udbetaling (cirka fem procent).

Boligkøb: Køb af fast ejendom, hvad enten det er en lejlighed, en villa, et rækkehus eller et sommerhus.

Boligkøberens håndbog: Boligkøberens håndbog – fra A til Å er Boligsidens guide til dig som boligkøber. Boligkøberens håndbog guider dig igennem de forskellige faser af boligkøbet – lige fra idéfasen til selve overdragelsen.

Boligkøbsbevis: Et boligkøbsbevis er et dokument, som er et bevis på, at du er forhåndsgodkendt til at låne inden for en bestemt låneramme i eksempelvis et realkreditinstitut. Fordelen ved et boligkøbsbevis er, at du på forhånd ved, hvad din bolig må koste, og at du kan slå til med det samme, når drømmeboligen dukker op.

Boligkredit: Ofte meget fleksibel låneform i forbindelse med boligfinansiering. Boligkreditten fungerer som en slags kassekredit.

Boligkrise: Når et stort antal boligejere ikke kan få solgt deres boliger og samtidig ikke kan betale deres lån. Under en boligkrise kan boligpriserne falde, så gælden i boligen overstiger boligens salgsværdi.

Boliglån: Lån, der optages for at finansiere boligkøb eller ombygning. Ofte finansieres størstedelen af boligkøbet med et realkreditlån (cirka 80 procent), mens kun en mindre del finansieres med et boliglån (cirka 15 procent).

Boligopsparing: En opsparing rettet mod boligmæssige formål såsom boligkøb eller forbedringer ved din nuværende bolig. Ofte giver en boligopsparing en god rente og er som regel bundet inden for en aftalt tidsperiode.

Boligrådgivning: Rådgivning om alle dele af ejendomshandel – både køb og salg.

Boligretten: Afdeling i byretten, der behandler sager om lejeforhold.

Boligsalg: Når du sælger et stykke fast ejendom, som du ejer, er der tale om boligsalg.

Boligsikring: Boligsikring er et tilskud til huslejen forbeholdt de, der lejer en bolig. Størrelsen af tilskuddet afhænger af en række forhold som indtægt, boligens areal, antal beboere og huslejens størrelse.

Bopælspligt: Når ejeren af en bolig har pligt til at sørge for, at boligen er konstant beboet – enten af ejer selv eller gennem udlejning.

Bopælsret: Når en person bliver tildelt retten til at bebo en ejendom, som vedkommende ikke selv er ejer af. Dette kan f.eks. være som led i en handel, hvor sælger kan forbeholde sig retten til fortsat at kunne bebo ejendommen på livstid.

Brandsikring: Forbedringer ved en eksisterende bygning, som har til formål at nedsætte brandfaren og forsinke, at en eventuelt opstået brand breder sig.

Brugsret: Retten til at bruge og benytte fast ejendom eller løsøregenstande.

Bruttoetageareal: Boligens samlede boligareal inklusive arealet for hver af boligens etager samt ydervægge. Benyttes bl.a. til at beregne, hvor meget du skal betale i ejendomsværdiskat. Som boligejer har du ansvaret for, at boligarealet er korrekt registreret, og dermed skal du også indberette ændringer i boligarealet.

Bruttoydelse: De samlede udgifter før skat ved at låne til en bolig, det er administrationsbidrag, renter og afdrag. Vedligeholdelsesudgifter og anvendelsesudgifter som f.eks. vand-, el- og varmebidrag indgår ikke i bruttoydelsen.

Budgetkonto: En konto, hvorfra alle tilbagevendende faste udgifter betales. På baggrund af alle faste udgifter for et helt år udregner man et månedligt gennemsnit, som skal indsættes på kontoen hver måned. På den måde vil der altid være dækning på kontoen til de udgifter, der kommer.

Byggelån: En midlertidig kredit, der kun løber, mens et byggeprojekt står på. Når byggeriet er afsluttet og godkendt, skal lånet tilbagetales, hvilket typisk gøres gennem optagelse af et realkreditlån eller lignende.

Byggelinie: Offentligt fastsat grænse, der viser, hvortil der må bygges. Byggelinien definerer afstanden til skel. Derudover kan højdegrænseplanet begrænse beliggenheden af en bolig.

Byggemodning: Før der må bygges på en grund, skal grunden erklæres byggeklar dvs. der skal være anlagt veje, kloakeret, fremført vand og el m.v.. Når dette er opfyldt, kan en grund erklæres byggemoden.

Byggepligt: Pligten til at påbegynde byggeri på en given grund inden en bestemt tidsfrist. Denne frist er typisk på to år. En sådan pligt indføres som et krav i købsaftalen eller skødet og benyttes f.eks. for at undgå spekulationsopkøb i forbindelse med udstykning af parcelhusgrunde.

Byggeteknisk gennemgang: På baggrund af en byggeteknisk gennemgang af boligen udarbejdes en tilstandsrapport, som er en skriftlig vurdering af boligens stand indeholdende både synlige skader og tegn på skader. Eftersynet foretages af en byggesagkyndig, og tilstandsrapporten er nødvendig for at oplyse køber og danner grundlag for at køber kan tegne en ejerskifteforsikring.

Byggetilladelse: En tilladelse, der skal gives af den lokale byggemyndighed, som regel kommunen, før visse byggerier må påbegyndes.

Bygning på lejet grund: Bygning opført på en grund, der ikke tilhører bygningens ejer. Bygningen og grunden har her hvert sit blad i tingbogen.

Bygningsareal: Summen af samtlige etagers arealer med undtagelse af eventuel kælder og tagetage.

Bygningsattest: Anden betegnelse for ibrugtagningstilladelse. Når et byggeprojekt afsluttes, skal kommunen kontrollere, om det er udført i overensstemmelse med byggetilladelsen. Hvis det er tilfælde, udsteder kommunen en bygningsattest/ibrugtagningstilladelse.

Bygningssagkyndig: Person, der er autoriseret af Ministeriet for By, Bolig og Landdistrikter til at udarbejde tilstandsrapporter og energimærkninger.

Byrderubrik: Felt i ejendommens specifikke blad i tingbogen, hvor servitutter og øvrige byrder på ejendommen anføres.

Byzone: Areal, der er dedikeret til bymæssig bebyggelse.
`,
  tags: ['boligordbog', 'begreber', 'boligkøb'],
  related: []
}
      ]
    },
    budget: {
      title: '📊 Budget & Økonomi',
      icon: '📊',
      questions: [
        {
          id: 'budget-1',
          question: 'Hvordan laver jeg et budget?',
          answer: `Sådan laver du et budget:

1️⃣ Få overblik over indtægter
   - Løn, SU, studiejob
   - Andre indtægter

2️⃣ Kategoriser udgifter
   - Faste: Husleje, el, internet
   - Variable: Mad, transport, underholdning
   - Sparing: Investering, ferie, uforudsete

3️⃣ 50/30/20 reglen:
   - 50% til nødvendigheder
   - 30% til ønsker
   - 20% til sparing

4️⃣ Brug en app eller Excel
   - Spiir, YNAB, eller Excel
   - Hold det simpelt

💡 Start med: At skrive alle udgifter ned i en måned, så du ved hvor pengene går.`,
          tags: ['budget', 'udgifter', 'indtægter'],
          related: []
        },
        {
          id: 'budget-2',
          question: 'Hvor meget skal jeg spare op til uforudsete udgifter?',
          answer: `Emergency fund (nødopsparing):

💰 Minimum: 3 måneders udgifter
🎯 Anbefalet: 6 måneders udgifter

Eksempler:
- Studerende: 15.000-30.000 kr
- Fuldtidsjob: 30.000-60.000 kr
- Familie: 60.000-120.000 kr

Hvorfor?
- Bil går i stykker
- Tandlæge
- Tabt job
- Husreparationer

💡 Start med: 10.000 kr, og byg gradvist op. Det giver ro i maven!`,
          tags: ['nødopsparing', 'emergency fund', 'sikkerhed'],
          related: []
        },
        {
          id: 'budget-3',
          question: 'Hvad er forskellen på faste og variable udgifter?',
          answer: `Faste udgifter:
- Samme beløb hver måned
- Kan ikke undgås
- Husleje, el, internet, forsikring
- Planlægning er nem

Variable udgifter:
- Ændrer sig fra måned til måned
- Kan justeres
- Mad, transport, underholdning
- Kræver mere opmærksomhed

💡 Tip: Start med at få styr på faste udgifter, så ved du hvor meget du har tilbage til variable.`,
          tags: ['faste udgifter', 'variable udgifter', 'budget'],
          related: []
        },
        {
          id: 'budget-4',
          question: 'Hvordan sparer jeg penge på mad?',
          answer: `Sådan sparer du på mad:

🛒 Planlægning:
- Lav madplan for ugen
- Køb kun det du skal bruge
- Undgå impulskøb

💰 Tips:
- Køb store pakker (billigere per kg)
- Brug tilbudsaviser
- Køb sæsonvarer
- Lav madpakke i stedet for at spise ude

📱 Apps:
- Too Good To Go (billig mad)
- Spiir (overblik over udgifter)
- Supermarket apps (tilbud)

💡 Du kan spare 1.000-2.000 kr/måned på mad med god planlægning!`,
          tags: ['mad', 'spare penge', 'madplan'],
          related: []
        },
        {
          id: 'budget-5',
          question: 'Hvad er forskellen på gæld og lån?',
          answer: `Gæld:
- Penge du skylder
- Kan være både god og dårlig
- Kreditkort gæld = dårlig (høj rente)
- Boliglån = god (lav rente)

Lån:
- Et produkt du kan købe
- Boliglån, billån, forbrugslån
- Kan være både godt og dårligt

✅ God gæld:
- Boliglån (lav rente)
- SU-lån (lav rente)
- Investeringslån (hvis afkast > rente)

❌ Dårlig gæld:
- Kreditkort (høj rente)
- Forbrugslån (høj rente)
- Aflånsrente (meget høj rente)

💡 Regel: Undgå gæld med høj rente!`,
          tags: ['gæld', 'lån', 'rente', 'kreditkort'],
          related: []
        },
        {
          id: 'budget-6',
          question: 'Hvordan fungerer kreditkort?',
          answer: `Kreditkort fungerer sådan:

💳 Sådan virker det:
- Du låner penge af banken
- Betaler tilbage hver måned
- Hvis du ikke betaler fuldt ud = høj rente

✅ Fordele:
- Sikkerhed (rejseforsikring)
- Cashback/bonus
- Fleksibilitet

❌ Ulemper:
- Høj rente (15-25%)
- Fristende at bruge for meget
- Gebyrer hvis du betaler for sent

💡 Regel: Betal altid fuldt ud hver måned, ellers bliver det dyrt!

🎯 Brug kun til dagligdags køb, ikke til at låne penge.`,
          tags: ['kreditkort', 'gæld', 'rente', 'forbrug'],
          related: []
        },
        {
          id: 'budget-7',
          question: 'Hvad er forskellen på brutto og netto løn?',
          answer: `Brutto løn:
- Din løn før skat
- Det beløb der står i din kontrakt
- F.eks. 30.000 kr/måned

Netto løn:
- Din løn efter skat
- Det beløb du faktisk får udbetalt
- F.eks. 20.000 kr/måned

💰 Hvor går pengene hen?
- A-skat: 37-42% af brutto
- AM-bidrag: 8% af brutto
- ATP: 1% af brutto

💡 Tip: Planlæg altid med netto løn, ikke brutto!

🎯 Eksempel: 30.000 kr brutto ≈ 20.000 kr netto.`,
          tags: ['brutto', 'netto', 'løn', 'skat'],
          related: []
        },
        {
          id: 'budget-8',
          question: 'Hvordan fungerer pension?',
          answer: `Pension i Danmark:

🏦 Arbejdsmarkedspension:
- Din arbejdsgiver betaler
- 8-18% af din løn
- Automatisk oprettet

💰 Folkepension:
- Staten betaler
- Fra 67 år
- Grundbeløb + tillæg

🎯 Privat pension:
- Du betaler selv
- Ratepension eller livrente
- Skattefordel

💡 Tip: Start tidligt med privat pension - renters rente effekt!

📊 Mål: 15% af din løn til pension samlet.`,
          tags: ['pension', 'arbejdsmarkedspension', 'folkepension'],
          related: []
        }
      ]
    },
    studerende: {
      title: '🎓 Studerende',
      icon: '🎓',
      questions: [
        {
          id: 'studerende-1',
          question: 'Hvordan sparer jeg op som studerende?',
          answer: `Spar op som studerende - det kan lade sig gøre!

💰 Start med små beløb:
- 100 kr/måned = 1.200 kr/år
- 200 kr/måned = 2.400 kr/år
- 500 kr/måned = 6.000 kr/år

🎯 Prioritering:
1. Nødopsparing (5.000-10.000 kr)
2. Månedsopsparing (100-500 kr)
3. Ferieopsparing

💡 Tips:
- Brug studiejob til sparing
- Lev billigt (kollegie, madpakke)
- Start tidligt - renters rente effekt
- Det er okay at starte med 50 kr/måned

🚀 Eksempel: 100 kr/måned i 5 år = 6.000 kr + afkast!`,
          tags: ['studerende', 'spareop', 'månedsopsparing'],
          related: ['/student-investment-guide']
        },
        {
          id: 'studerende-2',
          question: 'Skal jeg investere som studerende?',
          answer: `Ja, men start simpelt!

✅ Fordele ved at starte tidligt:
- Længere tid til renters rente
- Lærer om investering
- Bygger gode vaner

🎯 Sådan starter du:
1. Først: Nødopsparing (5.000-10.000 kr)
2. Derefter: Månedsopsparing (100-500 kr)
3. Vælg: Sparindex INDEX Globale Aktier

💡 Tips:
- Start med 100 kr/måned
- Brug Nordnet månedsopsparing (gratis)
- Fokuser på studier først
- Investering er langsigtet

🚀 Eksempel: 100 kr/måned i 10 år kan blive 15.000+ kr!`,
          tags: ['studerende', 'investering', 'månedsopsparing'],
          related: ['/student-investment-guide', '/investering-guide']
        },
        {
          id: 'studerende-3',
          question: 'Hvordan fungerer SU?',
          answer: `SU (Statens Uddannelsesstøtte):

💰 SU-lån:
- 3.189 kr/måned (2024)
- Lav rente (4% årligt)
- Betales tilbage efter endt uddannelse
- Maksimum 6 år

✅ SU-klip:
- 70 klip til bachelor
- 30 klip til kandidat
- 1 klip = 1 måned
- Brug dem klogt!

💡 Tips:
- Tag SU-lån hvis du kan spare det op
- Brug klipne til uddannelse, ikke ferie
- SU-lån er billigere end banklån

🎯 Strategi: Brug SU-lån til at spare op til bolig/investering.`,
          tags: ['SU', 'SU-lån', 'studerende', 'støtte'],
          related: ['/student-investment-guide']
        },
        {
          id: 'studerende-4',
          question: 'Skal jeg tage studiejob?',
          answer: `Ja, men prioriter studierne!

✅ Fordele ved studiejob:
- Ekstra indkomst
- Erfaring på CV'et
- Netværk
- Praktisk erfaring

💼 Hvor meget:
- 10-15 timer/uge er optimalt
- Undgå mere end 20 timer/uge
- Prioriter studierne først

💰 Hvad skal pengene bruges til:
- Nødopsparing
- Månedsopsparing
- Ferie
- Ekstra udgifter

💡 Tip: Brug studiejob til at bygge gode økonomiske vaner!`,
          tags: ['studiejob', 'indkomst', 'studerende'],
          related: ['/student-investment-guide']
        },
        {
          id: 'studerende-5',
          question: 'Hvordan sparer jeg penge som studerende?',
          answer: `Sådan sparer du penge som studerende:

🏠 Bolig:
- Kollegie er billigst
- Del lejlighed med andre
- Undgå dyre områder

🍽️ Mad:
- Lav madpakke
- Køb store pakker
- Brug tilbudsaviser
- Spis i kantinen

🚌 Transport:
- Cykel er billigst
- Offentlig transport
- Undgå bil hvis muligt

💡 Tips:
- Lev billigt nu, så du kan leve godt senere
- Fokuser på studierne - det giver bedre løn senere
- Start med at spare op - selv små beløb tæller!`,
          tags: ['spare penge', 'studerende', 'billigt'],
          related: ['/student-investment-guide']
        },
        {
          id: 'studerende-6',
          question: 'Hvad skal jeg gøre med mine penge efter endt uddannelse?',
          answer: `Sådan håndterer du pengene efter endt uddannelse:

💰 Først: Nødopsparing
- Spar op til 3-6 måneders udgifter
- Sikkerhed når du starter nyt job

🏠 Derefter: Boligsparing
- Spar op til udbetaling
- Minimum 20% af boligprisen

💼 Investering:
- Start månedsopsparing
- 10-20% af din løn
- Brug ASK til skattefordel

💡 Prioritering:
1. Nødopsparing
2. Boligsparing
3. Investering
4. Pension

🎯 Start med at få styr på din økonomi, før du køber dyre ting!`,
          tags: ['efter uddannelse', 'prioritering', 'bolig', 'investering'],
          related: ['/student-investment-guide', '/bolig-hus-guide', '/investering-guide']
        }
      ]
    },
    pension: {
      title: '👴 Pension',
      icon: '👴',
      questions: [
        {
          id: 'pension-1',
          question: 'Hvordan fungerer pension i Danmark?',
          answer: `Pension i Danmark består af 3 dele:

🏦 Arbejdsmarkedspension:
- Din arbejdsgiver betaler
- 8-18% af din løn
- Automatisk oprettet

💰 Folkepension:
- Staten betaler
- Fra 67 år
- Grundbeløb + tillæg

🎯 Privat pension:
- Du betaler selv
- Ratepension eller livrente
- Skattefordel

💡 Tip: Start tidligt med privat pension - renters rente effekt!

📊 Mål: 15% af din løn til pension samlet.`,
          tags: ['pension', 'arbejdsmarkedspension', 'folkepension'],
          related: []
        },
        {
          id: 'pension-2',
          question: 'Hvor meget skal jeg spare op til pension?',
          answer: `Pensionsmål:

💰 Generel regel: 15% af din løn
- Arbejdsmarkedspension: 8-18%
- Privat pension: Fyld op til 15%

🎯 Eksempler:
- Løn 30.000 kr: 4.500 kr/måned til pension
- Løn 40.000 kr: 6.000 kr/måned til pension
- Løn 50.000 kr: 7.500 kr/måned til pension

💡 Tips:
- Start tidligt - renters rente effekt
- Øg gradvist når lønnen stiger
- Brug skattefordel på ratepension

🚀 Eksempel: 5.000 kr/måned i 30 år = 1,8 mio kr!`,
          tags: ['pension', 'spareop', 'mål'],
          related: []
        },
        {
          id: 'pension-3',
          question: 'Hvad er forskellen på ratepension og livrente?',
          answer: `Ratepension:
- Du får hele beløbet udbetalt
- Frihed til at bruge pengene
- Kan arves til børn
- Højere risiko

Livrente:
- Garanteret månedlig udbetaling
- Sikkerhed resten af livet
- Kan ikke arves
- Lavere risiko

💡 Anbefaling: Blandet strategi
- Ratepension til frihed
- Livrente til sikkerhed

🎯 Start med ratepension, tilføj livrente senere.`,
          tags: ['ratepension', 'livrente', 'pension'],
          related: []
        }
      ]
    },
    gæld: {
      title: '💳 Gæld & Lån',
      icon: '💳',
      questions: [
        {
          id: 'gaeld-1',
          question: 'Hvordan kommer jeg ud af gæld?',
          answer: `Sådan kommer du ud af gæld:

📋 Lav en oversigt:
- Skriv alle gæld ned
- Noter renter og gebyrer
- Prioriter efter rente (højest først)

💰 Strategi:
1. Betal minimum på alle gæld
2. Brug ekstra penge på højeste rente
3. Gennemfør til gælden er væk

💡 Tips:
- Undgå nye gæld
- Snak med banken om samling
- Overvej gældssanering hvis nødvendigt

🎯 Mål: Kom ud af højforrentet gæld først!`,
          tags: ['gæld', 'afbetaling', 'strategi'],
          related: []
        },
        {
          id: 'gaeld-2',
          question: 'Hvad er forskellen på god og dårlig gæld?',
          answer: `God gæld:
- Lav rente
- Investering i fremtiden
- Boliglån (lav rente)
- SU-lån (lav rente)
- Investeringslån (hvis afkast > rente)

Dårlig gæld:
- Høj rente
- Forbrug
- Kreditkort (15-25%)
- Forbrugslån (10-20%)
- Aflånsrente (meget høj)

💡 Regel: Undgå gæld med høj rente!

🎯 Prioriter: Betal dårlig gæld først, behold god gæld.`,
          tags: ['gæld', 'rente', 'prioritering'],
          related: []
        }
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Ofte Stillede Spørgsmål - MinePenge.nu</title>
        <meta name="description" content="Find svar på de mest almindelige spørgsmål om investering, bolig, budget og økonomi. Søgbar FAQ med praktiske råd og guides." />
        <meta property="og:title" content="Ofte Stillede Spørgsmål - MinePenge.nu" />
        <meta property="og:description" content="Find svar på de mest almindelige spørgsmål om investering, bolig, budget og økonomi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://minepenge.nu/faq" />
        <link rel="canonical" href="https://minepenge.nu/faq" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumbs currentPage="FAQ" />
            <div className="mt-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                ❓ Ofte Stillede Spørgsmål
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Find svar på de mest almindelige spørgsmål om investering, bolig, budget og økonomi. Klik på en kategori for at folde spørgsmålene ud.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion UI for kategorier */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {Object.entries(faqData).map(([catKey, cat]) => (
            <div key={catKey} className="mb-6 border rounded-lg bg-white shadow-sm">
              <button
                onClick={() => setOpenCategory(openCategory === catKey ? null : catKey)}
                className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold text-gray-900 hover:bg-gray-100 rounded-t-lg"
                aria-expanded={openCategory === catKey}
              >
                <span>{cat.icon} {cat.title}</span>
                <span>{openCategory === catKey ? '▲' : '▼'}</span>
              </button>
              {openCategory === catKey && (
                <div className="px-6 pb-6 pt-2">
                  {cat.questions.map((item) => (
                    <div key={item.id} className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.question}
                      </h3>
                      <div className="prose prose-gray max-w-none mb-2">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.tags && item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {/* Related Links */}
                      {item.related && item.related.length > 0 && (
                        <div className="border-t border-gray-200 pt-2">
                          <h4 className="text-xs font-medium text-gray-900 mb-1">
                            📚 Relaterede links:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {item.related.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              >
                                {link.includes('beregnere') ? '🧮 Beregner' : 
                                 link.includes('guide') ? '📖 Guide' : '🔗 Link'}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ; 