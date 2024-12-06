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

  const [confettiPieces, setConfettiPieces] = useState([]);
  const [highlightFlash, setHighlightFlash] = useState(false);
  const [confettiMegaPieces, setConfettiMegaPieces] = useState([]);
  const [shimmerText, setShimmerText] = useState(false);
  const [shakeContainer, setShakeContainer] = useState(false);

  useEffect(() => {
    if (availableQuestions.length > 0) {
      setCurrentQuestion(availableQuestions[Math.floor(Math.random() * availableQuestions.length)]);
    }
  }, [availableQuestions]);

  const handleLogoClick = () => {
    setIsExploded(true);

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

  const generateConfetti = () => {
    const confettiCount = 120;
    const shapes = ['circle', 'square', 'triangle'];
    const pieces = [];
    for (let i = 0; i < confettiCount; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      pieces.push({
        id: 'c_' + i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * (16 - 6) + 6,
        color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`,
        shape: shape,
        rotation: Math.random() * 360
      });
    }
    setConfettiPieces(pieces);

    // Highlight flash
    setHighlightFlash(true);
    setTimeout(() => {
      setHighlightFlash(false);
    }, 600);

    generateMegaConfetti();

    setTimeout(() => {
      setShimmerText(true);
      setTimeout(() => setShimmerText(false), 1500);
    }, 800);

    setShakeContainer(true);
    setTimeout(() => setShakeContainer(false), 600);

    // Clear confetti after some time
    setTimeout(() => {
      setConfettiPieces([]);
      setConfettiMegaPieces([]);
    }, 5000);
  };

  const generateMegaConfetti = () => {
    const megaCount = 20;
    const megaShapes = ['circle', 'triangle'];
    const megaPiecesArray = [];
    for (let i = 0; i < megaCount; i++) {
      const shape = megaShapes[Math.floor(Math.random() * megaShapes.length)];
      megaPiecesArray.push({
        id: 'm_' + i,
        left: Math.random() * 100,
        delay: Math.random() * 1,
        size: Math.random() * (30 - 15) + 15,
        color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`,
        shape: shape,
        rotation: Math.random() * 360
      });
    }
    setConfettiMegaPieces(megaPiecesArray);
  };

  const startSlotMachine = (e) => {
    if (isSpinning) return;

    const audio = new Audio(spin);
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });

    setIsSpinning(true);

    // Create ripple effect
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    // Calculate position
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    // Append ripple to button
    button.appendChild(ripple);

    // Remove ripple after animation
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });

    // Add 'pressed' class to trigger simple animation and remove it after 300ms
    button.classList.add('pressed');
    setTimeout(() => {
      button.classList.remove('pressed');
    }, 300);

    const questionElem = document.querySelector('.question-display');

    const totalSpins = 6; 
    let count = 0;

    const delays = [0, 50, 100, 200, 400];

    const spinIteration = () => {
      if (count >= totalSpins) {
        setIsSpinning(false);
        return;
      }

      questionElem.classList.add('fade-out-down');

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const chosenQuestion = availableQuestions[randomIndex];
        const isFinalSpin = (count === totalSpins - 1);

        if (isFinalSpin) {
          const newPool = [...availableQuestions];
          newPool.splice(randomIndex, 1);
          setAvailableQuestions(newPool);
          if (newPool.length === 0) {
            setAvailableQuestions([...originalQuestions]);
          }
          generateConfetti();
        }

        setCurrentQuestion(chosenQuestion);

        questionElem.classList.remove('fade-out-down');
        questionElem.classList.add('fade-in-up');

        setTimeout(() => {
          questionElem.classList.remove('fade-in-up');
          if (count < totalSpins - 1) {
            const delay = count < delays.length ? delays[count] : delays[delays.length - 1];
            setTimeout(spinIteration, delay);
          } else {
            setIsSpinning(false);
          }
          count++;
        }, 200);
      }, 200);
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
        <div className={`question-container ${shakeContainer ? 'shake' : ''}`}>
          {highlightFlash && <div className="highlight-flash"></div>}
          <p className={`question-display ${shimmerText ? 'shimmer-text' : ''}`}>{currentQuestion}</p>
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

      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className={`confetti-piece ${piece.shape}`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.shape === 'triangle' ? 'transparent' : piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderColor: piece.shape === 'triangle' ? piece.color : 'transparent'
          }}
        />
      ))}

      {confettiMegaPieces.map(piece => (
        <div
          key={piece.id}
          className={`confetti-piece mega ${piece.shape}`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.shape === 'triangle' ? 'transparent' : piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderColor: piece.shape === 'triangle' ? piece.color : 'transparent'
          }}
        />
      ))}
    </div>
  );
}

export default App;
