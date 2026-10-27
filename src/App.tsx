import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TitleBar } from './components/TitleBar';
import { Scoreboard } from './components/Scoreboard';
import { Board } from './components/Board';
import { GameControls } from './components/GameControls';
import { SettingsModal } from './components/SettingsModal';
import { MoveHistoryModal } from './components/MoveHistoryModal';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import {
  BoardState,
  Player,
  WinningInfo,
  GameStatus,
  ScoreState,
  GameSettings,
  MoveRecord,
} from './types';
import {
  createInitialBoard,
  makeMove,
  makeInfiniteMove,
  getGameStatus,
  switchPlayer,
  indexToNotation,
} from './core/gameEngine';
import { getAIMove } from './ai/minimax';
import { sound } from './audio/soundEngine';
import { fireVictoryConfetti } from './utils/confetti';
import { Trophy, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from './i18n/translations';

const STORAGE_SETTINGS_KEY = 'cyber_ttt_settings';
const STORAGE_SCORE_KEY = 'cyber_ttt_score';

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'ai',
  ruleVariant: 'infinite',
  theme: 'dark',
  language: 'ru',
  difficulty: 'impossible',
  humanPlayer: 'X',
  playerXName: 'Игрок X',
  playerOName: 'Кибер AI',
  soundEnabled: true,
  soundVolume: 0.5,
  showVanishingWarning: true,
};

const DEFAULT_SCORE: ScoreState = {
  xWins: 0,
  oWins: 0,
  draws: 0,
  totalGames: 0,
};

export const App: React.FC = () => {
  // Load persistent settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Load persistent score
  const [score, setScore] = useState<ScoreState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SCORE_KEY);
      return saved ? { ...DEFAULT_SCORE, ...JSON.parse(saved) } : DEFAULT_SCORE;
    } catch {
      return DEFAULT_SCORE;
    }
  });

  // Game Board State
  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('in_progress');
  const [winningInfo, setWinningInfo] = useState<WinningInfo | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Modals & Panels
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Move tracking queues for Infinite Mode
  const [xMoves, setXMoves] = useState<number[]>([]);
  const [oMoves, setOMoves] = useState<number[]>([]);

  // Detailed Move History
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);

  // Hint State
  const [hintCell, setHintCell] = useState<number | null>(null);

  const t = translations[settings.language ?? 'ru'];

  // Apply Theme to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Sync sound settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
    sound.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Persist score
  useEffect(() => {
    localStorage.setItem(STORAGE_SCORE_KEY, JSON.stringify(score));
  }, [score]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Fast theme toggler
  const handleToggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  // Fast language toggler (RU <-> EN)
  const handleToggleLanguage = useCallback(() => {
    setSettings((prev) => {
      const nextLang = prev.language === 'ru' ? 'en' : 'ru';
      return {
        ...prev,
        language: nextLang,
      };
    });
  }, []);

  // Determine which player is AI
  const isHumanTurn =
    gameStatus === 'in_progress' &&
    !isThinking &&
    (settings.mode === 'pvp' || currentTurn === settings.humanPlayer);

  // Determine if a piece on the board is about to vanish
  const activeMoves = currentTurn === 'X' ? xMoves : oMoves;
  const vanishingIndex =
    settings.showVanishingWarning &&
    settings.ruleVariant === 'infinite' &&
    gameStatus === 'in_progress' &&
    activeMoves.length >= 3
      ? activeMoves[0]
      : null;

  // Reset or start new game
  const handleRestartGame = useCallback(() => {
    setBoard(createInitialBoard());
    setCurrentTurn('X');
    setGameStatus('in_progress');
    setWinningInfo(null);
    setIsThinking(false);
    setXMoves([]);
    setOMoves([]);
    setMoveHistory([]);
    setHintCell(null);
  }, []);

  // Reset score tracker
  const handleResetScore = useCallback(() => {
    setScore(DEFAULT_SCORE);
    handleRestartGame();
  }, [handleRestartGame]);

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    setSettings((prev) => {
      const nextEnabled = !prev.soundEnabled;
      sound.setEnabled(nextEnabled);
      return { ...prev, soundEnabled: nextEnabled };
    });
  }, []);

  // Hint Request handler
  const handleRequestHint = useCallback(() => {
    if (!isHumanTurn || gameStatus !== 'in_progress') return;

    sound.playHintSound();

    const humanMoves = currentTurn === 'X' ? xMoves : oMoves;
    const opponentMoves = currentTurn === 'X' ? oMoves : xMoves;

    const bestMove = getAIMove(
      board,
      currentTurn,
      'impossible',
      settings.ruleVariant,
      humanMoves,
      opponentMoves
    );

    if (bestMove >= 0) {
      setHintCell(bestMove);

      window.setTimeout(() => {
        setHintCell((prev) => (prev === bestMove ? null : prev));
      }, 4500);
    }
  }, [isHumanTurn, gameStatus, currentTurn, xMoves, oMoves, board, settings.ruleVariant]);

  // Handle move execution
  const executeMove = useCallback(
    (index: number, player: Player) => {
      try {
        let nextBoard: BoardState;
        let evictedIndex: number | null = null;

        if (settings.ruleVariant === 'infinite') {
          const currentMoves = player === 'X' ? xMoves : oMoves;
          const result = makeInfiniteMove(board, index, player, currentMoves);
          nextBoard = result.nextBoard;
          evictedIndex = result.removedIndex;

          if (evictedIndex !== null) {
            sound.playVanishSound();
          }

          if (player === 'X') {
            setXMoves(result.nextMoves);
          } else {
            setOMoves(result.nextMoves);
          }
        } else {
          nextBoard = makeMove(board, index, player);
          if (player === 'X') {
            setXMoves((prev) => [...prev, index]);
          } else {
            setOMoves((prev) => [...prev, index]);
          }
        }

        const newRecord: MoveRecord = {
          moveNumber: moveHistory.length + 1,
          player,
          cellIndex: index,
          notation: indexToNotation(index),
          evictedIndex,
          evictedNotation: evictedIndex !== null ? indexToNotation(evictedIndex) : undefined,
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setMoveHistory((prev) => [...prev, newRecord]);

        setHintCell(null);
        setBoard(nextBoard);

        if (player === 'X') {
          sound.playMoveX();
        } else {
          sound.playMoveO();
        }

        const evaluation = getGameStatus(nextBoard, settings.ruleVariant);

        if (evaluation.status === 'won' && evaluation.winningInfo) {
          setGameStatus('won');
          setWinningInfo(evaluation.winningInfo);
          sound.playWinFanfare();
          fireVictoryConfetti(player);

          setScore((prev) => ({
            ...prev,
            xWins: player === 'X' ? prev.xWins + 1 : prev.xWins,
            oWins: player === 'O' ? prev.oWins + 1 : prev.oWins,
            totalGames: prev.totalGames + 1,
          }));
        } else if (evaluation.status === 'draw') {
          setGameStatus('draw');
          sound.playDrawSound();

          setScore((prev) => ({
            ...prev,
            draws: prev.draws + 1,
            totalGames: prev.totalGames + 1,
          }));
        } else {
          setCurrentTurn(switchPlayer(player));
        }
      } catch (err) {
        console.error('Move error:', err);
      }
    },
    [board, settings.ruleVariant, xMoves, oMoves, moveHistory.length]
  );

  // Human player click handler
  const handleCellClick = useCallback(
    (index: number) => {
      if (!isHumanTurn || board[index] !== null) return;
      executeMove(index, currentTurn);
    },
    [isHumanTurn, board, currentTurn, executeMove]
  );

  // AI thinking and move trigger
  const aiTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }

    if (
      settings.mode === 'ai' &&
      gameStatus === 'in_progress' &&
      currentTurn !== settings.humanPlayer
    ) {
      setIsThinking(true);
      sound.playThinkingTick();

      const delay = Math.floor(Math.random() * 160) + 320;

      aiTimeoutRef.current = window.setTimeout(() => {
        const aiPlayer = currentTurn;
        const aiMoves = aiPlayer === 'X' ? xMoves : oMoves;
        const humanMoves = aiPlayer === 'X' ? oMoves : xMoves;

        const move = getAIMove(
          board,
          aiPlayer,
          settings.difficulty,
          settings.ruleVariant,
          aiMoves,
          humanMoves
        );
        setIsThinking(false);

        if (move >= 0) {
          executeMove(move, aiPlayer);
        }
      }, delay);
    }

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [
    board,
    currentTurn,
    gameStatus,
    settings.mode,
    settings.humanPlayer,
    settings.difficulty,
    settings.ruleVariant,
    xMoves,
    oMoves,
    executeMove,
  ]);

  // Handle settings update
  const handleSaveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    handleRestartGame();
  };

  const getWinnerName = () => {
    if (winningInfo?.winner === 'X') return settings.playerXName;
    if (winningInfo?.winner === 'O') return settings.playerOName;
    return '';
  };

  const isDark = settings.theme === 'dark';

  return (
    <div
      className={`flex flex-col h-screen w-screen select-none overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-cyber-bg text-cyber-text' : 'bg-[#f4f7fb] text-slate-800'
      }`}
    >
      {/* Frameless Top Window Bar */}
      <TitleBar
        mode={settings.mode}
        difficulty={settings.difficulty}
        ruleVariant={settings.ruleVariant}
        theme={settings.theme}
        language={settings.language}
        onToggleTheme={handleToggleTheme}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-between items-center px-4 py-3 max-w-4xl mx-auto w-full overflow-y-auto">
        {/* Scoreboard */}
        <section className="w-full">
          <Scoreboard
            score={score}
            currentTurn={currentTurn}
            isGameActive={gameStatus === 'in_progress'}
            gameMode={settings.mode}
            ruleVariant={settings.ruleVariant}
            theme={settings.theme}
            language={settings.language}
            humanPlayer={settings.humanPlayer}
            playerXName={settings.playerXName}
            playerOName={settings.playerOName}
            xPiecesCount={xMoves.length}
            oPiecesCount={oMoves.length}
          />
        </section>

        {/* AI Thinking State Indicator */}
        <section className="w-full my-0.5">
          <ThinkingIndicator
            isThinking={isThinking}
            aiPlayer={settings.playerOName}
            language={settings.language}
          />
        </section>

        {/* 3x3 Game Board with Center Stage */}
        <section className="relative w-full flex items-center justify-center my-auto">
          <Board
            board={board}
            winningInfo={winningInfo}
            vanishingIndex={vanishingIndex}
            hintCell={hintCell}
            currentTurn={currentTurn}
            isHumanTurn={isHumanTurn}
            isGameActive={gameStatus === 'in_progress'}
            theme={settings.theme}
            language={settings.language}
            onCellClick={handleCellClick}
          />

          {/* Victory / Draw Overlay Banner */}
          <AnimatePresence>
            {gameStatus !== 'in_progress' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md rounded-3xl"
              >
                <div
                  className={`p-6 rounded-2xl glass-panel text-center max-w-xs w-full shadow-2xl border ${
                    isDark ? 'border-cyber-borderGlow/80' : 'border-slate-300'
                  }`}
                >
                  {gameStatus === 'won' && winningInfo && (
                    <>
                      <div className="inline-flex p-3 rounded-full bg-neon-cyan/15 border border-neon-cyan/40 mb-3">
                        <Trophy
                          className={`w-8 h-8 ${
                            winningInfo.winner === 'X' ? 'text-neon-cyan' : 'text-neon-rose'
                          }`}
                        />
                      </div>
                      <h4
                        className={`text-xl font-black font-mono tracking-tight mb-1 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {t.victoryTitle}
                      </h4>
                      <p
                        className={`text-xs font-mono mb-4 ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {t.victoryDesc(getWinnerName(), winningInfo.winner)}
                      </p>
                    </>
                  )}

                  {gameStatus === 'draw' && (
                    <>
                      <div className="inline-flex p-3 rounded-full bg-amber-500/15 border border-amber-500/40 mb-3">
                        <Zap className="w-8 h-8 text-amber-500" />
                      </div>
                      <h4
                        className={`text-xl font-black font-mono tracking-tight mb-1 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {t.drawTitle}
                      </h4>
                      <p
                        className={`text-xs font-mono mb-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {t.drawDesc}
                      </p>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick(650);
                      handleRestartGame();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neon-cyan hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs shadow-neon-cyan active:scale-95 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.btnPlayAgain}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Controls Bar */}
        <section className="w-full mt-2">
          <GameControls
            onRestartGame={handleRestartGame}
            onResetScore={handleResetScore}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onRequestHint={handleRequestHint}
            canHint={isHumanTurn && gameStatus === 'in_progress'}
            soundEnabled={settings.soundEnabled}
            language={settings.language}
            onToggleSound={handleToggleSound}
          />
        </section>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Move History Modal */}
      <MoveHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        moves={moveHistory}
        theme={settings.theme}
        language={settings.language}
        playerXName={settings.playerXName}
        playerOName={settings.playerOName}
      />
    </div>
  );
};
