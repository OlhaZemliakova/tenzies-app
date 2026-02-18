import { useState, useEffect, useRef } from "react";
import "./App.css";
import Die from "./Die";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = useState(generateAllNewDice());
  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem("bestScore")) || null,
  );
  const [counter, setCounter] = useState(0);

  const newGameBtn = useRef(null);

  const wonGame =
    dice.every((die) => die.isHeld === true) &&
    dice.every((die) => die.value === dice[0].value);

  useEffect(() => {
    if (wonGame) {
      newGameBtn.current.focus();
      setBestScore((prevBest) => {
        const newBest =
          prevBest === null ? counter : Math.min(prevBest, counter);
        localStorage.setItem("bestScore", newBest);
        return newBest;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonGame]);

  function generateAllNewDice() {
    return Array.from({ length: 10 }, () => ({
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: crypto.randomUUID(),
    }));
  }

  function rollDice() {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.isHeld ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 },
      ),
    );
    setCounter((prev) => prev + 1);
  }

  function holdDie(id) {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die,
      ),
    );
  }

  function newGame() {
    setDice(generateAllNewDice());
    setCounter(0);
  }

  function handleClick() {
    if (wonGame) {
      newGame();
    } else {
      rollDice();
    }
  }

  return (
    <main>
      <h1>Tenzies</h1>
      <p>
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <p>
        {wonGame
          ? `You won in ${counter} ${counter === 1 ? "roll" : "rolls"}! 🎉`
          : `Roll count: ${counter}`}
      </p>
      {bestScore && <p>Best: {bestScore} rolls 🏆</p>}
      {wonGame && <Confetti />}
      <div className="dice-container">
        {dice.map((die) => (
          <Die
            key={die.id}
            value={die.value}
            hold={() => holdDie(die.id)}
            isHeld={die.isHeld}
          />
        ))}
      </div>

      <button ref={newGameBtn} className="roll-button" onClick={handleClick}>
        {wonGame ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
