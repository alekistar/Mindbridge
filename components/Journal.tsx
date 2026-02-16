import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { CRISIS_KEYWORDS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { encryptData, decryptData } from '../utils/crypto';

interface JournalProps {
  triggerCrisis: () => void;
}

const Journal: React.FC<JournalProps> = ({ triggerCrisis }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({});
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // Encryption State
  const [encryptionPassword, setEncryptionPassword] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [hasEncryptionEnabled, setHasEncryptionEnabled] = useState(false);
  const [showEncryptionSetup, setShowEncryptionSetup] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { user, isGuest } = useAuth();
  
  const getStorageKey = () => user ? `mindbridge_journal_${user.id}` : 'mindbridge_journal_guest';
  const getEncryptionFlagKey = () => user ? `mindbridge_enc_flag_${user.id}` : 'mindbridge_enc_flag_guest';

  // Available mood tags
  const availableMoods = ['Calm', 'Anxious', 'Sad', 'Happy', 'Stressed', 'Grateful', 'Tired', 'Energetic'];

  useEffect(() => {
    const storageKey = getStorageKey();
    const encFlag = localStorage.getItem(getEncryptionFlagKey());
    const rawData = localStorage.getItem(storageKey);

    setHasEncryptionEnabled(encFlag === 'true');
    setView('list');
    setCurrentEntry({});
    setSearchQuery('');
    setSelectedMood(null);

    if (encFlag === 'true') {
      setIsLocked(true);
      setEntries([]); 
    } else {
      setIsLocked(false);
      if (rawData) {
        try {
          setEntries(JSON.parse(rawData));
        } catch (e) {
          setEntries([]);
        }
      } else {
        setEntries([]);
      }
    }
  }, [user]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    const storageKey = getStorageKey();
    const rawData = localStorage.getItem(storageKey);
    
    if (!rawData) {
      setEncryptionPassword(passwordInput);
      setIsLocked(false);
      return;
    }

    try {
      const storedItems = JSON.parse(rawData);
      
      const decryptedEntries: JournalEntry[] = await Promise.all(storedItems.map(async (item: any) => {
        if (item.isEncrypted) {
          try {
            const decryptedBody = await decryptData(item.cipherText, item.salt, item.iv, passwordInput);
            return {
              id: item.id,
              title: item.plainTitle || "Untitled", 
              body: decryptedBody,
              moodTags: item.moodTags || [],
              createdAt: item.createdAt,
              isLocked: false,
              isEncrypted: true
            };
          } catch (e) {
            throw new Error("Incorrect Password");
          }
        } else {
          return item; 
        }
      }));

      setEncryptionPassword(passwordInput);
      setEntries(decryptedEntries);
      setIsLocked(false);
      setPasswordInput('');
    } catch (err) {
      setPasswordError('Incorrect password. Unable to decrypt entries.');
    }
  };

  const handleSetupEncryption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.length < 4) {
      setPasswordError('Password must be at least 4 characters.');
      return;
    }

    try {
      const encryptedEntries = await Promise.all(entries.map(async (entry) => {
        const encrypted = await encryptData(entry.body, passwordInput);
        return {
          id: entry.id,
          plainTitle: entry.title,
          cipherText: encrypted.cipherText,
          salt: encrypted.salt,
          iv: encrypted.iv,
          createdAt: entry.createdAt,
          moodTags: entry.moodTags,
          isEncrypted: true
        };
      }));

      localStorage.setItem(getStorageKey(), JSON.stringify(encryptedEntries));
      localStorage.setItem(getEncryptionFlagKey(), 'true');
      
      setEncryptionPassword(passwordInput);
      setHasEncryptionEnabled(true);
      setShowEncryptionSetup(false);
      setPasswordInput('');
      alert("Encryption enabled! Your journal is now secured.");
    } catch (err) {
      setPasswordError("Failed to encrypt data.");
    }
  };

  const handleSave = async () => {
    if (!currentEntry.title || !currentEntry.body) return;

    const content = `${currentEntry.title} ${currentEntry.body}`.toLowerCase();
    if (CRISIS_KEYWORDS.some(k => content.includes(k))) {
      triggerCrisis();
    }

    const newEntry: JournalEntry = {
      id: currentEntry.id || Date.now().toString(),
      title: currentEntry.title,
      body: currentEntry.body,
      moodTags: currentEntry.moodTags || [],
      createdAt: currentEntry.createdAt || Date.now(),
      isLocked: currentEntry.isLocked || false,
      isEncrypted: hasEncryptionEnabled
    };

    let updatedEntries;
    if (currentEntry.id) {
      updatedEntries = entries.map(e => e.id === newEntry.id ? newEntry : e);
    } else {
      updatedEntries = [newEntry, ...entries];
    }
    setEntries(updatedEntries);

    if (hasEncryptionEnabled && encryptionPassword) {
      const storageItems = await Promise.all(updatedEntries.map(async (entry) => {
        const encrypted = await encryptData(entry.body, encryptionPassword);
        return {
          id: entry.id,
          plainTitle: entry.title,
          cipherText: encrypted.cipherText,
          salt: encrypted.salt,
          iv: encrypted.iv,
          createdAt: entry.createdAt,
          moodTags: entry.moodTags,
          isEncrypted: true
        };
      }));
      localStorage.setItem(getStorageKey(), JSON.stringify(storageItems));
    } else {
      localStorage.setItem(getStorageKey(), JSON.stringify(updatedEntries));
    }

    if (!isGuest) {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1500);
    }
    
    setView('list');
    setCurrentEntry({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? This cannot be undone.')) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      
      if (hasEncryptionEnabled && encryptionPassword) {
         handleSaveToDiskFromState(updated);
      } else {
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      }
      setView('list');
    }
  };

  const handleSaveToDiskFromState = async (currentEntries: JournalEntry[]) => {
     if (!encryptionPassword) return;
     const storageItems = await Promise.all(currentEntries.map(async (entry) => {
        const encrypted = await encryptData(entry.body, encryptionPassword);
        return {
          id: entry.id,
          plainTitle: entry.title,
          cipherText: encrypted.cipherText,
          salt: encrypted.salt,
          iv: encrypted.iv,
          createdAt: entry.createdAt,
          moodTags: entry.moodTags,
          isEncrypted: true
        };
     }));
     localStorage.setItem(getStorageKey(), JSON.stringify(storageItems));
  };

  const toggleMood = (mood: string) => {
    const currentMoods = currentEntry.moodTags || [];
    if (currentMoods.includes(mood)) {
      setCurrentEntry({ ...currentEntry, moodTags: currentMoods.filter(m => m !== mood) });
    } else {
      setCurrentEntry({ ...currentEntry, moodTags: [...currentMoods, mood] });
    }
  };

  // Filter Logic
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = (entry.title + entry.body).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMood ? entry.moodTags.includes(selectedMood) : true;
    return matchesSearch && matchesMood;
  });

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Journal Locked</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Enter your password to decrypt your entries.</p>
          
          <form onSubmit={handleUnlock}>
            <input 
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none mb-3 text-center"
              autoFocus
            />
            {passwordError && <p className="text-red-500 text-xs mb-3">{passwordError}</p>}
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
            >
              Unlock Journal
            </button>
          </form>
          <button onClick={() => { localStorage.removeItem(getStorageKey()); localStorage.removeItem(getEncryptionFlagKey()); window.location.reload(); }} className="mt-4 text-xs text-red-400 hover:text-red-600 underline">
            Forgot password? Reset Journal (Data will be lost)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-12 py-8 animate-fade-in relative min-h-[80vh]">
      
      {/* Encryption Setup Modal */}
      {showEncryptionSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 max-w-md w-full rounded-2xl p-6 shadow-2xl animate-pop border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enable Encryption</h3>
            <p className="text-sm text-gray-500 mb-4">
              Set a password to encrypt your journal entries. 
              <br/><br/>
              <span className="text-red-500 font-bold">Warning:</span> We do not store this password. If you lose it, your journal entries cannot be recovered.
            </p>
            <form onSubmit={handleSetupEncryption}>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 mb-4"
              />
              {passwordError && <p className="text-red-500 text-xs mb-3">{passwordError}</p>}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowEncryptionSetup(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">Enable Encryption</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 max-w-lg w-full rounded-2xl p-6 shadow-2xl animate-pop border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Privacy & Encryption</h3>
              <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h4 className="font-bold text-primary mb-1">Standard Mode (Default)</h4>
                <p>Data stored in browser LocalStorage. Visible to anyone with access to this unlocked device/browser.</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                <h4 className="font-bold text-purple-600 dark:text-purple-300 mb-1">Client-Side Encryption</h4>
                <p>Data is encrypted using AES-GCM <i>before</i> saving. Requires a password to view.</p>
                <ul className="list-disc pl-4 mt-2 text-xs space-y-1 opacity-80">
                  <li><strong>Pro:</strong> Total privacy. Even if someone accesses your device, they see gibberish.</li>
                  <li><strong>Con:</strong> Zero recovery. If you forget the password, data is lost forever. We cannot reset it.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main View */}
      {view === 'list' ? (
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 My Journal
                 {hasEncryptionEnabled ? (
                   <span title="Encrypted" className="text-green-500 bg-green-100 dark:bg-green-900/30 p-1 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></span>
                 ) : (
                   <span title="Not Encrypted" className="text-gray-400 cursor-pointer hover:text-primary transition-colors" onClick={() => setShowInfoModal(true)}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg></span>
                 )}
               </h1>
               <p className="text-gray-500 text-sm mt-1">
                 {hasEncryptionEnabled ? "Secured with your password." : "Private to this device."}
                 {!hasEncryptionEnabled && (
                   <button onClick={() => setShowEncryptionSetup(true)} className="ml-2 text-primary hover:underline font-medium">Enable Encryption</button>
                 )}
                 <button onClick={() => setShowInfoModal(true)} className="ml-2 text-gray-400 hover:text-gray-600"><svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
               </p>
            </div>
            
            <button 
              onClick={() => { setCurrentEntry({}); setView('edit'); }}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Entry
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 relative">
               <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Search entries..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
               />
            </div>
            <div>
              <select 
                value={selectedMood || ''}
                onChange={(e) => setSelectedMood(e.target.value || null)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">All Moods</option>
                {availableMoods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Entries List */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 border-dashed">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No entries found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedMood ? "Try adjusting your filters." : "Start your wellness journey today."}
              </p>
              <button 
                onClick={() => { setCurrentEntry({}); setView('edit'); }}
                className="text-primary font-bold hover:underline"
              >
                Create your first entry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map(entry => (
                <div 
                  key={entry.id}
                  onClick={() => { setCurrentEntry(entry); setView('edit'); }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-mid opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">{entry.title}</h3>
                    <span className="text-xs text-gray-400 font-mono">{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mb-4">
                    {entry.body}
                  </p>
                  <div className="flex gap-2">
                    {entry.moodTags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Edit View
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
             <button 
               onClick={() => setView('list')}
               className="text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 font-medium transition-colors"
             >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               Back
             </button>
             <div className="flex items-center gap-2">
               {isSyncing && <span className="text-xs text-gray-400 animate-pulse">Saving...</span>}
               {currentEntry.id && (
                 <button onClick={() => handleDelete(currentEntry.id!)} className="text-red-400 hover:text-red-600 p-2">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               )}
             </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <input 
              type="text" 
              placeholder="Title your thought..."
              value={currentEntry.title || ''}
              onChange={e => setCurrentEntry({...currentEntry, title: e.target.value})}
              className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white p-0"
              autoFocus={!currentEntry.id}
            />
            
            <div className="flex flex-wrap gap-2">
              {availableMoods.map(mood => (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    (currentEntry.moodTags || []).includes(mood)
                      ? 'bg-primary text-white shadow-md transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>

            <textarea 
              placeholder="Write how you feel. This is a safe space..."
              value={currentEntry.body || ''}
              onChange={e => setCurrentEntry({...currentEntry, body: e.target.value})}
              className="w-full h-64 md:h-96 resize-none bg-transparent border-none focus:ring-0 text-lg leading-relaxed text-gray-700 dark:text-gray-300 p-0 placeholder-gray-300 dark:placeholder-gray-600"
            />
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={!currentEntry.title || !currentEntry.body}
              className="bg-primary hover:bg-primary-dark disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:shadow-none"
            >
              Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;