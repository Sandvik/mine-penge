// mine-penge/src/data/faqData.js
// Fælles FAQ data for både FAQ siden og ChatWidget

const faqData = [
  // 💰 Investering
  {
    id: 'investering-1',
    question: 'Hvordan starter jeg med at investere som begynder?',
    answer: `Som begynder er det vigtigt at starte simpelt:

1️⃣ Start med månedsopsparing - 100-500 kr/måned
2️⃣ Vælg brede fonde - Sparindex INDEX Globale Aktier
3️⃣ Brug Nordnet eller Saxo - Gratis månedsopsparing
4️⃣ Tålmodighed - Investering er langsigtet

💡 Tip: Du behøver ikke være ekspert for at starte. Månedsopsparing er perfekt til begyndere!

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['begynder', 'månedsopsparing', 'fonde', 'starte', 'komme i gang', 'første gang', 'nybegynder', 'investering'],
    category: 'investering',
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

🎯 For begyndere: Start med fonde (ETF'er) for at sprede risikoen.

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['aktier', 'fonde', 'risiko', 'diversificering', 'etf'],
    category: 'investering',
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
    tags: ['spareop', 'budget', 'mål', 'måned', 'hvor meget'],
    category: 'investering',
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

🎯 Velegnet til langsigtet investering i f.eks. Sparindex Globale Aktier.

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['ASK', 'aktiesparekonto', 'skat', 'skattefordel', 'lagerbeskatning', '17%'],
    category: 'investering',
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

💡 Start med: 100% Sparindex INDEX Globale Aktier, og tilføj andre senere.

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['fonde', 'sparindex', 'begynder', 'vælg', 'hvilke'],
    category: 'investering',
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

💡 Start tidligt – effekten vokser over tid.

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['renters rente', 'sammensat rente', 'langsigtet', 'compound'],
    category: 'investering',
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

🎯 Passiv investering anbefales generelt til privatpersoner.

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['aktiv', 'passiv', 'ETF', 'forvaltning'],
    category: 'investering',
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

🎯 Langsigtet investering = 10+ år minimum!

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['sælg', 'timing', 'langsigtet', 'panik', 'hvornår'],
    category: 'investering',
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

💡 Eksempel: Hvis Apple falder 50%, påvirker det kun 2% af din globale fond.

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['diversificering', 'risiko', 'portefølje'],
    category: 'investering',
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

💡 Strategi: Brug danske fonde til langsigtet investering, udenlandske til ASK.

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
    tags: ['skat', 'realisation', 'lager', 'danske fonde'],
    category: 'investering',
    related: ['/investering-guide']
  },
  // 🏠 Bolig & Hus
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

💡 Tip: Start med at spare op og få lånebevis, før du begynder at kigge på boliger.

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['boliglån', 'udbetaling', 'lånebevis', 'bolig', 'andelslån', 'lån'],
    category: 'bolig',
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

🎯 Start tidligt - Jo før du begynder at spare, jo lettere bliver det!

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['spareop', 'udbetaling', 'bolig', 'hvor meget'],
    category: 'bolig',
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

💡 Husk: Det er ikke kun udbetalingen - der er også omkostninger og månedlige udgifter!

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['omkostninger', 'boligkøb', 'udgifter', 'købe hus'],
    category: 'bolig',
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
- Good når renterne er høje

💡 Anbefaling: Blandet strategi - fast rente på størstedelen, variabel på mindre del.

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['rente', 'fast', 'variabel', 'boliglån'],
    category: 'bolig',
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

💡 Start med at leje og spare op til køb senere.

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['køb', 'leje', 'bolig', 'beslutning'],
    category: 'bolig',
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

💡 Husk: Ejerudgifter er ud over boliglån. Sørg for at have råd til begge dele!

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['ejerudgifter', 'vedligeholdelse', 'forsikring'],
    category: 'bolig',
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

💡 Andelsbolig er god til at komme ind på boligmarkedet, ejerbolig giver mere frihed.

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['andelsbolig', 'ejerbolig', 'boligtype', 'andelslån', 'boliglån'],
    category: 'bolig',
    related: ['/bolig-hus-guide']
  },
  {
    id: 'bolig-7b',
    question: 'Ejer eller andel?',
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

💡 Andelsbolig er god til at komme ind på boligmarkedet, ejerbolig giver mere frihed.

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['ejer', 'andel', 'ejer eller andel', 'andelsbolig', 'ejerbolig', 'boligtype'],
    category: 'bolig',
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

💡 Tip: Sæt penge til side hver måned til boligskat, så du ikke bliver overrasket!

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['boligskat', 'ejendomsskat', 'skat'],
    category: 'bolig',
    related: ['/bolig-hus-guide']
  },
  {
    id: 'bolig-9',
    question: 'Hvad er et andelslån?',
    answer: `Andelslån er et lån til køb af andelsbolig:

🏠 Sådan fungerer det:
- Du køber en andel i en andelsforening
- Lånet er sikret i din andel
- Ofte lavere rente end ejerboliglån
- Kortere løbetid (typisk 15-30 år)

💰 Fordele:
- Billigere at komme ind på boligmarkedet
- Lavere månedlige udgifter
- Ofte lavere rente end ejerboliglån

❌ Ulemper:
- Mindre frihed til at renovere
- Andelsforeningen bestemmer meget
- Kan være svært at sælge

💡 Tip: Andelslån er godt til at komme ind på boligmarkedet, men giver mindre frihed end ejerbolig.

📚 Læs mere i vores bolig guide:
[📖 Bolig guide](/bolig-hus-guide)`,
    tags: ['andelslån', 'andelsbolig', 'boliglån', 'lån'],
    category: 'bolig',
    related: ['/bolig-hus-guide']
  },
  {
    id: 'bolig-10',
    question: 'Hvad er en bidragssats?',
    answer: `Bidragssats er et gebyr, du betaler til realkreditinstituttet, når du har et realkreditlån. Det er en procentdel af restgælden og dækker bl.a. administration og risiko for långiver.

- **Bidragssats:** Typisk 0,5-1,5% af restgælden om året
- **Betales sammen med ydelsen** på dit realkreditlån
- **Afhænger af:** Lånetype, belåningsgrad og evt. afdragsfrihed

💡 Bidragssatsen er ud over renten og kan variere fra institut til institut.`,
    tags: ['bidragssats', 'bidrag', 'realkredit', 'gebyr', 'boliglån'],
    category: 'bolig',
    related: []
  },
  // 📊 Budget & Økonomi
  {
    id: 'budget-1',
    question: 'Hvordan laver jeg et budget?',
    answer: `Sådan laver du et budget:

📊 50/30/20 reglen:
- 50% til nødvendigheder (husleje, mad, transport)
- 30% til ønsker (underholdning, shopping)
- 20% til opsparing og investering

💰 Sådan starter du:
1. Skriv alle indtægter ned
2. Skriv alle udgifter ned
3. Kategoriser udgifterne
4. Sæt mål for hver kategori
5. Følg op hver måned

💡 Tip: Start simpelt og bliv mere detaljeret over tid!

🎯 Mål: Få overblik over din økonomi og spar op systematisk.`,
    tags: ['budget', 'økonomi', 'planlægning', 'spareop'],
    category: 'budget',
    related: []
  },
  {
    id: 'budget-2',
    question: 'Hvor meget skal jeg spare op?',
    answer: `Generelle retningslinjer:

💰 Nødopsparing:
- 3-6 måneders udgifter
- Minimum 15.000-30.000 kr

🎯 Månedlig opsparing:
- 10-20% af din indkomst
- Minimum 500-1000 kr/måned

📊 Eksempler:
- Løn 25.000 kr: 2.500-5.000 kr/måned
- Løn 35.000 kr: 3.500-7.000 kr/måned
- Løn 45.000 kr: 4.500-9.000 kr/måned

💡 Start med hvad du kan, og øg gradvist. Det er bedre at starte med 100 kr end at vente!`,
    tags: ['spareop', 'mål', 'nødopsparing', 'hvor meget'],
    category: 'budget',
    related: []
  },
  {
    id: 'budget-3',
    question: 'Hvordan sparer jeg penge på mad?',
    answer: `Sådan sparer du penge på mad:

🛒 Indkøb:
- Lav madplan for ugen
- Køb store pakker
- Brug tilbudsaviser
- Køb sæsonvarer

🍽️ Madlavning:
- Lav madpakke
- Kog store portioner
- Brug rester
- Undgå takeaway

💰 Tips:
- Sæt madbudget (f.eks. 2000 kr/måned)
- Køb ikke sulten
- Brug loyalitetsprogrammer
- Køb frosne grøntsager

💡 Du kan spare 500-1000 kr/måned på mad!`,
    tags: ['mad', 'spare penge', 'indkøb', 'madplan'],
    category: 'budget',
    related: []
  },
  {
    id: 'budget-4',
    question: 'Hvad er forskellen på aktiver og passiver?',
    answer: `Aktiver:
- Ting der giver dig penge
- F.eks. investeringer, udlejningsejendom
- Vokser i værdi over tid
- Genererer indkomst

Passiver:
- Ting der koster dig penge
- F.eks. bil, dyre gadgets
- Falder i værdi over tid
- Kræver vedligeholdelse

💡 Regel: Køb aktiver, undgå passiver!

🎯 Eksempel:
- Aktiv: Investering i fonde
- Passiv: Dyrt køretøj

💰 Mål: Flere aktiver end passiver!`,
    tags: ['aktiver', 'passiver', 'økonomi', 'investering'],
    category: 'budget',
    related: []
  },
  {
    id: 'budget-5',
    question: 'Hvordan fungerer kreditkort?',
    answer: `Kreditkort fungerer sådan:
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
    category: 'budget',
    related: []
  },
  {
    id: 'budget-6',
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
    category: 'budget',
    related: []
  },
  {
    id: 'budget-7',
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
    category: 'budget',
    related: []
  },
  {
    id: 'bank-1',
    question: 'Hvad er forskellen på indlån og udlån?',
    answer: `Indlån betyder, at du sætter penge ind på din bankkonto – banken “låner” dine penge og betaler dig evt. rente for det. Udlån betyder, at du låner penge af banken – du får penge udbetalt og skal betale rente til banken.

- **Indlån:** Du har penge stående i banken (fx lønkonto, opsparing)
- **Udlån:** Du låner penge af banken (fx boliglån, billån, kredit)

💡 Banken tjener penge på forskellen mellem indlånsrente og udlånsrente.`,
    tags: ['indlån', 'udlån', 'bank', 'rente', 'lån'],
    category: 'budget',
    related: []
  },
  // �� Studerende
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

🚀 Eksempel: 100 kr/måned i 5 år = 6.000 kr + afkast!

📚 Læs mere i vores studerende guide:
[📖 Studerende guide](/student-investment-guide)`,
    tags: ['studerende', 'spareop', 'månedsopsparing'],
    category: 'studerende',
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
- Fokuser på studierne først
- Investering er langsigtet

🚀 Eksempel: 100 kr/måned i 10 år kan blive 15.000+ kr!

📚 Læs mere i vores studerende guide:
[📖 Studerende guide](/student-investment-guide)`,
    tags: ['studerende', 'investering', 'månedsopsparing'],
    category: 'studerende',
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

🎯 Strategi: Brug SU-lån til at spare op til bolig/investering.

📚 Læs mere i vores studerende guide:
[📖 Studerende guide](/student-investment-guide)`,
    tags: ['SU', 'SU-lån', 'studerende', 'støtte'],
    category: 'studerende',
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

💡 Tip: Brug studiejob til at bygge gode økonomiske vaner!

📚 Læs mere i vores studerende guide:
[📖 Studerende guide](/student-investment-guide)`,
    tags: ['studiejob', 'indkomst', 'studerende'],
    category: 'studerende',
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
- Start med at spare op - selv små beløb tæller!

📚 Læs mere i vores studerende guide:
[📖 Studerende guide](/student-investment-guide)`,
    tags: ['spare penge', 'studerende', 'billigt'],
    category: 'studerende',
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

🎯 Start med at få styr på din økonomi, før du køber dyre ting!

📚 Læs mere i vores studerende guide:
[📖 Studerende guide](/student-investment-guide)`,
    tags: ['efter uddannelse', 'prioritering', 'bolig', 'investering'],
    category: 'studerende',
    related: ['/student-investment-guide', '/bolig-hus-guide', '/investering-guide']
  },
  // 👴 Pension
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
    category: 'pension',
    related: []
  },
  {
    id: 'pension-2',
    question: 'Hvor meget skal jeg spare op til pension?',
    answer: `Generel regel: 15% af din løn
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
    category: 'pension',
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
    category: 'pension',
    related: []
  },
  // 💳 Gæld & Lån
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
    category: 'gæld',
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
    category: 'gæld',
    related: []
  }
];

export default faqData; 