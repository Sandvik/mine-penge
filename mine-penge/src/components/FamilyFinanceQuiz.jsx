import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, ArrowRight, RefreshCw, Trophy, Users, Baby, Home, Car } from 'lucide-react';

const FamilyFinanceQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "Hvor meget af din månedlige indkomst bør du som familie spare op til børneopsparing?",
      options: [
        "5-10%",
        "10-15%", 
        "15-20%",
        "20-25%"
      ],
      correct: 1,
      explanation: "10-15% er en god regel for børneopsparing. Dette sikrer at børnene har penge til uddannelse eller andre vigtige formål, uden at det går ud over familiens øvrige økonomi."
    },
    {
      id: 2,
      question: "Hvilken forsikring er MEST vigtig for en familie med børn?",
      options: [
        "Bilforsikring",
        "Sundhedsforsikring",
        "Rejseforsikring", 
        "Ulykkesforsikring"
      ],
      correct: 1,
      explanation: "Sundhedsforsikring er mest vigtig for familier med børn, da den sikrer hurtig behandling og dækker tandlæge, fysioterapi og andre sundhedsudgifter."
    },
    {
      id: 3,
      question: "Hvornår bør du starte med børneopsparing?",
      options: [
        "Når barnet starter i skole",
        "Så snart barnet er født",
        "Når barnet er 10 år",
        "Når barnet er teenager"
      ],
      correct: 1,
      explanation: "Jo tidligere du starter, jo bedre. Tid er din største fordel ved investering. Selv små beløb kan vokse til betydelige summer over tid."
    },
    {
      id: 4,
      question: "Hvor meget koster børnepasning typisk per måned for et barn i Danmark?",
      options: [
        "1.000-2.000 kr",
        "2.000-3.000 kr",
        "3.000-4.000 kr",
        "4.000-5.000 kr"
      ],
      correct: 2,
      explanation: "Børnepasning koster typisk 3.000-4.000 kr per måned per barn. Dette er ofte familiens største udgift efter bolig."
    },
    {
      id: 5,
      question: "Hvilken type konto er bedst til børneopsparing i Danmark?",
      options: [
        "Almindelig opsparingskonto",
        "Børneopsparing med skattefordel",
        "Aktiesparekonto (ASK)",
        "Pensionsopsparing"
      ],
      correct: 1,
      explanation: "Børneopsparing med skattefordel er bedst, da den giver skattefordel på indbetalinger og afkast. Barnet betaler kun 15% skat af afkastet."
    },
    {
      id: 6,
      question: "Hvor mange måneders udgifter bør en familie have i emergency fund?",
      options: [
        "1-2 måneder",
        "3-6 måneder",
        "6-12 måneder",
        "12+ måneder"
      ],
      correct: 1,
      explanation: "3-6 måneders udgifter er passende for familier. Dette giver sikkerhed ved uventede udgifter som sygdom eller arbejdsløshed."
    },
    {
      id: 7,
      question: "Hvad er den bedste måde at spare penge på mad til en familie?",
      options: [
        "Købe alt på tilbud",
        "Lave madplan og handle stort",
        "Købe takeaway hver dag",
        "Købe dyre økologiske varer"
      ],
      correct: 1,
      explanation: "Madplan og stort indkøb er mest effektivt. Det reducerer madspild og giver mulighed for at købe varer på tilbud."
    },
    {
      id: 8,
      question: "Hvornår bør du overveje livsforsikring?",
      options: [
        "Kun hvis du er syg",
        "Når du får børn",
        "Når du er pensionist",
        "Aldrig"
      ],
      correct: 1,
      explanation: "Livsforsikring bør overvejes når du får børn. Den sikrer familiens økonomi hvis den primære forsørger dør."
    },
    {
      id: 9,
      question: "Hvor meget bør du budgettere til fritidsaktiviteter per barn per måned?",
      options: [
        "100-300 kr",
        "300-500 kr",
        "500-800 kr",
        "800+ kr"
      ],
      correct: 2,
      explanation: "500-800 kr per barn per måned er realistisk for fritidsaktiviteter som sport, musik, eller andre hobbyer."
    },
    {
      id: 10,
      question: "Hvad er den bedste strategi for familiens økonomi?",
      options: [
        "Spendere alt hvad du tjener",
        "Sætte penge til side først",
        "Vente til sidst på måneden",
        "Kun spare når der er overskud"
      ],
      correct: 1,
      explanation: "Sæt penge til side først (pay yourself first). Dette sikrer at opsparing og investering sker automatisk."
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
    if (percentage >= 90) return { message: "Fantastisk! Du er en familie finans ekspert!", color: "text-green-600", icon: Trophy };
    if (percentage >= 70) return { message: "Godt gået! Du har solid viden om familie økonomi.", color: "text-blue-600", icon: CheckCircle };
    if (percentage >= 50) return { message: "Ikke dårligt! Du har grundlæggende viden, men kan forbedres.", color: "text-yellow-600", icon: Users };
    return { message: "Du har brug for at lære mere om familie økonomi.", color: "text-red-600", icon: XCircle };
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  if (showResults) {
    const scoreInfo = getScoreMessage();
    const Icon = scoreInfo.icon;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-nordic-50 rounded-lg shadow-lg p-8">
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
              Din viden om familie økonomi
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
                <li>• Læs vores familie økonomi guide</li>
                <li>• Prøv vores budget template</li>
                <li>• Brug børneopsparing beregneren</li>
                <li>• Sammenlign forsikringer</li>
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
      <div className="bg-nordic-50 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Familie Økonomi Quiz
          </h2>
          <p className="text-gray-600">
            Test din viden om familie økonomi og få tips til at forbedre din økonomiske situation
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
            <li>• Tænk over din egen familiesituation</li>
            <li>• Husk at der ikke altid er ét rigtigt svar</li>
            <li>• Brug quiz'en som læringsmulighed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FamilyFinanceQuiz; 