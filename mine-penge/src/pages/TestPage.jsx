import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-nordic-50 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">✅ Test Page Working!</h1>
        <p className="text-gray-600 mb-6">Routing er fungerende korrekt.</p>
        <a 
          href="/student-investment-guide" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Gå til Student Investment Guide
        </a>
      </div>
    </div>
  );
};

export default TestPage; 