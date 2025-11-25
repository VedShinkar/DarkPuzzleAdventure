import { useEffect } from "react";
import { useGameState } from "./lib/stores/useGameState";
import { useAudio } from "./lib/stores/useAudio";
import { MainMenu } from "./components/MainMenu";
import { CharacterSelect } from "./components/CharacterSelect";
import { GhostDialog } from "./components/GhostDialog";
import { CompletionScreen } from "./components/CompletionScreen";
import { Level1 } from "./components/levels/Level1";
import { Level2 } from "./components/levels/Level2";
import { Level3 } from "./components/levels/Level3";
import "@fontsource/inter";

function App() {
  const { currentScreen } = useGameState();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Load audio assets (will be played only on user interaction)
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hitAudio = new Audio("/sounds/hit.mp3");
    hitAudio.volume = 0.4;
    setHitSound(hitAudio);

    const successAudio = new Audio("/sounds/success.mp3");
    successAudio.volume = 0.5;
    setSuccessSound(successAudio);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {currentScreen === "main_menu" && <MainMenu />}
      {currentScreen === "character_select" && <CharacterSelect />}
      {currentScreen === "level_1" && <Level1 />}
      {currentScreen === "level_2" && <Level2 />}
      {currentScreen === "level_3" && <Level3 />}
      {currentScreen === "ghost_dialog" && <GhostDialog />}
      {currentScreen === "completion" && <CompletionScreen />}
    </div>
  );
}

export default App;
