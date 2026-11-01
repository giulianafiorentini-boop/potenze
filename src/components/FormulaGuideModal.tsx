import React from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface FormulaGuideModalProps {
  language: Language;
  onClose: () => void;
}

export const FormulaGuideModal: React.FC<FormulaGuideModalProps> = ({ language, onClose }) => {
  const isIt = language === 'it';

  const rules = [
    {
      title: isIt ? '1. Prodotto di potenze con stessa base' : '1. Product of powers with same base',
      formula: 'aᵐ · aⁿ = aᵐ⁺ⁿ',
      example: '2³ · 2⁴ = 2³⁺⁴ = 2⁷',
      note: isIt ? 'Si mantiene la base e si SOMMANO gli esponenti.' : 'Keep the base and ADD the exponents.'
    },
    {
      title: isIt ? '2. Quoziente di potenze con stessa base' : '2. Quotient of powers with same base',
      formula: 'aᵐ : aⁿ = aᵐ⁻ⁿ (con a ≠ 0, m ≥ n)',
      example: '5⁶ : 5² = 5⁶⁻² = 5⁴',
      note: isIt ? 'Si mantiene la base e si SOTTRAGGONO gli esponenti.' : 'Keep the base and SUBTRACT the exponents.'
    },
    {
      title: isIt ? '3. Potenza di potenza' : '3. Power of a power',
      formula: '(aᵐ)ⁿ = aᵐ·ⁿ',
      example: '(3²)⁴ = 3²·⁴ = 3⁸',
      note: isIt ? 'Si mantiene la base e si MOLTIPLICANO gli esponenti.' : 'Keep the base and MULTIPLY the exponents.'
    },
    {
      title: isIt ? '4. Prodotto con stesso esponente' : '4. Product with same exponent',
      formula: 'aⁿ · bⁿ = (a · b)ⁿ',
      example: '2³ · 5³ = (2 · 5)³ = 10³ = 1000',
      note: isIt ? 'Si moltiplicano le basi mantenendo l\'esponente.' : 'Multiply the bases, keeping the exponent.'
    },
    {
      title: isIt ? '5. Quoziente con stesso esponente' : '5. Quotient with same exponent',
      formula: 'aⁿ : bⁿ = (a : b)ⁿ (con b ≠ 0)',
      example: '12⁴ : 3⁴ = (12 : 3)⁴ = 4⁴ = 256',
      note: isIt ? 'Si dividono le basi mantenendo l\'esponente.' : 'Divide the bases, keeping the exponent.'
    },
    {
      title: isIt ? '6. Casi particolari fondamentali' : '6. Essential special cases',
      formula: 'a⁰ = 1 (a ≠ 0)  |  a¹ = a  |  1ⁿ = 1  |  0ⁿ = 0 (n > 0)',
      example: '7⁰ = 1, 9¹ = 9, 0⁰ = indeterminata / indeterminate',
      note: isIt ? '0⁰ non ha significato aritmetico nei numeri naturali.' : '0⁰ has no defined meaning in natural numbers.'
    },
    {
      title: isIt ? '7. Potenze di 10 (Applicazioni Tecniche MAT)' : '7. Powers of 10 (Technical MAT)',
      formula: '10ⁿ = 1 seguito da n zeri',
      example: '10³ = 1000 (kilo, kW), 10⁶ = 1.000.000 (Mega, MHz)',
      note: isIt ? 'Fondamentale per ordini di grandezza, tolleranze e unità di misura.' : 'Crucial for orders of magnitude and technical metric units.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isIt ? 'Formulario Proprietà delle Potenze' : 'Power Properties Reference'}
            </h2>
            <p className="text-xs text-slate-400">
              {isIt ? 'Prontuario sintetico per il 1° anno MAT' : 'Compact quick summary for 1st Year MAT'}
            </p>
          </div>
        </div>

        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {rules.map((rule, idx) => (
            <div key={idx} className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-3.5 hover:border-slate-600 transition">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-400 shrink-0" />
                {rule.title}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono-math text-sm bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 text-amber-200">
                <span>{rule.formula}</span>
                <span className="text-slate-500">→</span>
                <span className="text-emerald-300 font-semibold">{rule.example}</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-300">
                {rule.note}
              </p>
            </div>
          ))}

          {/* Attention warning box */}
          <div className="rounded-xl bg-rose-950/30 border border-rose-800/50 p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-rose-300">
                {isIt ? 'Attenzione agli errori tipici:' : 'Watch out for common pitfalls:'}
              </span>
              <p className="mt-0.5">
                {isIt
                  ? '• 2³ NON è 2 × 3 = 6, ma 2 × 2 × 2 = 8! • Le proprietà delle potenze NON si applicano all\'addizione: 2³ + 2² fa 8 + 4 = 12 (NON 2⁵)!'
                  : '• 2³ is NOT 2 × 3 = 6, but 2 × 2 × 2 = 8! • Rules do NOT apply to addition: 2³ + 2² = 8 + 4 = 12 (NOT 2⁵)!'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition"
          >
            {isIt ? 'Ho capito, andiamo!' : 'Got it, let\'s go!'}
          </button>
        </div>
      </div>
    </div>
  );
};
