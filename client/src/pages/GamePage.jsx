import { useState, useRef } from 'react';
import SetupPhase from "../components/game/SetupPhase.jsx";
import PlanningPhase from "../components/game/PlanningPhase.jsx";
import ExecutionPhase from "../components/game/ExecutionPhase.jsx";
import ResultPhase from "../components/game/ResultPhase.jsx";
import { STATIC_NETWORK } from "../constants/network.js";

function GamePage() {
    // Which phase we're in
    const [phase, setPhase] = useState('setup');

    // Start and end stations assigned by server
    const [gameData, setGameData] = useState(null);

    // Route the player builds during planning
    const [playerRoute, setPlayerRoute] = useState([]);

    // Final execution result (steps + score)
    const [executionResult, setExecutionResult] = useState(null);

    // Guard to prevent multiple quick clicks on the play button
    const isStarting = useRef(false);

    // Fetches a fresh game (new start/end stations) when the user clicks "Ready to Play"
    const handleStartGame = () => {
        if (isStarting.current) return;
        isStarting.current = true;

        fetch('http://localhost:3001/api/games/start', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setGameData({
                    startStation: data.startStation,
                    endStation: data.endStation
                });
                setPhase('planning');
            })
            .catch(err => console.error(err))
            .finally(() => {
                isStarting.current = false;
            });
    };

    // Render the correct phase
    return (
        <div>
            {phase === 'setup' &&
                <SetupPhase
                    network={STATIC_NETWORK}
                    onStart={handleStartGame}
                />}
            {phase === 'planning' &&
                <PlanningPhase
                    network={STATIC_NETWORK}
                    gameData={gameData}
                    playerRoute={playerRoute}
                    setPlayerRoute={setPlayerRoute}
                    onSubmit={() => setPhase('execution')}
                />}
            {phase === 'execution' &&
                <ExecutionPhase
                    playerRoute={playerRoute}
                    onFinish={(result) => {
                        setExecutionResult(result);
                        setPhase('result');
                    }}
                />}
            {phase === 'result' &&
                <ResultPhase
                    result={executionResult}
                    onRestart={() => {
                        setPhase('setup');
                        setPlayerRoute([]);
                        setExecutionResult(null);
                        setGameData(null); // Clear gameData for the new game setup
                    }}
                />}
        </div>
    );
}

export default GamePage;