import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, ArrowRight, RefreshCw, Trophy, Home, DollarSign, Target, BarChart3 } from 'lucide-react';

const HousingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "Hvad er en fastforrentet boliglån?",
      options: [
        "Et lån med rente der ændrer sig hver måned",
        "Et lån med fast rente i hele lånets løbetid",
        "Et lån uden renter",
        "Et lån kun for rige mennesker"
      ],
      correct: 1,
      explanation: "Et fastforrentet boliglån har en fast rente i hele lånets løbetid. Det giver sikkerhed og forudsigelighed, men typisk til en højere rente end variabel rente."
    },
    {
      id: 2,
      question: "Hvor meget skal du typisk spare op til udbetaling på en bolig i Danmark?",
      options: [
        "5% af boligprisen",
        "10% af boligprisen",
        "20% af boligprisen",
        "50% af boligprisen"
      ],
      correct: 2,
      explanation: "De fleste banker kræver 20% udbetaling for at give dig et boliglån. Dette sikrer at du har en solid økonomisk base."
    },
    {
      id: 3,
      question: "Hvad er ejendomsskat?",
      options: [
        "En skat du betaler når du sælger din bolig",
        "En årlig skat baseret på din boligs værdi",
        "En skat kun for lejeboliger",
        "En engangsbetaling ved køb"
      ],
      correct: 1,
      explanation: "Ejendomsskat er en årlig skat baseret på din boligs værdi. Den betales til kommunen og bruges til at finansiere lokale tjenester."
    },
    {
      id: 4,
      question: "Hvad betyder 'annuitetslån'?",
      options: [
        "Et lån med variabel rente",
        "Et lån hvor ydelsen er konstant gennem hele løbetiden",
        "Et lån kun for pensionister",
        "Et lån uden afdrag"
      ],
      correct: 1,
      explanation: "Et annuitetslån har konstant ydelse gennem hele løbetiden. I starten betaler du mest i renter, senere mest i afdrag."
    },
    {
      id: 5,
      question: "Hvad er en boligkøberrådgiver?",
      options: [
        "En advokat der hjælper med købet",
        "En rådgiver der hjælper dig gennem hele købsprocessen",
        "En ejendomsmægler",
        "En bankrådgiver"
      ],
      correct: 1,
      explanation: "En boligkøberrådgiver hjælper dig gennem hele købsprocessen - fra at finde boligen til at underskrive købskontrakten."
    },
    {
      id: 6,
      question: "Hvad er 'tinglysning'?",
      options: [
        "At registrere dit boliglån i det offentlige system",
        "At sælge din bolig",
        "At renovere din bolig",
        "At få en boligvurdering"
      ],
      correct: 0,
      explanation: "Tinglysning er registrering af dit boliglån i det offentlige system. Det sikrer at banken har ret til at sælge boligen hvis du ikke kan betale."
    },
    {
      id: 7,
      question: "Hvad er en 'flexlån'?",
      options: [
        "Et lån med meget høj rente",
        "Et lån der kombinerer fast og variabel rente",
        "Et lån kun for unge",
        "Et lån uden sikkerhed"
      ],
      correct: 1,
      explanation: "Et flexlån kombinerer fast og variabel rente. Du kan typisk vælge mellem forskellige rentetyper og justere løbetiden."
    },
    {
      id: 8,
      question: "Hvad er 'ejendomsværdiskat'?",
      options: [
        "En skat på din boligs værdi over 3,04 mio. kr",
        "En skat på alle boliger",
        "En skat kun for sommerhuse",
        "En skat på lejeboliger"
      ],
      correct: 0,
      explanation: "Ejendomsværdiskat er en skat på din boligs værdi over 3,04 mio. kr. Den betales årligt til staten."
    },
    {
      id: 9,
      question: "Hvad er 'omkostninger ved boligkøb'?",
      options: [
        "Kun boligprisen",
        "Boligpris plus advokatomkostninger og tinglysning",
        "Kun advokatomkostninger",
        "Kun tinglysning"
      ],
      correct: 1,
      explanation: "Omkostninger ved boligkøb inkluderer boligpris plus advokatomkostninger, tinglysning og andre gebyrer. Typisk 1-2% af boligprisen."
    },
    {
      id: 10,
      question: "Hvad er 'energimærke'?",
      options: [
        "Et mærke der viser boligens energiforbrug",
        "Et mærke for nye boliger",
        "Et mærke for billige boliger",
        "Et mærke for store boliger"
      ],
      correct: 0,
      explanation: "Energimærket viser boligens energiforbrug fra A (meget lavt) til G (meget højt). Det påvirker både boligpris og løbende omkostninger."
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
    if (percentage >= 90) return { message: "Fantastisk! Du er en boligkøbsekspert!", color: "text-green-600", icon: Trophy };
    if (percentage >= 70) return { message: "Godt gået! Du har solid viden om boligkøb.", color: "text-blue-600", icon: Home };
    if (percentage >= 50) return { message: "Ikke dårligt! Du har grundlæggende viden, men kan forbedres.", color: "text-yellow-600", icon: Target };
    return { message: "Du har brug for at lære mere om boligkøb.", color: "text-red-600", icon: XCircle };
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
              Din viden om boligkøb
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
                <li>• Læs vores boligkøbsguide</li>
                <li>• Prøv vores boliglånsberegner</li>
                <li>• Sammenlign forskellige ejendomme</li>
                <li>• Kontakt en boligkøberrådgiver</li>
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
            <div className="bg-blue-100 p-3 rounded-full">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Boligkøbs Quiz
          </h2>
          <p className="text-gray-600">
            Test din viden om boligkøb og få tips til at forberede dig på din boligjagt
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
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Boligkøbsråd</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Spar op til mindst 20% udbetaling</li>
            <li>• Få din økonomi i orden før du køber</li>
            <li>• Undersøg både boligpris og løbende omkostninger</li>
            <li>• Brug professionel hjælp til købsprocessen</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HousingQuiz; 