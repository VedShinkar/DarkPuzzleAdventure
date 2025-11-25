import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameScreen = 
  | "main_menu" 
  | "character_select" 
  | "level_1" 
  | "level_2" 
  | "level_3"
  | "ghost_dialog"
  | "completion";

export type Character = "male" | "female" | null;

interface LevelProgress {
  level1Complete: boolean;
  level2Complete: boolean;
  level3Complete: boolean;
}

interface GameState {
  currentScreen: GameScreen;
  selectedCharacter: Character;
  levelProgress: LevelProgress;
  currentLevel: number;
  showGhostDialog: boolean;
  ghostDialogLevel: number;
  
  // Actions
  setScreen: (screen: GameScreen) => void;
  selectCharacter: (character: "male" | "female") => void;
  completeLevel: (level: number) => void;
  startLevel: (level: number) => void;
  showGhost: (level: number) => void;
  hideGhost: () => void;
  resetGame: () => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set) => ({
    currentScreen: "main_menu",
    selectedCharacter: null,
    levelProgress: {
      level1Complete: false,
      level2Complete: false,
      level3Complete: false,
    },
    currentLevel: 0,
    showGhostDialog: false,
    ghostDialogLevel: 0,
    
    setScreen: (screen) => set({ currentScreen: screen }),
    
    selectCharacter: (character) => set({ 
      selectedCharacter: character,
      currentScreen: "level_1",
      currentLevel: 1
    }),
    
    completeLevel: (level) => set((state) => {
      const newProgress = { ...state.levelProgress };
      if (level === 1) newProgress.level1Complete = true;
      if (level === 2) newProgress.level2Complete = true;
      if (level === 3) newProgress.level3Complete = true;
      
      return {
        levelProgress: newProgress,
        showGhostDialog: true,
        ghostDialogLevel: level,
        currentScreen: "ghost_dialog"
      };
    }),
    
    startLevel: (level) => set({ 
      currentLevel: level,
      currentScreen: level === 1 ? "level_1" : level === 2 ? "level_2" : "level_3"
    }),
    
    showGhost: (level) => set({
      showGhostDialog: true,
      ghostDialogLevel: level,
      currentScreen: "ghost_dialog"
    }),
    
    hideGhost: () => set((state) => {
      const nextLevel = state.ghostDialogLevel + 1;
      let nextScreen: GameScreen = "main_menu";
      
      if (nextLevel === 2 && state.levelProgress.level1Complete) {
        nextScreen = "level_2";
      } else if (nextLevel === 3 && state.levelProgress.level2Complete) {
        nextScreen = "level_3";
      } else if (nextLevel === 4 && state.levelProgress.level3Complete) {
        nextScreen = "completion";
      }
      
      return {
        showGhostDialog: false,
        currentScreen: nextScreen,
        currentLevel: nextLevel <= 3 ? nextLevel : 0
      };
    }),
    
    resetGame: () => set({
      currentScreen: "main_menu",
      selectedCharacter: null,
      levelProgress: {
        level1Complete: false,
        level2Complete: false,
        level3Complete: false,
      },
      currentLevel: 0,
      showGhostDialog: false,
      ghostDialogLevel: 0,
    }),
  }))
);
