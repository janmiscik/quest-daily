import React, { useState, useEffect } from 'react';
import { 
  Sword, Sparkles, Trophy, Zap, Plus, Check, Trash2, Star, TrendingUp,
  Briefcase, Dumbbell, BookOpen, Heart, Award, Target, Calendar, 
  BarChart3, Flame, HelpCircle, Download, X
} from 'lucide-react';

// Quest categories with icons and colors
const CATEGORIES = {
  work: { name: 'Work', icon: Briefcase, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)' },
  fitness: { name: 'Fitness', icon: Dumbbell, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' },
  study: { name: 'Study', icon: BookOpen, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' },
  personal: { name: 'Personal', icon: Heart, color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.2)' }
};

// Difficulty levels
const DIFFICULTIES = {
  easy: { name: 'Easy', xp: 50, color: '#10b981' },
  medium: { name: 'Medium', xp: 100, color: '#f59e0b' },
  hard: { name: 'Hard', xp: 200, color: '#ef4444' }
};

// Quest templates
const TEMPLATES = [
  { title: 'Morning workout', category: 'fitness', difficulty: 'medium' },
  { title: 'Study 1 hour', category: 'study', difficulty: 'medium' },
  { title: 'Complete work task', category: 'work', difficulty: 'hard' },
  { title: 'Meditate 10min', category: 'personal', difficulty: 'easy' },
  { title: 'Read 20 pages', category: 'study', difficulty: 'easy' },
  { title: '10k steps', category: 'fitness', difficulty: 'medium' },
];

// Achievements
const ACHIEVEMENTS = [
  { id: 'first_quest', name: 'First Quest', description: 'Complete your first quest', icon: '🎯', requirement: 1 },
  { id: 'streak_3', name: '3-Day Streak', description: '3 days in a row', icon: '🔥', requirement: 3 },
  { id: 'streak_7', name: 'Weekly Warrior', description: '7 days in a row', icon: '⚡', requirement: 7 },
  { id: 'level_5', name: 'Level 5', description: 'Reach level 5', icon: '⭐', requirement: 5 },
  { id: 'level_10', name: 'Level 10 Master', description: 'Reach level 10', icon: '🏆', requirement: 10 },
  { id: 'quests_10', name: '10 Quests', description: 'Complete 10 quests', icon: '💪', requirement: 10 },
  { id: 'quests_50', name: '50 Quests', description: 'Complete 50 quests', icon: '🎖️', requirement: 50 },
  { id: 'quests_100', name: 'Century Club', description: 'Complete 100 quests', icon: '👑', requirement: 100 },
];

export default function QuestDaily() {
  const [character, setCharacter] = useState({ name: 'Hero', level: 1, xp: 0, totalXp: 0 });
  const [quests, setQuests] = useState([]);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestCategory, setNewQuestCategory] = useState('work');
  const [newQuestDifficulty, setNewQuestDifficulty] = useState('medium');
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      const charResult = await window.storage.get('quest-character');
      const questsResult = await window.storage.get('quest-list');
      const streakResult = await window.storage.get('quest-streak');
      const dateResult = await window.storage.get('quest-last-date');
      const achievementsResult = await window.storage.get('quest-achievements');

      if (charResult) setCharacter(JSON.parse(charResult.value));
      if (questsResult) setQuests(JSON.parse(questsResult.value));
      if (streakResult) setDailyStreak(parseInt(streakResult.value));
      if (dateResult) setLastCompletedDate(dateResult.value);
      if (achievementsResult) setUnlockedAchievements(JSON.parse(achievementsResult.value));
    } catch (error) {
      console.log('First time playing - starting fresh!');
    }
  };

  const saveGameData = async (updatedChar, updatedQuests, updatedStreak, updatedDate, updatedAchievements) => {
    try {
      await window.storage.set('quest-character', JSON.stringify(updatedChar));
      await window.storage.set('quest-list', JSON.stringify(updatedQuests));
      await window.storage.set('quest-streak', updatedStreak.toString());
      if (updatedDate) await window.storage.set('quest-last-date', updatedDate);
      if (updatedAchievements) await window.storage.set('quest-achievements', JSON.stringify(updatedAchievements));
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  };

  const downloadUserGuide = () => {
    const guideContent = `# Quest Daily - Quick Start Guide

## 🎮 What is Quest Daily?
Quest Daily turns your tasks into epic quests! Earn XP, level up, unlock achievements.

## ✨ Creating Quests
**Quick Templates:** Click any template button (e.g., "Morning workout")
**Custom Quest:** Click "Custom Quest", enter title, choose category & difficulty

## 🎯 Categories
💼 Work | 🏋️ Fitness | 📚 Study | ❤️ Personal

## ⚡ Difficulty
Easy: 50 XP | Medium: 100 XP | Hard: 200 XP

## 📈 Leveling
Level 1→2: 100 XP | Level 2→3: 200 XP | Each level = Level × 100 XP

## 🔥 Streaks
Complete 1+ quest daily to maintain streak!

## 🏆 Achievements (8 Total)
🎯 First Quest | 🔥 3-Day Streak | ⚡ Weekly Warrior (7 days)
⭐ Level 5 | 🏆 Level 10 | 💪 10 Quests | 🎖️ 50 Quests | 👑 100 Quests

## 💡 Tips
- Start with 3-5 quests daily
- Use templates for routine tasks  
- Balance all 4 categories
- Check Stats to track progress

Created by ©JanMi 2026`;

    const blob = new Blob([guideContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Quest-Daily-Guide.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const playSound = (type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'complete') {
      oscillator.frequency.value = 523.25; // C5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'levelup') {
      // Chord progression for level up
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + i * 0.1);
        osc.start(audioContext.currentTime + i * 0.1);
        osc.stop(audioContext.currentTime + 0.5 + i * 0.1);
      });
    } else if (type === 'achievement') {
      oscillator.frequency.value = 880; // A5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const checkAchievements = (updatedChar, updatedQuests, updatedStreak) => {
    const newAchievements = [];
    const completedCount = updatedQuests.filter(q => q.completed).length;

    ACHIEVEMENTS.forEach(ach => {
      if (!unlockedAchievements.includes(ach.id)) {
        let unlocked = false;
        
        if (ach.id === 'first_quest' && completedCount >= 1) unlocked = true;
        if (ach.id === 'quests_10' && completedCount >= 10) unlocked = true;
        if (ach.id === 'quests_50' && completedCount >= 50) unlocked = true;
        if (ach.id === 'quests_100' && completedCount >= 100) unlocked = true;
        if (ach.id === 'streak_3' && updatedStreak >= 3) unlocked = true;
        if (ach.id === 'streak_7' && updatedStreak >= 7) unlocked = true;
        if (ach.id === 'level_5' && updatedChar.level >= 5) unlocked = true;
        if (ach.id === 'level_10' && updatedChar.level >= 10) unlocked = true;

        if (unlocked) {
          newAchievements.push(ach);
        }
      }
    });

    if (newAchievements.length > 0) {
      const updated = [...unlockedAchievements, ...newAchievements.map(a => a.id)];
      setUnlockedAchievements(updated);
      setNewAchievement(newAchievements[0]);
      playSound('achievement');
      setTimeout(() => setNewAchievement(null), 3000);
      return updated;
    }
    
    return unlockedAchievements;
  };

  const xpNeededForLevel = (level) => level * 100;

  const addQuest = (template = null) => {
    let title, category, difficulty;
    
    if (template) {
      title = template.title;
      category = template.category;
      difficulty = template.difficulty;
    } else {
      if (!newQuestTitle.trim()) return;
      title = newQuestTitle;
      category = newQuestCategory;
      difficulty = newQuestDifficulty;
    }
    
    const quest = {
      id: Date.now(),
      title,
      category,
      difficulty,
      xp: DIFFICULTIES[difficulty].xp,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...quests, quest];
    setQuests(updated);
    saveGameData(character, updated, dailyStreak, lastCompletedDate, unlockedAchievements);
    setNewQuestTitle('');
    setShowAddQuest(false);
  };

  const completeQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    let newXp = character.xp + quest.xp;
    let newLevel = character.level;
    let newTotalXp = character.totalXp + quest.xp;
    let leveledUp = false;
    
    while (newXp >= xpNeededForLevel(newLevel)) {
      newXp -= xpNeededForLevel(newLevel);
      newLevel++;
      leveledUp = true;
    }

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
      q.id === questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q
    );

    setCharacter(updatedChar);
    setQuests(updatedQuests);
    setDailyStreak(newStreak);
    setLastCompletedDate(today);

    const updatedAchievements = checkAchievements(updatedChar, updatedQuests, newStreak);
    saveGameData(updatedChar, updatedQuests, newStreak, today, updatedAchievements);

    playSound('complete');
    if (leveledUp) {
      setTimeout(() => playSound('levelup'), 300);
    }
  };

  const deleteQuest = (questId) => {
    const updated = quests.filter(q => q.id !== questId);
    setQuests(updated);
    saveGameData(character, updated, dailyStreak, lastCompletedDate, unlockedAchievements);
  };

  const resetProgress = async () => {
    if (!window.confirm('Are you sure? This will delete all your progress!')) return;
    
    const freshChar = { name: 'Hero', level: 1, xp: 0, totalXp: 0 };
    setCharacter(freshChar);
    setQuests([]);
    setDailyStreak(0);
    setLastCompletedDate(null);
    setUnlockedAchievements([]);
    
    try {
      await window.storage.delete('quest-character');
      await window.storage.delete('quest-list');
      await window.storage.delete('quest-streak');
      await window.storage.delete('quest-last-date');
      await window.storage.delete('quest-achievements');
    } catch (error) {
      console.log('Reset complete');
    }
  };

  const xpPercentage = (character.xp / xpNeededForLevel(character.level)) * 100;
  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);
  const todayCompleted = completedQuests.filter(q => {
    const completedDate = new Date(q.completedAt).toDateString();
    return completedDate === new Date().toDateString();
  });

  // Stats calculations
  const questsByCategory = {};
  Object.keys(CATEGORIES).forEach(cat => {
    questsByCategory[cat] = completedQuests.filter(q => q.category === cat).length;
  });

  const thisWeekCompleted = completedQuests.filter(q => {
    const completedDate = new Date(q.completedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return completedDate >= weekAgo;
  }).length;

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

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .quest-item {
          animation: slideIn 0.3s ease-out;
        }

        .level-badge {
          animation: levelUp 2s infinite;
        }

        .achievement-popup {
          animation: fadeIn 0.5s ease-out, bounce 1s ease-in-out 0.5s;
        }
      `}</style>

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="achievement-popup" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 10px 40px rgba(255, 215, 0, 0.6)',
          zIndex: 1000,
          maxWidth: '300px',
          border: '3px solid #FFF'
        }}>
          <div style={{ fontSize: '2.5em', textAlign: 'center', marginBottom: '10px' }}>
            {newAchievement.icon}
          </div>
          <div style={{ color: '#000', fontWeight: 700, fontSize: '1.2em', textAlign: 'center' }}>
            Achievement Unlocked!
          </div>
          <div style={{ color: '#000', marginTop: '5px', textAlign: 'center', fontWeight: 700 }}>
            {newAchievement.name}
          </div>
          <div style={{ color: '#333', fontSize: '0.9em', marginTop: '5px', textAlign: 'center' }}>
            {newAchievement.description}
          </div>
        </div>
      )}
      {/* Help Modal */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setShowHelp(false)}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '700px',
            maxHeight: '85vh',
            overflow: 'auto',
            border: '2px solid rgba(138, 43, 226, 0.5)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            <button
              onClick={() => setShowHelp(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 0, 0, 0.2)',
                border: '1px solid rgba(255, 0, 0, 0.5)',
                color: '#ff6b6b',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'inherit'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ margin: '0 0 25px 0', fontSize: '2.2em', fontWeight: 900, color: '#8a2be2' }}>
              <HelpCircle style={{ display: 'inline', marginRight: '12px' }} />
              Quick Start Guide
            </h2>

            <div style={{ fontSize: '1.05em', lineHeight: '1.7' }}>
              <h3 style={{ color: '#FFD700', marginTop: '0' }}>🎮 What is Quest Daily?</h3>
              <p>Turn your tasks into epic quests! Earn XP, level up, unlock achievements.</p>

              <h3 style={{ color: '#FFD700', marginTop: '25px' }}>✨ Creating Quests</h3>
              <p><strong>Quick Templates:</strong> Click template buttons (e.g., "Morning workout")</p>
              <p><strong>Custom Quest:</strong> Click "Custom Quest", fill form, choose category & difficulty</p>

              <h3 style={{ color: '#FFD700', marginTop: '25px' }}>🎯 Categories</h3>
              <p>💼 <strong>Work</strong> (Blue) | 🏋️ <strong>Fitness</strong> (Red) | 📚 <strong>Study</strong> (Green) | ❤️ <strong>Personal</strong> (Pink)</p>

              <h3 style={{ color: '#FFD700', marginTop: '25px' }}>⚡ Difficulty</h3>
              <p><strong>Easy:</strong> 50 XP | <strong>Medium:</strong> 100 XP | <strong>Hard:</strong> 200 XP</p>

              <h3 style={{ color: '#FFD700', marginTop: '25px' }}>📈 Leveling System</h3>
              <p>Each level needs <strong>Level × 100 XP</strong></p>
              <p>Level 1→2: 100 XP | Level 2→3: 200 XP | Level 10→11: 1000 XP</p>

              <h3 style={{ color: '#FFD700', marginTop: '25px' }}>🔥 Daily Streaks</h3>
              <p>Complete 1+ quest daily to keep your streak alive!</p>
              <p>🔥 3-Day Streak | ⚡ Weekly Warrior (7 days)</p>

              <h3 style={{ color: '#FFD700', marginTop: '25px' }}>🏆 Achievements (8 Total)</h3>
              <p>🎯 First Quest | 🔥 3-Day Streak | ⚡ Weekly Warrior | ⭐ Level 5 | 🏆 Level 10 | 💪 10 Quests | 🎖️ 50 Quests | 👑 Century Club (100)</p>

              <h3 style={{ color: '#FFD700', marginTop: '25px' }}>📊 Statistics</h3>
              <p>Click <strong>Stats</strong> button to view weekly progress, total quests, longest streak, and category breakdown</p>

              <h3 style={{ color: '#FFD700', marginTop: '25px' }}>💡 Pro Tips</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Start with 3-5 quests per day</li>
                <li>Use Quick Templates for routine tasks</li>
                <li>Balance all 4 categories for life balance</li>
                <li>Add 1 easy quest daily to maintain streaks</li>
                <li>Check Stats regularly to track progress</li>
              </ul>

              <div style={{
                background: 'rgba(138, 43, 226, 0.2)',
                border: '2px solid rgba(138, 43, 226, 0.5)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '30px',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '1.1em', fontWeight: 700 }}>📥 Want the complete guide?</p>
                <button
                  onClick={downloadUserGuide}
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                    border: 'none',
                    color: '#000',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'inherit',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <Download size={18} />
                  Download Full Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
              <div style={{ marginTop: '15px' }}>
                <p style={{ margin: '10px 0', fontSize: '1.2em', opacity: 0.9 }}>
                  Turn your daily tasks into epic quests!
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.95em', opacity: 0.7, maxWidth: '600px' }}>
                  Earn XP for completed tasks, level up your character, and maintain your daily streak. 
                  Gamification helps you stay motivated and productive every day! 🎮
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                style={{
                  background: soundEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${soundEnabled ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
                  color: soundEnabled ? '#10b981' : '#ef4444',
                  padding: '8px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  fontFamily: 'inherit'
                }}
              >
                🔊 {soundEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                  color: '#FFD700',
                  padding: '8px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Award size={16} />
                Achievements
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  color: '#3b82f6',
                  padding: '8px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <BarChart3 size={16} />
                Stats
              </button>              <button
                onClick={() => setShowHelp(true)}
                style={{
                  background: 'rgba(236, 72, 153, 0.2)',
                  border: '1px solid rgba(236, 72, 153, 0.5)',
                  color: '#ec4899',
                  padding: '8px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <HelpCircle size={16} />
                Help
              </button>
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
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Achievements Panel */}
        {showAchievements && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '2em', fontWeight: 700, color: '#FFD700' }}>
              <Award style={{ display: 'inline', marginRight: '10px' }} />
              Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {ACHIEVEMENTS.map(ach => {
                const unlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div key={ach.id} style={{
                    background: unlocked ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2))' : 'rgba(0, 0, 0, 0.3)',
                    border: `2px solid ${unlocked ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '12px',
                    padding: '15px',
                    textAlign: 'center',
                    opacity: unlocked ? 1 : 0.5,
                    transition: 'all 0.3s'
                  }}>
                    <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{ach.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9em', marginBottom: '5px' }}>{ach.name}</div>
                    <div style={{ fontSize: '0.75em', opacity: 0.8 }}>{ach.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Panel */}
        {showStats && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '2em', fontWeight: 700, color: '#3b82f6' }}>
              <BarChart3 style={{ display: 'inline', marginRight: '10px' }} />
              Statistics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '1.2em', opacity: 0.8, marginBottom: '10px' }}>
                  <Calendar style={{ display: 'inline', marginRight: '8px' }} />
                  This Week
                </div>
                <div style={{ fontSize: '3em', fontWeight: 900, color: '#3b82f6' }}>{thisWeekCompleted}</div>
                <div style={{ opacity: 0.7, marginTop: '5px' }}>completed quests</div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '1.2em', opacity: 0.8, marginBottom: '10px' }}>
                  <Target style={{ display: 'inline', marginRight: '8px' }} />
                  Total
                </div>
                <div style={{ fontSize: '3em', fontWeight: 900, color: '#10b981' }}>{completedQuests.length}</div>
                <div style={{ opacity: 0.7, marginTop: '5px' }}>all quests</div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '1.2em', opacity: 0.8, marginBottom: '10px' }}>
                  <Flame style={{ display: 'inline', marginRight: '8px' }} />
                  Longest Streak
                </div>
                <div style={{ fontSize: '3em', fontWeight: 900, color: '#ef4444' }}>{Math.max(dailyStreak, 0)}</div>
                <div style={{ opacity: 0.7, marginTop: '5px' }}>days in a row</div>
              </div>
            </div>

            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontSize: '1.5em', marginBottom: '15px' }}>Quests by Category</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {Object.entries(CATEGORIES).map(([key, cat]) => {
                  const count = questsByCategory[key] || 0;
                  const total = completedQuests.length || 1;
                  const percentage = (count / total) * 100;
                  const Icon = cat.icon;
                  
                  return (
                    <div key={key} style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '10px',
                      padding: '15px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Icon size={18} style={{ color: cat.color }} />
                          {cat.name}
                        </span>
                        <span style={{ fontWeight: 700 }}>{count} quests</span>
                      </div>
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        height: '10px',
                        borderRadius: '5px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: cat.color,
                          width: `${percentage}%`,
                          height: '100%',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
              Quick Stats
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
                  {todayCompleted.length}
                </div>
                <div style={{ opacity: 0.8, marginTop: '5px' }}>
                  <Check size={14} style={{ display: 'inline', marginRight: '5px' }} />
                  Completed Today
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quest Templates */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(138, 43, 226, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3em', fontWeight: 700 }}>
            <Sparkles style={{ display: 'inline', marginRight: '8px' }} />
            Quick Templates
          </h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {TEMPLATES.map((template, idx) => {
              const cat = CATEGORIES[template.category];
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => addQuest(template)}
                  style={{
                    background: cat.bgColor,
                    border: `2px solid ${cat.color}`,
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = `0 5px 15px ${cat.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <Icon size={16} style={{ color: cat.color }} />
                  {template.title}
                  <span style={{ 
                    background: DIFFICULTIES[template.difficulty].color,
                    color: '#000',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.75em',
                    fontWeight: 700
                  }}>
                    +{DIFFICULTIES[template.difficulty].xp}
                  </span>
                </button>
              );
            })}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '2em', fontWeight: 700 }}>
              <Sparkles style={{ display: 'inline', marginRight: '10px' }} />
              Active Quests ({activeQuests.length})
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
              Custom Quest
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
                placeholder="Quest title..."
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
                  <span>Category:</span>
                  <select
                    value={newQuestCategory}
                    onChange={(e) => setNewQuestCategory(e.target.value)}
                    style={{
                      padding: '10px',
                      fontSize: '1em',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(138, 43, 226, 0.5)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.name}</option>
                    ))}
                  </select>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>Difficulty:</span>
                  <select
                    value={newQuestDifficulty}
                    onChange={(e) => setNewQuestDifficulty(e.target.value)}
                    style={{
                      padding: '10px',
                      fontSize: '1em',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(138, 43, 226, 0.5)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    {Object.entries(DIFFICULTIES).map(([key, diff]) => (
                      <option key={key} value={key}>{diff.name} (+{diff.xp} XP)</option>
                    ))}
                  </select>
                </label>
                
                <button
                  onClick={() => addQuest()}
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
                No active quests. Create your first quest or use a template!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {activeQuests.map((quest, index) => {
                const cat = CATEGORIES[quest.category];
                const Icon = cat.icon;
                const diff = DIFFICULTIES[quest.difficulty];
                
                return (
                  <div
                    key={quest.id}
                    className="quest-item"
                    style={{
                      background: `linear-gradient(135deg, ${cat.bgColor}, rgba(75, 0, 130, 0.2))`,
                      border: `2px solid ${cat.color}`,
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
                      e.currentTarget.style.boxShadow = `0 5px 20px ${cat.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <Icon size={28} style={{ color: cat.color }} />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '1.3em', fontWeight: 700 }}>
                          {quest.title}
                        </h3>
                        <p style={{ margin: '8px 0 0 0', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ 
                            background: cat.color,
                            color: '#000',
                            padding: '3px 8px',
                            borderRadius: '5px',
                            fontSize: '0.75em',
                            fontWeight: 700
                          }}>
                            {cat.name}
                          </span>
                          <span style={{ 
                            background: diff.color,
                            color: '#000',
                            padding: '3px 8px',
                            borderRadius: '5px',
                            fontSize: '0.75em',
                            fontWeight: 700
                          }}>
                            {diff.name}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Zap size={14} style={{ color: '#FFD700' }} />
                            +{quest.xp} XP
                          </span>
                        </p>
                      </div>
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
                );
              })}
            </div>
          )}

          {todayCompleted.length > 0 && (
            <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '2px solid rgba(138, 43, 226, 0.3)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em', opacity: 0.7 }}>
                Completed Today ({todayCompleted.length})
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {todayCompleted.map(quest => {
                  const cat = CATEGORIES[quest.category];
                  const Icon = cat.icon;
                  
                  return (
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
                      <Icon size={18} style={{ color: cat.color }} />
                      <span style={{ flex: 1 }}>{quest.title}</span>
                      <span style={{ color: '#00ff88', fontWeight: 700 }}>+{quest.xp} XP</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(138, 43, 226, 0.3)',
          opacity: 0.6,
          fontSize: '0.9em'
        }}>
          Created by ©JanMi 2026
        </div>
        
      </div>
    </div>
  );
}