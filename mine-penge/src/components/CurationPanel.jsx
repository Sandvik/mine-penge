import React, { useState, useEffect } from 'react';
import { X, Plus, Download, Upload, Trash2, Eye, EyeOff } from 'lucide-react';
import curationService from '../services/curationService';

function CurationPanel({ isOpen, onClose, onBlacklistUpdate }) {
  const [blacklistedArticles, setBlacklistedArticles] = useState([]);
  const [newArticleId, setNewArticleId] = useState('');
  const [reason, setReason] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadBlacklist();
    }
  }, [isOpen]);

  const loadBlacklist = () => {
    const blacklist = curationService.getBlacklistedArticles();
    setBlacklistedArticles(blacklist);
  };

  const handleAddToBlacklist = () => {
    if (newArticleId.trim()) {
      curationService.addToBlacklist(newArticleId.trim(), reason);
      setNewArticleId('');
      setReason('');
      setShowAddForm(false);
      loadBlacklist();
      if (onBlacklistUpdate) {
        onBlacklistUpdate();
      }
    }
  };

  const handleRemoveFromBlacklist = (articleId) => {
    curationService.removeFromBlacklist(articleId);
    loadBlacklist();
    if (onBlacklistUpdate) {
      onBlacklistUpdate();
    }
  };

  const handleClearBlacklist = () => {
    if (window.confirm('Er du sikker på, at du vil rydde hele blacklisten?')) {
      curationService.clearBlacklist();
      loadBlacklist();
      if (onBlacklistUpdate) {
        onBlacklistUpdate();
      }
    }
  };

  const handleExport = () => {
    curationService.exportBlacklist();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      curationService.importBlacklist(file).then((success) => {
        if (success) {
          loadBlacklist();
          if (onBlacklistUpdate) {
            onBlacklistUpdate();
          }
          alert('Blacklist importeret succesfuldt!');
        } else {
          alert('Fejl ved import af blacklist');
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-nordic-50 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-nordic-900">
            Kurateringspanel
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-nordic-100 transition-colors"
          >
            <X className="h-5 w-5 text-nordic-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="bg-nordic-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-nordic-600">Blacklistede artikler</p>
              <p className="text-2xl font-bold text-nordic-900">{blacklistedArticles.length}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExport}
                className="flex items-center px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Eksporter
              </button>
              <label className="flex items-center px-3 py-2 bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors text-sm cursor-pointer">
                <Upload className="h-4 w-4 mr-1" />
                Importer
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Add Article Form */}
        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tilføj artikel til blacklist
            </button>
          ) : (
            <div className="bg-nordic-50 rounded-lg p-4">
              <h3 className="font-medium text-nordic-900 mb-3">Tilføj artikel til blacklist</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-nordic-700 mb-1">
                    Artikel ID
                  </label>
                  <input
                    type="text"
                    value={newArticleId}
                    onChange={(e) => setNewArticleId(e.target.value)}
                    placeholder="Indtast artikel ID"
                    className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic-700 mb-1">
                    Grund (valgfrit)
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Hvorfor skal artiklen fjernes?"
                    className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddToBlacklist}
                    className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
                  >
                    Tilføj til blacklist
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-nordic-300 text-nordic-700 rounded-lg hover:bg-nordic-400 transition-colors"
                  >
                    Annuller
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Blacklisted Articles List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-nordic-900">Blacklistede artikler</h3>
            {blacklistedArticles.length > 0 && (
              <button
                onClick={handleClearBlacklist}
                className="flex items-center px-3 py-1 text-error-600 hover:bg-error-50 rounded-lg transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Ryd alle
              </button>
            )}
          </div>
          
          {blacklistedArticles.length === 0 ? (
            <div className="text-center py-8 text-nordic-500">
              <EyeOff className="h-12 w-12 mx-auto mb-3 text-nordic-300" />
              <p>Ingen artikler på blacklist</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {blacklistedArticles.map((articleId, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-nordic-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <EyeOff className="h-4 w-4 text-nordic-400 mr-2" />
                    <span className="font-mono text-sm text-nordic-700">{articleId}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFromBlacklist(articleId)}
                    className="p-1 text-error-600 hover:bg-error-100 rounded transition-colors"
                    title="Fjern fra blacklist"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <h4 className="font-medium text-primary-900 mb-2">Sådan bruger du kurateringspanelet:</h4>
          <ul className="text-sm text-primary-700 space-y-1">
            <li>• Find artikel ID'et på artikelkortet (øverst til højre)</li>
            <li>• Indtast ID'et i formularen for at tilføje til blacklist</li>
            <li>• Blacklistede artikler vises ikke på siden</li>
            <li>• Du kan eksportere/importere blacklisten til backup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CurationPanel; 