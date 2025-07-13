import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, Trophy, RefreshCw } from 'lucide-react';

const InvestmentQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = [
    {
      question: "Hvad er det bedste tidspunkt at starte med at investere som studerende?",
      options: [
        "Når du har sparet 100.000 kr op",
        "Så snart du har et emergency fund på 3-6 måneders udgifter",
        "Efter du er færdiguddannet og har et fuldtidsjob",
        "Når du er 30 år gammel"
      ],
      correct: 1,
      explanation: "Det bedste tidspunkt er når du har et emergency fund. Selv små beløb kan vokse betydeligt over tid takket være compound interest."
    },
    {
      question: "Hvad er en ETF?",
      options: [
        "En type kryptovaluta",
        "En fond der følger et indeks og handles som en aktie",
        "En dansk skatteform",
        "En type bankkonto"
      ],
      correct: 1,
      explanation: "ETF (Exchange Traded Fund) er en fond der følger et indeks som OMX C25 og handles på børsen som en aktie. Perfekt for begyndere!"
    },
    {
      question: "Hvor meget af din månedlige indkomst bør du maksimalt investere som studerende?",
      options: [
        "50% af din indkomst",
        "20% af dit overskud efter alle udgifter",
        "Alt hvad du har tilbage efter mad og bolig",
        "Kun penge du vinder i lotto"
      ],
      correct: 1,
      explanation: "20% af dit overskud er en god regel. Husk at have penge til både nødvendige udgifter og underholdning."
    },
    {
      question: "Hvad er compound interest?",
      options: [
        "Renter du betaler på gæld",
        "Renter på renter - din investering vokser eksponentielt",
        "En type skat på investeringer",
        "Gebyrer til banken"
      ],
      correct: 1,
      explanation: "Compound interest betyder at du får renter på både din oprindelige investering OG på de renter du allerede har tjent. Det er magien bag langtidssparing!"
    },
    {
      question: "Hvilken platform er bedst for studerende der vil starte med at investere?",
      options: [
        "Kun traditionelle banker",
        "Nordnet eller Saxo Bank - de har lave gebyrer og gode apps",
        "Kun kryptobørser",
        "Kun ejendomsinvestering"
      ],
      correct: 1,
      explanation: "Nordnet og Saxo Bank tilbyder lave gebyrer, gode apps og bred adgang til både danske og internationale aktier/ETF'er."
    },
    {
      question: "Hvor længe bør du planlægge at holde dine investeringer?",
      options: [
        "Kun et par måneder",
        "Mindst 5 år, gerne 10+ år",
        "Indtil du har tjent 10%",
        "Kun i gode tider"
      ],
      correct: 1,
      explanation: "Investering kræver tid. Markederne kan svinge, men over tid har aktier historisk givet positivt afkast. 5+ år er minimum."
    },
    {
      question: "Hvad er det første du skal spare op til som studerende?",
      options: [
        "En dyr bil",
        "Et emergency fund på 3-6 måneders udgifter",
        "En ferie til Thailand",
        "En ny iPhone"
      ],
      correct: 1,
      explanation: "Emergency fund kommer først! Det giver dig sikkerhed og frihed til at investere uden at skulle sælge i dårlige tider."
    },
    {
      question: "Hvad betyder 'diversificering'?",
      options: [
        "At sætte alle dine penge i én aktie",
        "At sprede dine investeringer på forskellige aktiver og sektorer",
        "At kun investere i danske aktier",
        "At købe og sælge hurtigt"
      ],
      correct: 1,
      explanation: "Diversificering betyder at sprede risikoen. I stedet for at sætte alt i én aktie, investerer du i mange forskellige aktiver."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
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
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { message: "Fantastisk! Du er klar til at starte din investeringsrejse!", emoji: "🚀" };
    if (percentage >= 60) return { message: "Godt gået! Du har en solid grundviden.", emoji: "👍" };
    if (percentage >= 40) return { message: "Ikke dårligt! Læs lidt mere og prøv igen.", emoji: "📚" };
    return { message: "Der er plads til forbedring. Læs vores guides og prøv igen!", emoji: "💪" };
  };

  if (showResults) {
    const scoreInfo = getScoreMessage();
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-4">{scoreInfo.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz færdig!</h3>
          <p className="text-lg text-gray-600 mb-4">{scoreInfo.message}</p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {score}/{questions.length}
            </div>
            <div className="text-lg text-gray-600">
              {Math.round((score / questions.length) * 100)}% korrekt
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Prøv igen
            </button>
            
            <a
              href="#calculator"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Trophy className="w-5 h-5" />
              Prøv beregneren
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-800">Investerings Quiz for Studerende</h3>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Spørgsmål {currentQuestion + 1} af {questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">
          {currentQ.question}
        </h4>
        
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === null
                  ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  : selectedAnswer === index
                  ? index === currentQ.correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : index === currentQ.correct
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedAnswer !== null && (
                  <div>
                    {index === currentQ.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                )}
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">Forklaring:</h5>
          <p className="text-blue-700">{currentQ.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {showExplanation && (
        <button
          onClick={handleNextQuestion}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {currentQuestion < questions.length - 1 ? 'Næste spørgsmål' : 'Se resultat'}
        </button>
      )}

      {/* Score indicator */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Nuværende score: {score}/{currentQuestion + 1}
      </div>
    </div>
  );
};

export default InvestmentQuiz; 