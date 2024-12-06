import { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import welcome from './assets/welcome.m4a';
import spin from './assets/spin.m4a';
import './App.css';

function App() {
  const originalQuestions = [
    // Genuine questions
    "What's your biggest aspiration in life?",
    "If you could have dinner with any historical figure, who would it be and why?",
    "What memory instantly makes you smile?",
    "What's one skill you wish you could master instantly?",
    "If you could live anywhere in the world, where would it be?",
    "Who has been the most influential person in your life and why?",
    "What's the best piece of advice you've ever received?",
    "If you had to sum up your personality in three words, what would they be?",
    "What's a personal goal you hope to achieve in the next year?",
    "What does happiness mean to you?",
    "If you could time travel, would you visit the past or the future?",
    "What's your favorite way to unwind after a stressful day?",
    "What hobby or interest have you always wanted to try but never did?",
    "If you could start your own business, what would it be?",
    "What’s something that always brings you joy, no matter what?",

    // Weird questions
    "What is the worst thing you've ever done?",
    "Would you rather be deep fried or boiled in Dr. Pepper?",
    "If you had to replace one of your hands with a kitchen utensil, which would you choose and why?",
    "You wake up one morning with a unicycle permanently attached to your feet—how do you go about your day?",
    "If you could communicate only in movie quotes for the rest of your life, would you do it?",
    "If your shadow started giving you unsolicited life advice, would you listen?",
    "If you had to pick a personal theme song every time you walked into a room, what would it be?",
    "If the alphabet decided to rearrange itself, which letter would you petition to be first?",
    "If you were forced to live in a giant bucket of Jello for a month, how would you pass the time?",
    "If you had to teach a class on a completely made-up subject, what would it be called?"
  ];

  const [isExploded, setIsExploded] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([...originalQuestions]);
  const [currentQuestion, setCurrentQuestion] = useState('');

  useEffect(() => {
    // Set initial question to a random one from the pool
    setCurrentQuestion(availableQuestions[Math.floor(Math.random() * availableQuestions.length)]);
  }, []);

  const handleLogoClick = () => {
    setIsExploded(true);

    // Play the welcome sound effect
    const audio = new Audio(welcome);
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });

    setTimeout(() => {
      const header = document.querySelector('.App-header');
      const mainPage = document.querySelector('.Main-page');
      if (header && mainPage) {
        header.style.display = 'none';
        mainPage.style.display = 'block';
        mainPage.classList.add('bounce-in');
      }
    }, 2000);
  };

  const startSlotMachine = () => {
    if (isSpinning) return;

    // Play the spin sound effect
    const audio = new Audio(spin);
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });

    setIsSpinning(true);
    const questionElem = document.querySelector('.question-display');

    // Number of spins (including final selection)
    const totalSpins = 6; 
    let count = 0;

    const delays = [0, 50, 100, 200, 400];

    const spinIteration = () => {
      if (count >= totalSpins) {
        // Done spinning
        setIsSpinning(false);
        return;
      }

      questionElem.classList.add('fade-out-down');

      setTimeout(() => {
        // Choose a random question from the available pool
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const chosenQuestion = availableQuestions[randomIndex];

        // On the final spin, we will select this question and remove it from the pool
        const isFinalSpin = (count === totalSpins - 1);

        if (isFinalSpin) {
          // Remove the chosen question from availableQuestions
          const newPool = [...availableQuestions];
          newPool.splice(randomIndex, 1); 
          setAvailableQuestions(newPool);

          // If we've used all questions, reset the pool
          if (newPool.length === 0) {
            setAvailableQuestions([...originalQuestions]);
          }
        }

        // Update current question (whether final spin or intermediate)
        setCurrentQuestion(chosenQuestion);

        // Animate fade in
        questionElem.classList.remove('fade-out-down');
        questionElem.classList.add('fade-in-up');

        setTimeout(() => {
          questionElem.classList.remove('fade-in-up');

          // Schedule next iteration if not done
          if (count < totalSpins - 1) {
            // Use delays for intermediate spins only, not the final one
            const delay = count < delays.length ? delays[count] : delays[delays.length - 1];
            setTimeout(spinIteration, delay);
          } else {
            // Final spin completed
            setIsSpinning(false);
          }

          count++;
        }, 200); // Fade-in duration
      }, 200); // Fade-out duration
    };

    spinIteration();
  };

  return (
    <div className="App">
      <header className={`App-header ${isExploded ? 'exploded' : ''}`}>
        <img
          src={logo}
          className={`App-logo ${isExploded ? 'App-logo-explode' : ''}`}
          alt="logo"
          onClick={handleLogoClick}
        />
      </header>
      <main className="Main-page">
        <h1>Georgia's Question of the Day!</h1>
        <div className="question-container">
          <p className="question-display">{currentQuestion}</p>
        </div>
        <button className="pull-lever-btn" onClick={startSlotMachine} disabled={isSpinning}>
          SPIN!
        </button>
      </main>
      <footer style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', color: '#fff' }}>
        <p>
          ***Disclaimer: This product is strictly prohibited by BlackRock. Any individual engaging with this product
          may be subject to legal enforcement measures.***
        </p>
      </footer>
    </div>
  );
}

export default App;
