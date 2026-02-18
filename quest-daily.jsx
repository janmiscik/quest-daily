import React, { useState, useEffect } from 'react';
import { Sword, Sparkles, Trophy, Zap, Plus, Check, Trash2, Star, TrendingUp } from 'lucide-react';

export default function QuestDaily() {
  const [character, setCharacter] = useState({ name: 'Hero', level: 1, xp: 0, totalXp: 0 });
  const [quests, setQuests] = useState([]);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestXp, setNewQuestXp] = useState(50);
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);

  // Load data from persistent storage on mount
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      const charResult = await window.storage.get('quest-character');
      const questsResult = await window.storage.get('quest-list');
      const streakResult = await window.storage.get('quest-streak');
      const dateResult = await window.storage.get('quest-last-date');

      if (charResult) setCharacter(JSON.parse(charResult.value));
      if (questsResult) setQuests(JSON.parse(questsResult.value));
      if (streakResult) setDailyStreak(parseInt(streakResult.value));
      if (dateResult) setLastCompletedDate(dateResult.value);
    } catch (error) {
      console.log('First time playing - starting fresh!');
    }
  };

  const saveGameData = async (updatedChar, updatedQuests, updatedStreak, updatedDate) => {
    try {
      await window.storage.set('quest-character', JSON.stringify(updatedChar));
      await window.storage.set('quest-list', JSON.stringify(updatedQuests));
      await window.storage.set('quest-streak', updatedStreak.toString());
      if (updatedDate) await window.storage.set('quest-last-date', updatedDate);
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  };

  const xpNeededForLevel = (level) => level * 100;

  const addQuest = () => {
    if (!newQuestTitle.trim()) return;
    
    const quest = {
      id: Date.now(),
      title: newQuestTitle,
      xp: newQuestXp,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...quests, quest];
    setQuests(updated);
    saveGameData(character, updated, dailyStreak, lastCompletedDate);
    setNewQuestTitle('');
    setShowAddQuest(false);
  };

  const completeQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    let newXp = character.xp + quest.xp;
    let newLevel = character.level;
    let newTotalXp = character.totalXp + quest.xp;
    
    while (newXp >= xpNeededForLevel(newLevel)) {
      newXp -= xpNeededForLevel(newLevel);
      newLevel++;
    }

    // Update streak
    const today = new Date().toDateString();
    let newStreak = dailyStreak;
    if (lastCompletedDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastCompletedDate === yesterday.toDateString()) {
        newStreak = dailyStreak + 1;
      } else {
        newStreak = 1;
      }
    }

    const updatedChar = { ...character, xp: newXp, level: newLevel, totalXp: newTotalXp };
    const updatedQuests = quests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    );

    setCharacter(updatedChar);
    setQuests(updatedQuests);
    setDailyStreak(newStreak);
    setLastCompletedDate(today);
    saveGameData(updatedChar, updatedQuests, newStreak, today);
  };

  const deleteQuest = (questId) => {
    const updated = quests.filter(q => q.id !== questId);
    setQuests(updated);
    saveGameData(character, updated, dailyStreak, lastCompletedDate);
  };

  const resetProgress = async () => {
    if (!confirm('Are you sure? This will delete all your progress!')) return;
    
    const freshChar = { name: 'Hero', level: 1, xp: 0, totalXp: 0 };
    setCharacter(freshChar);
    setQuests([]);
    setDailyStreak(0);
    setLastCompletedDate(null);
    
    try {
      await window.storage.delete('quest-character');
      await window.storage.delete('quest-list');
      await window.storage.delete('quest-streak');
      await window.storage.delete('quest-last-date');
    } catch (error) {
      console.log('Reset complete');
    }
  };

  const xpPercentage = (character.xp / xpNeededForLevel(character.level)) * 100;
  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: '"Orbitron", "Courier New", monospace',
      color: '#fff',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background stars */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent), radial-gradient(1px 1px at 33% 75%, white, transparent), radial-gradient(2px 2px at 79% 53%, white, transparent)',
        backgroundSize: '200% 200%',
        animation: 'stars 20s linear infinite',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes stars {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.5); }
          50% { box-shadow: 0 0 40px rgba(138, 43, 226, 0.8); }
        }
        
        @keyframes levelUp {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .quest-item {
          animation: slideIn 0.3s ease-out;
        }

        .level-badge {
          animation: levelUp 2s infinite;
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.3))',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(138, 43, 226, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          animation: 'glow 3s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{
                fontSize: '3em',
                fontWeight: 900,
                margin: 0,
                textShadow: '0 0 20px rgba(138, 43, 226, 0.8), 0 0 40px rgba(138, 43, 226, 0.5)',
                letterSpacing: '3px'
              }}>
                <Sword style={{ display: 'inline', marginRight: '15px' }} />
                QUEST DAILY
              </h1>
              <p style={{ margin: '10px 0 0 0', fontSize: '1.2em', opacity: 0.8 }}>
                Level up your life, one quest at a time
              </p>
            </div>
            
            <button
              onClick={resetProgress}
              style={{
                background: 'rgba(255, 0, 0, 0.2)',
                border: '1px solid rgba(255, 0, 0, 0.5)',
                color: '#ff6b6b',
                padding: '8px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9em',
                fontFamily: 'inherit'
              }}
            >
              Reset Progress
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          {/* Character Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2))',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div className="level-badge" style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2em',
                fontWeight: 900,
                boxShadow: '0 5px 20px rgba(255, 215, 0, 0.5)',
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}>
                {character.level}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8em', fontWeight: 700 }}>{character.name}</h2>
                <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '1.1em' }}>
                  <Trophy size={16} style={{ display: 'inline', marginRight: '5px' }} />
                  {character.totalXp} Total XP
                </p>
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9em', opacity: 0.9 }}>
                  <Zap size={14} style={{ display: 'inline', marginRight: '3px' }} />
                  XP Progress
                </span>
                <span style={{ fontWeight: 700 }}>{character.xp} / {xpNeededForLevel(character.level)}</span>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                height: '25px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #FFD700, #FF8C00, #FFD700)',
                  backgroundSize: '200% 100%',
                  height: '100%',
                  width: `${xpPercentage}%`,
                  transition: 'width 0.5s ease',
                  animation: 'glow 2s infinite',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px',
                  fontSize: '0.8em',
                  fontWeight: 700,
                  color: '#000'
                }}>
                  {xpPercentage > 15 && `${Math.round(xpPercentage)}%`}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.2))',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(0, 255, 255, 0.5)',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5em', fontWeight: 700 }}>
              <TrendingUp style={{ display: 'inline', marginRight: '10px' }} />
              Your Stats
            </h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 255, 255, 0.3)'
              }}>
                <div style={{ fontSize: '2em', fontWeight: 900, color: '#00ffff' }}>
                  {dailyStreak}
                </div>
                <div style={{ opacity: 0.8, marginTop: '5px' }}>
                  <Star size={14} style={{ display: 'inline', marginRight: '5px' }} />
                  Day Streak
                </div>
              </div>
              
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 255, 255, 0.3)'
              }}>
                <div style={{ fontSize: '2em', fontWeight: 900, color: '#00ffff' }}>
                  {completedQuests.length}
                </div>
                <div style={{ opacity: 0.8, marginTop: '5px' }}>
                  <Check size={14} style={{ display: 'inline', marginRight: '5px' }} />
                  Quests Completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quests Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(138, 43, 226, 0.3)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ margin: 0, fontSize: '2em', fontWeight: 700 }}>
              <Sparkles style={{ display: 'inline', marginRight: '10px' }} />
              Active Quests
            </h2>
            <button
              onClick={() => setShowAddQuest(!showAddQuest)}
              style={{
                background: 'linear-gradient(135deg, #8a2be2, #4b0082)',
                border: 'none',
                color: '#fff',
                padding: '12px 25px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 5px 15px rgba(138, 43, 226, 0.4)',
                fontFamily: 'inherit',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <Plus size={20} />
              New Quest
            </button>
          </div>

          {showAddQuest && (
            <div style={{
              background: 'rgba(138, 43, 226, 0.1)',
              border: '2px solid rgba(138, 43, 226, 0.3)',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <input
                type="text"
                placeholder="Quest title (e.g., 'Morning workout', 'Study JavaScript')"
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addQuest()}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1.1em',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(138, 43, 226, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  marginBottom: '15px',
                  fontFamily: 'inherit'
                }}
              />
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>XP Reward:</span>
                  <input
                    type="number"
                    value={newQuestXp}
                    onChange={(e) => setNewQuestXp(parseInt(e.target.value) || 50)}
                    min="10"
                    max="500"
                    step="10"
                    style={{
                      padding: '10px',
                      fontSize: '1em',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(138, 43, 226, 0.5)',
                      borderRadius: '8px',
                      color: '#fff',
                      width: '100px',
                      fontFamily: 'inherit'
                    }}
                  />
                </label>
                
                <button
                  onClick={addQuest}
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                    border: 'none',
                    color: '#000',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontWeight: 700,
                    fontFamily: 'inherit'
                  }}
                >
                  Add Quest
                </button>
              </div>
            </div>
          )}

          {activeQuests.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              opacity: 0.6
            }}>
              <Sparkles size={48} style={{ opacity: 0.5 }} />
              <p style={{ fontSize: '1.3em', marginTop: '20px' }}>
                No active quests. Create your first quest to begin your journey!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {activeQuests.map((quest, index) => (
                <div
                  key={quest.id}
                  className="quest-item"
                  style={{
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(75, 0, 130, 0.2))',
                    border: '2px solid rgba(138, 43, 226, 0.4)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'all 0.3s',
                    animationDelay: `${index * 0.1}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.4)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.3em', fontWeight: 700 }}>
                      {quest.title}
                    </h3>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.8 }}>
                      <Zap size={14} style={{ display: 'inline', marginRight: '5px', color: '#FFD700' }} />
                      +{quest.xp} XP
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => completeQuest(quest.id)}
                      style={{
                        background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                        border: 'none',
                        color: '#000',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontFamily: 'inherit'
                      }}
                    >
                      <Check size={18} />
                      Complete
                    </button>
                    
                    <button
                      onClick={() => deleteQuest(quest.id)}
                      style={{
                        background: 'rgba(255, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 0, 0, 0.5)',
                        color: '#ff6b6b',
                        padding: '10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'inherit'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {completedQuests.length > 0 && (
            <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '2px solid rgba(138, 43, 226, 0.3)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em', opacity: 0.7 }}>
                Completed Today ({completedQuests.length})
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {completedQuests.map(quest => (
                  <div
                    key={quest.id}
                    style={{
                      background: 'rgba(0, 255, 136, 0.1)',
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                      borderRadius: '8px',
                      padding: '15px',
                      opacity: 0.7,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <Check size={20} style={{ color: '#00ff88' }} />
                    <span style={{ flex: 1 }}>{quest.title}</span>
                    <span style={{ color: '#00ff88', fontWeight: 700 }}>+{quest.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
