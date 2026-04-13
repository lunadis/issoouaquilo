import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';

let _nextId = 3;

// Duração total do giro dos slots em milissegundos
const SLOT_DURATION_MS = 3000;

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (e) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function App() {
  const {
    register,
    handleSubmit,
    unregister,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  const [inputs, setInputs] = useState([{ id: '1' }, { id: '2' }]);
  const [result, setResult] = useState(null);
  const [displayed, setDisplayed] = useState('');
  const [flipKey, setFlipKey] = useState(0);
  const [isDeciding, setIsDeciding] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const contentRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  // Close on Escape
  useEffect(() => {
    if (!result) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus overlay content when it opens
  useEffect(() => {
    if (result && contentRef.current) contentRef.current.focus();
  }, [result]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const close = () => {
    setResult(null);
    setDisplayed('');
    setIsDeciding(false);
  };

  const onSubmit = (data) => {
    const options = inputs.map((inp) => data[inp.id]);
    const chosen = options[Math.floor(Math.random() * options.length)];

    setResult(chosen);
    setIsDeciding(true);
    setDisplayed(options[Math.floor(Math.random() * options.length)]);
    setFlipKey((k) => k + 1);

    // Slot-machine cycling — duração total controlada por SLOT_DURATION_MS.
    // Curva quadrática ease-out: começa rápido, desacelera até pousar na resposta.
    // base e maxExtra são derivados da duração para preservar a forma da curva.
    let step = 0;
    const totalSteps = 23;
    const base = SLOT_DURATION_MS / 110.5;
    const maxExtra = SLOT_DURATION_MS / 9.06;

    const tick = () => {
      step++;
      if (step < totalSteps) {
        setDisplayed(options[Math.floor(Math.random() * options.length)]);
        setFlipKey((k) => k + 1);
        const delay = base + Math.pow(step / totalSteps, 2) * maxExtra;
        setTimeout(tick, delay);
      } else {
        setDisplayed(chosen);
        setFlipKey((k) => k + 1);
        setIsDeciding(false);
      }
    };

    setTimeout(tick, base);
  };

  const addOption = () => {
    const id = String(_nextId++);
    setInputs((prev) => [...prev, { id }]);
  };

  const removeOption = (id) => {
    unregister(id);
    setInputs((prev) => prev.filter((inp) => inp.id !== id));
  };

  return (
    <div className="app">
      <div className="app__inner">
        <header className="app__header">
          <div>
            <p className="app__eyebrow">Decisão</p>
            <h1 className="app__title">
              Isso ou<br />aquilo?
            </h1>
          </div>
          <button
            type="button"
            className="btn-theme"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <ul className="options-list">
            {inputs.map((input, index) => (
              <li key={input.id} className="option-row">
                <span className="option-row__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <input
                  className={`option-row__input${errors[input.id] ? ' is-error' : ''}`}
                  placeholder={`Opção ${index + 1}`}
                  aria-label={`Opção ${index + 1}`}
                  {...register(input.id, { required: true })}
                />
                {inputs.length > 2 && (
                  <button
                    type="button"
                    className="option-row__remove"
                    onClick={() => removeOption(input.id)}
                    aria-label={`Remover opção ${index + 1}`}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button type="button" className="btn-add" onClick={addOption}>
            <span className="btn-add__icon" aria-hidden="true">+</span>
            Adicionar opção
          </button>

          <div className="form-divider" role="separator" />

          <button type="submit" className="btn-submit">
            Decidir
          </button>
        </form>
      </div>

      {result !== null && (
        <div
          className="result-overlay"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Resultado da decisão"
        >
          <div
            className="result-overlay__content"
            ref={contentRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="result-overlay__label">A resposta é</p>
            <div className="result-overlay__answer-wrap">
              <p
                key={flipKey}
                className={`result-overlay__answer ${isDeciding ? 'is-deciding' : 'is-settled'}`}
                aria-live="polite"
              >
                {displayed}
              </p>
            </div>
            <div className="result-overlay__actions">
              <button type="button" className="btn-overlay-reset" onClick={close}>
                Tentar de novo
              </button>
              <span className="result-overlay__dismiss">ESC ou clique fora para fechar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
