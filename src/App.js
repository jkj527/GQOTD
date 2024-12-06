// App.js

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti'; // Import canvas-confetti
import logo from './assets/logo.png';
import welcome from './assets/welcome.m4a';
import spin from './assets/spin.m4a';
import questionsData from './questions.json';
import './App.css';

function App() {
  const [isExploded, setIsExploded] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const [highlightFlash, setHighlightFlash] = useState(false);
  const [shimmerText, setShimmerText] = useState(false);
  const [shakeContainer, setShakeContainer] = useState(false);

  const easterEgg = `
    Oh good, you found the easter egg.

    🌒🔮🌀

    Whispers of twilight cascade through the velvet echoes, where shadows pirouette on the fringes of forgotten murmurs. The clockwork nebula breathes in kaleidoscopic sighs, unraveling the tapestry of time with tendrils of translucent whispers. Quantum hiccups ripple across the spectrum of surreal dusk, entwining with the serpentine strands of ethereal cobwebs spun by moonlit specters. Beneath the canopy of indigo enigmas, crab claws clutch at the remnants of crystalline illusions, stitching seams of shimmering silence into the fabric of nonsensical reveries.

    Fractured dreams dissolve into the mosaic of paradoxical echoes, dancing with the ephemeral essence of liquid stardust. The labyrinthine corridors of abstract infinity spiral into vortices of perplexing phosphorescence, where the scent of forgotten melodies permeates the air with invisible tendrils. Celestial marionettes sway to the dissonant cadence of unseen orchestrations, their strings tangled in the whimsical whimsy of cosmic caprices.

    In the realm where the tangible transmutes into translucent whispers, the cacophony of fragmented echoes hums the lullabies of distorted realities. Tendrils of incandescent confusion weave through the tapestry of oblivious oblivion, casting shadows of spectral serenades upon the canvas of perpetual perplexity. The silent symphony of shattered serenades resonates with the melancholic murmur of timeless turbulence, where the essence of nothingness tangles with the threads of chaotic clarity.

    As the nebulous night unfurls its enigmatic embrace, the whispers of forgotten echoes entwine with the shadows of the unseen abyss, where time fractures into kaleidoscopic shards of perplexing enigmas. Beneath the veil of silent chaos, spectral anomalies drift through the void of uncharted dimensions, cascading into the labyrinth of perpetual uncertainty. Fractured realities dissolve into a mosaic of dissonant murmurs and ephemeral whispers, swirling within the vortex of abstract infinity. The essence of nothingness spirals into the surreal tapestry of distorted existence, where echoes of the unspoken resonate through the corridors of incomprehensible realms.

    Embrace the enigmatic flux of boundless confusion, where the fabric of perception unravels into the mosaic of perpetual bewilderment, and the void sings the silent symphony of the absurd. 🌀🌑🔮
    `;

  // Key for localStorage
  const LOCAL_STORAGE_KEY = 'availableQuestions';

  // Helper Functions
  const loadQuestions = () => {
    const storedQuestions = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQuestions) {
      try {
        return JSON.parse(storedQuestions);
      } catch (error) {
        console.error("Failed to parse stored questions:", error);
        return null;
      }
    }
    return null;
  };

  const saveQuestions = (questions) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
  };

  // Initialize available questions from localStorage or JSON
  useEffect(() => {
    const stored = loadQuestions();
    if (stored && Array.isArray(stored)) {
      setAvailableQuestions(stored);
    } else {
      const combined = [...questionsData.genuine, ...questionsData.weird];
      setAvailableQuestions(combined);
    }
  }, []);

  // Save to localStorage and set current question whenever availableQuestions changes
  useEffect(() => {
    if (availableQuestions.length > 0) {
      setCurrentQuestion(
        availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
      );
    } else {
      const combined = [...questionsData.genuine, ...questionsData.weird];
      setAvailableQuestions(combined);
    }

    saveQuestions(availableQuestions);
  }, [availableQuestions]);

  const handleLogoClick = () => {
    console.log(easterEgg);
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

  // Replace manual confetti with canvas-confetti
  const generateConfetti = () => {
    // First burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4d4d', '#b22222', '#4b0000', '#f093fb', '#f5576c'],
      shapes: ['circle', 'square', 'triangle'],
    });

    // Second burst from left
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.25, y: 0.5 },
      colors: ['#ff4d4d', '#b22222', '#4b0000'],
      shapes: ['circle'],
    });

    // Third burst from right
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.75, y: 0.5 },
      colors: ['#f093fb', '#f5576c'],
      shapes: ['square'],
    });

    // Highlight flash
    setHighlightFlash(true);
    setTimeout(() => {
      setHighlightFlash(false);
    }, 600);

    // Shimmer text
    setTimeout(() => {
      setShimmerText(true);
      setTimeout(() => setShimmerText(false), 1500);
    }, 800);

    // Shake container
    setShakeContainer(true);
    setTimeout(() => setShakeContainer(false), 600);
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
            // Reset to all questions if pool is empty
            const combinedQuestions = [
              ...questionsData.genuine,
              ...questionsData.weird
            ];
            setAvailableQuestions(combinedQuestions);
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
        <button
          className="pull-lever-btn"
          onClick={startSlotMachine}
          disabled={isSpinning}
          aria-label="Spin the question of the day"
        >
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
