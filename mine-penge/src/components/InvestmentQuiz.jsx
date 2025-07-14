import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, ArrowRight, RefreshCw, Trophy, TrendingUp, Target, PieChart, DollarSign } from 'lucide-react';

const InvestmentQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "Hvad er compound interest (sammensatte renter)?",
      options: [
        "Renter på renter over tid",
        "Kun renter på det oprindelige beløb",
        "En type skat på investeringer",
        "Gebyrer til banken"
      ],
      correct: 0,
      explanation: "Compound interest betyder at du tjener renter ikke kun på dit oprindelige beløb, men også på de renter du allerede har tjent. Dette skaber eksponentiel vækst over tid."
    },
    {
      id: 2,
      question: "Hvad er en ETF?",
      options: [
        "En type bankkonto",
        "Exchange Traded Fund - en fond der handles som en aktie",
        "En type obligation",
        "En forsikring"
      ],
      correct: 1,
      explanation: "ETF (Exchange Traded Fund) er en fond der indeholder en samling af aktier eller andre aktiver og handles på børsen som en enkelt aktie. Det giver nem adgang til diversificering."
    },
    {
      id: 3,
      question: "Hvad betyder diversificering i investering?",
      options: [
        "At sætte alle penge i én aktie",
        "At sprede investeringer på tværs af forskellige aktiver",
        "At kun investere i danske aktier",
        "At købe og sælge hurtigt"
      ],
      correct: 1,
      explanation: "Diversificering betyder at sprede dine investeringer på tværs af forskellige aktiver, sektorer og geografiske områder for at reducere risiko."
    },
    {
      id: 4,
      question: "Hvad er en aktiesparekonto (ASK)?",
      options: [
        "En almindelig bankkonto",
        "En konto med 17% skat på afkast i stedet for 27-42%",
        "En pensionsopsparing",
        "En konto kun for aktier"
      ],
      correct: 1,
      explanation: "Aktiesparekontoen giver dig 17% skat på afkast i stedet for de normale 27-42%. Du kan indbetale op til 106.600 kr (2024)."
    },
    {
      id: 5,
      question: "Hvad er den bedste strategi for langtidssucces med investering?",
      options: [
        "Køb og sælg hurtigt baseret på markedets bevægelser",
        "Køb og hold i lang tid (buy and hold)",
        "Kun investere når markedet stiger",
        "Sælg alt når markedet falder"
      ],
      correct: 1,
      explanation: "Buy and hold strategien har historisk givet de bedste resultater. Tid i markedet er vigtigere end timing af markedet."
    },
    {
      id: 6,
      question: "Hvad er en bear market?",
      options: [
        "Et marked der stiger kraftigt",
        "Et marked der falder 20% eller mere",
        "Et marked for bjørneaktier",
        "Et marked kun for store virksomheder"
      ],
      correct: 1,
      explanation: "En bear market er defineret som et fald på 20% eller mere fra et højdepunkt. Det er normalt og en del af investeringscyklussen."
    },
    {
      id: 7,
      question: "Hvad er den gyldne regel for investering?",
      options: [
        "Invester kun penge du kan tåle at miste",
        "Invester alt hvad du har",
        "Kun invester hvis du er sikker på gevinst",
        "Invester kun i guld"
      ],
      correct: 0,
      explanation: "Den gyldne regel er at investere kun penge du kan tåle at miste. Investering indebærer altid risiko for tab."
    },
    {
      id: 8,
      question: "Hvad er en dividend?",
      options: [
        "En type skat",
        "En del af virksomhedens overskud udbetalt til aktionærer",
        "En gebyr til banken",
        "En type obligation"
      ],
      correct: 1,
      explanation: "Dividend er en del af virksomhedens overskud der udbetales til aktionærer. Det kan være en god kilde til passiv indkomst."
    },
    {
      id: 9,
      question: "Hvad betyder 'time in the market beats timing the market'?",
      options: [
        "At det er bedre at være i markedet længe end at prøve at time det",
        "At du skal sælge alt på det rigtige tidspunkt",
        "At markedet altid stiger",
        "At timing er alt"
      ],
      correct: 0,
      explanation: "Dette betyder at det er bedre at investere regelmæssigt og holde i lang tid, end at prøve at købe og sælge på det perfekte tidspunkt."
    },
    {
      id: 10,
      question: "Hvad er en index fond?",
      options: [
        "En fond der følger et bestemt indeks som OMX C25",
        "En fond der kun indeholder danske aktier",
        "En fond med høje gebyrer",
        "En fond der altid slår markedet"
      ],
      correct: 0,
      explanation: "En index fond følger et bestemt indeks som OMX C25 eller MSCI World. Den giver automatisk diversificering og lave omkostninger."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentQuestion] === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswers({});
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { message: "Fantastisk! Du er en investeringsekspert!", color: "text-green-600", icon: Trophy };
    if (percentage >= 70) return { message: "Godt gået! Du har solid investeringsviden.", color: "text-blue-600", icon: TrendingUp };
    if (percentage >= 50) return { message: "Ikke dårligt! Du har grundlæggende viden, men kan forbedres.", color: "text-yellow-600", icon: Target };
    return { message: "Du har brug for at lære mere om investering.", color: "text-red-600", icon: XCircle };
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  if (showResults) {
    const scoreInfo = getScoreMessage();
    const Icon = scoreInfo.icon;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Icon className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Quiz Resultat
            </h2>
            <p className="text-gray-600">
              Din viden om investering
            </p>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {score}/{questions.length}
            </div>
            <div className={`text-xl font-semibold mb-4 ${scoreInfo.color}`}>
              {scoreInfo.message}
            </div>
            <div className="text-gray-600">
              {Math.round((score / questions.length) * 100)}% korrekte svar
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Din præstation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Korrekte svar:</span>
                  <span className="font-semibold text-green-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Forkerte svar:</span>
                  <span className="font-semibold text-red-600">{questions.length - score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Procent korrekt:</span>
                  <span className="font-semibold">{Math.round((score / questions.length) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Næste skridt</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Læs vores investeringsguide</li>
                <li>• Prøv vores investeringsberegner</li>
                <li>• Analyser din portefølje</li>
                <li>• Start med små beløb</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Tag quiz'en igen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Investerings Quiz
          </h2>
          <p className="text-gray-600">
            Test din viden om investering og få tips til at forbedre din strategi
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Spørgsmål {currentQuestion + 1} af {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {score} korrekte svar
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-800">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {currentQuestion + 1} af {questions.length} spørgsmål
          </div>
          
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === undefined}
            className={`flex items-center gap-2 font-medium py-3 px-6 rounded-lg transition-colors ${
              selectedAnswer !== undefined
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Se resultat' : 'Næste spørgsmål'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips til quiz'en</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Tag dig tid til at læse spørgsmålene grundigt</li>
            <li>• Tænk over din egen investeringsstrategi</li>
            <li>• Husk at der ikke altid er ét rigtigt svar</li>
            <li>• Brug quiz'en som læringsmulighed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvestmentQuiz; 