import { Question } from '../types';

export const QUESTIONS_BANK: Question[] = [
  // --- 1. CALCOLO DEL VALORE (15 domande) ---
  {
    id: 1,
    category: 'calculation',
    formula: '2^3',
    questionText: {
      it: 'Qual è il valore di 2³ ?',
      en: 'What is the value of 2³ ?'
    },
    options: {
      it: ['6', '8', '9', '16'],
      en: ['6', '8', '9', '16']
    },
    correctIndex: 1,
    explanation: {
      it: '2³ significa 2 × 2 × 2 = 8. Attenzione: non confondere la potenza con la moltiplicazione per 3!',
      en: '2³ means 2 × 2 × 2 = 8. Be careful not to confuse exponentiation with multiplying by 3!'
    }
  },
  {
    id: 2,
    category: 'calculation',
    formula: '3^3',
    questionText: {
      it: 'Calcola il valore di 3³ :',
      en: 'Calculate the value of 3³ :'
    },
    options: {
      it: ['9', '18', '27', '81'],
      en: ['9', '18', '27', '81']
    },
    correctIndex: 2,
    explanation: {
      it: '3³ = 3 × 3 × 3 = 9 × 3 = 27.',
      en: '3³ = 3 × 3 × 3 = 9 × 3 = 27.'
    }
  },
  {
    id: 3,
    category: 'calculation',
    formula: '4^3',
    questionText: {
      it: 'Quanto vale 4³ ?',
      en: 'What is the value of 4³ ?'
    },
    options: {
      it: ['12', '16', '64', '32'],
      en: ['12', '16', '64', '32']
    },
    correctIndex: 2,
    explanation: {
      it: '4³ = 4 × 4 × 4 = 16 × 4 = 64.',
      en: '4³ = 4 × 4 × 4 = 16 × 4 = 64.'
    }
  },
  {
    id: 4,
    category: 'calculation',
    formula: '5^3',
    questionText: {
      it: 'Qual è il risultato di 5³ ?',
      en: 'What is the result of 5³ ?'
    },
    options: {
      it: ['15', '25', '75', '125'],
      en: ['15', '25', '75', '125']
    },
    correctIndex: 3,
    explanation: {
      it: '5³ = 5 × 5 × 5 = 25 × 5 = 125.',
      en: '5³ = 5 × 5 × 5 = 25 × 5 = 125.'
    }
  },
  {
    id: 5,
    category: 'calculation',
    formula: '2^4',
    questionText: {
      it: 'Calcola il valore della potenza 2⁴ :',
      en: 'Calculate the power 2⁴ :'
    },
    options: {
      it: ['8', '16', '24', '32'],
      en: ['8', '16', '24', '32']
    },
    correctIndex: 1,
    explanation: {
      it: '2⁴ = 2 × 2 × 2 × 2 = 16.',
      en: '2⁴ = 2 × 2 × 2 × 2 = 16.'
    }
  },
  {
    id: 6,
    category: 'calculation',
    formula: '2^5',
    questionText: {
      it: 'A quanto corrisponde 2⁵ ?',
      en: 'What does 2⁵ equal?'
    },
    options: {
      it: ['10', '25', '32', '64'],
      en: ['10', '25', '32', '64']
    },
    correctIndex: 2,
    explanation: {
      it: '2⁵ = 2 × 2 × 2 × 2 × 2 = 32.',
      en: '2⁵ = 2 × 2 × 2 × 2 × 2 = 32.'
    }
  },
  {
    id: 7,
    category: 'calculation',
    formula: '2^6',
    questionText: {
      it: 'Calcola 2⁶ (un valore frequente nei sistemi digitali/informatici MAT) :',
      en: 'Calculate 2⁶ (frequent in digital/electronic systems):'
    },
    options: {
      it: ['12', '36', '48', '64'],
      en: ['12', '36', '48', '64']
    },
    correctIndex: 3,
    explanation: {
      it: '2⁶ = 2⁵ × 2 = 32 × 2 = 64.',
      en: '2⁶ = 2⁵ × 2 = 32 × 2 = 64.'
    }
  },
  {
    id: 8,
    category: 'calculation',
    formula: '3^4',
    questionText: {
      it: 'Quanto fa 3⁴ ?',
      en: 'What is 3⁴ ?'
    },
    options: {
      it: ['12', '27', '81', '243'],
      en: ['12', '27', '81', '243']
    },
    correctIndex: 2,
    explanation: {
      it: '3⁴ = 3 × 3 × 3 × 3 = 9 × 9 = 81.',
      en: '3⁴ = 3 × 3 × 3 × 3 = 9 × 9 = 81.'
    }
  },
  {
    id: 9,
    category: 'calculation',
    formula: '6^2',
    questionText: {
      it: 'Calcola il quadrato di 6, cioè 6² :',
      en: 'Calculate the square of 6, that is 6² :'
    },
    options: {
      it: ['12', '36', '66', '30'],
      en: ['12', '36', '66', '30']
    },
    correctIndex: 1,
    explanation: {
      it: '6² = 6 × 6 = 36.',
      en: '6² = 6 × 6 = 36.'
    }
  },
  {
    id: 10,
    category: 'calculation',
    formula: '7^2',
    questionText: {
      it: 'Qual è il valore di 7² ?',
      en: 'What is the value of 7² ?'
    },
    options: {
      it: ['14', '42', '49', '56'],
      en: ['14', '42', '49', '56']
    },
    correctIndex: 2,
    explanation: {
      it: '7² = 7 × 7 = 49.',
      en: '7² = 7 × 7 = 49.'
    }
  },
  {
    id: 11,
    category: 'calculation',
    formula: '8^2',
    questionText: {
      it: 'A quanto corrisponde 8² ?',
      en: 'What does 8² equal?'
    },
    options: {
      it: ['16', '64', '72', '80'],
      en: ['16', '64', '72', '80']
    },
    correctIndex: 1,
    explanation: {
      it: '8² = 8 × 8 = 64.',
      en: '8² = 8 × 8 = 64.'
    }
  },
  {
    id: 12,
    category: 'calculation',
    formula: '9^2',
    questionText: {
      it: 'Quanto vale il quadrato di 9 (9²) ?',
      en: 'What is the square of 9 (9²) ?'
    },
    options: {
      it: ['18', '72', '81', '90'],
      en: ['18', '72', '81', '90']
    },
    correctIndex: 2,
    explanation: {
      it: '9² = 9 × 9 = 81.',
      en: '9² = 9 × 9 = 81.'
    }
  },
  {
    id: 13,
    category: 'calculation',
    formula: '11^2',
    questionText: {
      it: 'Calcola il valore di 11² :',
      en: 'Calculate the value of 11² :'
    },
    options: {
      it: ['22', '110', '121', '132'],
      en: ['22', '110', '121', '132']
    },
    correctIndex: 2,
    explanation: {
      it: '11² = 11 × 11 = 121.',
      en: '11² = 11 × 11 = 121.'
    }
  },
  {
    id: 14,
    category: 'calculation',
    formula: '12^2',
    questionText: {
      it: 'Quanto misura 12² (utilissimo nei calcoli d\'area e meccanici) ?',
      en: 'What is 12² (useful in mechanical and area calculations) ?'
    },
    options: {
      it: ['24', '120', '144', '164'],
      en: ['24', '120', '144', '164']
    },
    correctIndex: 2,
    explanation: {
      it: '12² = 12 × 12 = 144.',
      en: '12² = 12 × 12 = 144.'
    }
  },
  {
    id: 15,
    category: 'calculation',
    formula: '10^3',
    questionText: {
      it: 'Qual è il valore di 10³ ?',
      en: 'What is the value of 10³ ?'
    },
    options: {
      it: ['30', '100', '1000', '10000'],
      en: ['30', '100', '1000', '10000']
    },
    correctIndex: 2,
    explanation: {
      it: '10³ = 10 × 10 × 10 = 1000 (1 seguito da 3 zeri, prefisso kilo).',
      en: '10³ = 10 × 10 × 10 = 1000 (1 followed by 3 zeros, prefix kilo).'
    }
  },

  // --- 2. BASE, ESPONENTE E DEFINIZIONE (10 domande) ---
  {
    id: 16,
    category: 'base_exponent',
    formula: '7^4',
    questionText: {
      it: 'Nella scrittura 7⁴, qual è la BASE ?',
      en: 'In the expression 7⁴, which is the BASE ?'
    },
    options: {
      it: ['4', '7', '28', '11'],
      en: ['4', '7', '28', '11']
    },
    correctIndex: 1,
    explanation: {
      it: 'In una potenza aⁿ, il numero in basso (a) è la base e quello in alto (n) è l\'esponente. Qui la base è 7.',
      en: 'In a power aⁿ, the lower number (a) is the base and the upper number (n) is the exponent. Here the base is 7.'
    }
  },
  {
    id: 17,
    category: 'base_exponent',
    formula: '5^8',
    questionText: {
      it: 'Nella potenza 5⁸, qual è l\'ESPONENTE ?',
      en: 'In the power 5⁸, which is the EXPONENT ?'
    },
    options: {
      it: ['5', '8', '40', '13'],
      en: ['5', '8', '40', '13']
    },
    correctIndex: 1,
    explanation: {
      it: 'L\'esponente è 8: indica quante volte la base (5) deve essere moltiplicata per se stessa.',
      en: 'The exponent is 8: it indicates how many times the base (5) is multiplied by itself.'
    }
  },
  {
    id: 18,
    category: 'base_exponent',
    formula: 'a^n',
    questionText: {
      it: 'Che cosa indica l\'esponente in una potenza di numeri naturali ?',
      en: 'What does the exponent indicate in a power of natural numbers?'
    },
    options: {
      it: [
        'Il numero da aggiungere alla base',
        'Quante volte la base compare come fattore nella moltiplicazione',
        'Il numero per cui dividere la base',
        'Il risultato finale dell\'operazione'
      ],
      en: [
        'The number to add to the base',
        'How many times the base appears as a factor in multiplication',
        'The number to divide the base by',
        'The final result of the operation'
      ]
    },
    correctIndex: 1,
    explanation: {
      it: 'Per definizione, aⁿ = a × a × ... × a (n volte). L\'esponente conta i fattori uguali.',
      en: 'By definition, aⁿ = a × a × ... × a (n times). The exponent counts identical factors.'
    }
  },
  {
    id: 19,
    category: 'base_exponent',
    formula: '2^x = 16',
    questionText: {
      it: 'Trova l\'esponente mancante: 2ˣ = 16. Quanto vale x ?',
      en: 'Find the missing exponent: 2ˣ = 16. What is x ?'
    },
    options: {
      it: ['x = 3', 'x = 4', 'x = 8', 'x = 5'],
      en: ['x = 3', 'x = 4', 'x = 8', 'x = 5']
    },
    correctIndex: 1,
    explanation: {
      it: '2 × 2 × 2 × 2 = 16. Il fattore 2 compare 4 volte, perciò x = 4.',
      en: '2 × 2 × 2 × 2 = 16. The factor 2 appears 4 times, hence x = 4.'
    }
  },
  {
    id: 20,
    category: 'base_exponent',
    formula: '3^x = 81',
    questionText: {
      it: 'Trova il valore di x nell\'equazione: 3ˣ = 81 :',
      en: 'Find the value of x in the equation: 3ˣ = 81 :'
    },
    options: {
      it: ['x = 3', 'x = 4', 'x = 27', 'x = 5'],
      en: ['x = 3', 'x = 4', 'x = 27', 'x = 5']
    },
    correctIndex: 1,
    explanation: {
      it: '3¹=3, 3²=9, 3³=27, 3⁴=81. Dunque x = 4.',
      en: '3¹=3, 3²=9, 3³=27, 3⁴=81. Therefore x = 4.'
    }
  },
  {
    id: 21,
    category: 'base_exponent',
    formula: 'x^3 = 27',
    questionText: {
      it: 'Quale numero naturale elevato alla terza potenza dà 27 (x³ = 27) ?',
      en: 'Which natural number raised to the third power gives 27 (x³ = 27) ?'
    },
    options: {
      it: ['x = 9', 'x = 3', 'x = 2', 'x = 6'],
      en: ['x = 9', 'x = 3', 'x = 2', 'x = 6']
    },
    correctIndex: 1,
    explanation: {
      it: '3 × 3 × 3 = 27, quindi la base cercata è x = 3.',
      en: '3 × 3 × 3 = 27, so the sought base is x = 3.'
    }
  },
  {
    id: 22,
    category: 'base_exponent',
    formula: 'x^2 = 100',
    questionText: {
      it: 'Trova la base naturale x tale che x² = 100 :',
      en: 'Find the natural base x such that x² = 100 :'
    },
    options: {
      it: ['x = 50', 'x = 10', 'x = 20', 'x = 5'],
      en: ['x = 50', 'x = 10', 'x = 20', 'x = 5']
    },
    correctIndex: 1,
    explanation: {
      it: '10 × 10 = 100, quindi x = 10.',
      en: '10 × 10 = 100, so x = 10.'
    }
  },
  {
    id: 23,
    category: 'base_exponent',
    formula: '4 \times 4 \times 4 \times 4 \times 4',
    questionText: {
      it: 'Come si scrive in forma di potenza il prodotto 4 × 4 × 4 × 4 × 4 ?',
      en: 'How is the product 4 × 4 × 4 × 4 × 4 written as a power?'
    },
    options: {
      it: ['4 × 5', '5⁴', '4⁵', '20'],
      en: ['4 × 5', '5⁴', '4⁵', '20']
    },
    correctIndex: 2,
    explanation: {
      it: 'La base è il fattore che si ripete (4) e l\'esponente è il numero di volte (5), quindi 4⁵.',
      en: 'The base is the repeating factor (4) and the exponent is the count (5), so 4⁵.'
    }
  },
  {
    id: 24,
    category: 'base_exponent',
    formula: '2^x = 64',
    questionText: {
      it: 'Nell\'espressione 2ˣ = 64, quanto vale x ?',
      en: 'In the expression 2ˣ = 64, what is the value of x ?'
    },
    options: {
      it: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
      en: ['x = 5', 'x = 6', 'x = 7', 'x = 8']
    },
    correctIndex: 1,
    explanation: {
      it: '2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64. L\'esponente è 6.',
      en: '2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64. The exponent is 6.'
    }
  },
  {
    id: 25,
    category: 'base_exponent',
    formula: '10^x = 10000',
    questionText: {
      it: 'Trova x in: 10ˣ = 10.000 :',
      en: 'Find x in: 10ˣ = 10,000 :'
    },
    options: {
      it: ['x = 3', 'x = 4', 'x = 5', 'x = 40'],
      en: ['x = 3', 'x = 4', 'x = 5', 'x = 40']
    },
    correctIndex: 1,
    explanation: {
      it: 'Il numero 10.000 ha 4 zeri, perciò 10⁴ = 10.000, quindi x = 4.',
      en: 'The number 10,000 has 4 zeros, so 10⁴ = 10,000, therefore x = 4.'
    }
  },

  // --- 3. PROPRIETÀ: PRODOTTO CON STESSA BASE (8 domande) ---
  {
    id: 26,
    category: 'properties_product',
    formula: '2^3 \cdot 2^4',
    questionText: {
      it: 'Applica la proprietà delle potenze: 2³ × 2⁴ = ?',
      en: 'Apply the power property: 2³ × 2⁴ = ?'
    },
    options: {
      it: ['2¹²', '4⁷', '2⁷', '4¹²'],
      en: ['2¹²', '4⁷', '2⁷', '4¹²']
    },
    correctIndex: 2,
    explanation: {
      it: 'Prodotto di potenze con la stessa base: si mantiene la stessa base e si SOMMANO gli esponenti: 3 + 4 = 7, quindi 2⁷.',
      en: 'Product of powers with same base: keep the base and ADD exponents: 3 + 4 = 7, so 2⁷.'
    }
  },
  {
    id: 27,
    category: 'properties_product',
    formula: '5^2 \cdot 5^5',
    questionText: {
      it: 'Semplifica l\'espressione: 5² × 5⁵ =',
      en: 'Simplify the expression: 5² × 5⁵ ='
    },
    options: {
      it: ['5¹⁰', '5⁷', '25⁷', '10⁷'],
      en: ['5¹⁰', '5⁷', '25⁷', '10⁷']
    },
    correctIndex: 1,
    explanation: {
      it: 'Stessa base (5): esponente risultante = 2 + 5 = 7. Risultato: 5⁷.',
      en: 'Same base (5): resulting exponent = 2 + 5 = 7. Result: 5⁷.'
    }
  },
  {
    id: 28,
    category: 'properties_product',
    formula: '3^4 \cdot 3^2 \cdot 3',
    questionText: {
      it: 'Calcola: 3⁴ × 3² × 3 (ricorda che 3 equivale a 3¹) :',
      en: 'Calculate: 3⁴ × 3² × 3 (remember 3 equals 3¹) :'
    },
    options: {
      it: ['3⁶', '3⁷', '3⁸', '27⁷'],
      en: ['3⁶', '3⁷', '3⁸', '27⁷']
    },
    correctIndex: 1,
    explanation: {
      it: '3 = 3¹, quindi gli esponenti da sommare sono 4 + 2 + 1 = 7. Il risultato è 3⁷.',
      en: '3 = 3¹, so exponents to add are 4 + 2 + 1 = 7. The result is 3⁷.'
    }
  },
  {
    id: 29,
    category: 'properties_product',
    formula: '7^3 \cdot 7^6',
    questionText: {
      it: 'Qual è il risultato in forma di potenza di 7³ × 7⁶ ?',
      en: 'What is the power form result of 7³ × 7⁶ ?'
    },
    options: {
      it: ['7¹⁸', '7⁹', '49⁹', '14⁹'],
      en: ['7¹⁸', '7⁹', '49⁹', '14⁹']
    },
    correctIndex: 1,
    explanation: {
      it: 'Somma degli esponenti: 3 + 6 = 9. Risultato: 7⁹.',
      en: 'Sum of exponents: 3 + 6 = 9. Result: 7⁹.'
    }
  },
  {
    id: 30,
    category: 'properties_product',
    formula: '10^2 \cdot 10^3',
    questionText: {
      it: 'Nel calcolo tecnico MAT: 10² × 10³ equivale a :',
      en: 'In technical MAT calculation: 10² × 10³ equals:'
    },
    options: {
      it: ['10⁶', '10⁵', '100⁵', '20⁵'],
      en: ['10⁶', '10⁵', '100⁵', '20⁵']
    },
    correctIndex: 1,
    explanation: {
      it: '10² × 10³ = 10²⁺³ = 10⁵ (cioè 100 × 1000 = 100.000).',
      en: '10² × 10³ = 10²⁺³ = 10⁵ (which is 100 × 1000 = 100,000).'
    }
  },
  {
    id: 31,
    category: 'properties_product',
    formula: 'a^m \cdot a^n',
    questionText: {
      it: 'Quale formula esprime la proprietà del prodotto di potenze con la stessa base ?',
      en: 'Which formula expresses the product of powers with the same base?'
    },
    options: {
      it: ['aᵐ × aⁿ = aᵐ·ⁿ', 'aᵐ × aⁿ = aᵐ⁺ⁿ', 'aᵐ × aⁿ = (2a)ᵐ⁺ⁿ', 'aᵐ × aⁿ = aᵐ⁻ⁿ'],
      en: ['aᵐ × aⁿ = aᵐ·ⁿ', 'aᵐ × aⁿ = aᵐ⁺ⁿ', 'aᵐ × aⁿ = (2a)ᵐ⁺ⁿ', 'aᵐ × aⁿ = aᵐ⁻ⁿ']
    },
    correctIndex: 1,
    explanation: {
      it: 'La proprietà fondamentale stabilisce: aᵐ × aⁿ = aᵐ⁺ⁿ.',
      en: 'The fundamental property states: aᵐ × aⁿ = aᵐ⁺ⁿ.'
    }
  },
  {
    id: 32,
    category: 'properties_product',
    formula: '4^5 \cdot 4^0',
    questionText: {
      it: 'Applica le proprietà delle potenze a: 4⁵ × 4⁰ =',
      en: 'Apply power properties to: 4⁵ × 4⁰ ='
    },
    options: {
      it: ['0', '4⁰', '4⁵', '1'],
      en: ['0', '4⁰', '4⁵', '1']
    },
    correctIndex: 2,
    explanation: {
      it: 'Sommando gli esponenti 5 + 0 = 5, si ottiene 4⁵. Oppure: poiché 4⁰ = 1, si ha 4⁵ × 1 = 4⁵.',
      en: 'Adding exponents 5 + 0 = 5 gives 4⁵. Alternatively: since 4⁰ = 1, 4⁵ × 1 = 4⁵.'
    }
  },
  {
    id: 33,
    category: 'properties_product',
    formula: '6^1 \cdot 6^4',
    questionText: {
      it: 'A quanto corrisponde 6 × 6⁴ ?',
      en: 'What does 6 × 6⁴ equal?'
    },
    options: {
      it: ['6⁴', '6⁵', '36⁴', '6⁶'],
      en: ['6⁴', '6⁵', '36⁴', '6⁶']
    },
    correctIndex: 1,
    explanation: {
      it: '6 equivale a 6¹. Quindi 6¹ × 6⁴ = 6¹⁺⁴ = 6⁵.',
      en: '6 equals 6¹. Therefore 6¹ × 6⁴ = 6¹⁺⁴ = 6⁵.'
    }
  },

  // --- 4. PROPRIETÀ: QUOZIENTE CON STESSA BASE (8 domande) ---
  {
    id: 34,
    category: 'properties_quotient',
    formula: '2^7 : 2^3',
    questionText: {
      it: 'Calcola il quoziente di potenze: 2⁷ : 2³ =',
      en: 'Calculate the power quotient: 2⁷ : 2³ ='
    },
    options: {
      it: ['2⁴', '2¹⁰', '1⁴', '2²¹'],
      en: ['2⁴', '2¹⁰', '1⁴', '2²¹']
    },
    correctIndex: 0,
    explanation: {
      it: 'Quoziente di potenze con stessa base: si mantiene la base e si SOTTRAGGONO gli esponenti: 7 - 3 = 4, quindi 2⁴.',
      en: 'Quotient with same base: keep the base and SUBTRACT exponents: 7 - 3 = 4, hence 2⁴.'
    }
  },
  {
    id: 35,
    category: 'properties_quotient',
    formula: '5^8 : 5^2',
    questionText: {
      it: 'Semplifica: 5⁸ : 5² =',
      en: 'Simplify: 5⁸ : 5² ='
    },
    options: {
      it: ['5⁴', '5⁶', '5¹⁰', '1⁶'],
      en: ['5⁴', '5⁶', '5¹⁰', '1⁶']
    },
    correctIndex: 1,
    explanation: {
      it: 'Stessa base 5: sottrai gli esponenti 8 - 2 = 6, quindi 5⁶.',
      en: 'Same base 5: subtract exponents 8 - 2 = 6, so 5⁶.'
    }
  },
  {
    id: 36,
    category: 'properties_quotient',
    formula: '3^9 : 3^6',
    questionText: {
      it: 'Quanto vale 3⁹ : 3⁶ ?',
      en: 'What is 3⁹ : 3⁶ ?'
    },
    options: {
      it: ['3³ (= 27)', '3¹⁵', '1³ (= 1)', '3¹.⁵'],
      en: ['3³ (= 27)', '3¹⁵', '1³ (= 1)', '3¹.⁵']
    },
    correctIndex: 0,
    explanation: {
      it: '3⁹⁻⁶ = 3³ = 27.',
      en: '3⁹⁻⁶ = 3³ = 27.'
    }
  },
  {
    id: 37,
    category: 'properties_quotient',
    formula: '10^6 : 10^2',
    questionText: {
      it: 'In officina MAT: 10⁶ : 10² =',
      en: 'In technical workshop: 10⁶ : 10² ='
    },
    options: {
      it: ['10³', '10⁴', '10⁸', '10¹²'],
      en: ['10³', '10⁴', '10⁸', '10¹²']
    },
    correctIndex: 1,
    explanation: {
      it: '10⁶⁻² = 10⁴ (cioè 1.000.000 : 100 = 10.000).',
      en: '10⁶⁻² = 10⁴ (i.e. 1,000,000 : 100 = 10,000).'
    }
  },
  {
    id: 38,
    category: 'properties_quotient',
    formula: '7^5 : 7^4',
    questionText: {
      it: 'Quanto fa 7⁵ : 7⁴ ?',
      en: 'What is 7⁵ : 7⁴ ?'
    },
    options: {
      it: ['7¹ = 7', '7⁹', '1', '49'],
      en: ['7¹ = 7', '7⁹', '1', '49']
    },
    correctIndex: 0,
    explanation: {
      it: '7⁵⁻⁴ = 7¹ = 7.',
      en: '7⁵⁻⁴ = 7¹ = 7.'
    }
  },
  {
    id: 39,
    category: 'properties_quotient',
    formula: '4^6 : 4^6',
    questionText: {
      it: 'Calcola: 4⁶ : 4⁶ =',
      en: 'Calculate: 4⁶ : 4⁶ ='
    },
    options: {
      it: ['4¹²', '0', '4⁰ = 1', '4'],
      en: ['4¹²', '0', '4⁰ = 1', '4']
    },
    correctIndex: 2,
    explanation: {
      it: '4⁶⁻⁶ = 4⁰ = 1. Qualsiasi numero non nullo diviso per se stesso dà 1!',
      en: '4⁶⁻⁶ = 4⁰ = 1. Any non-zero number divided by itself equals 1!'
    }
  },
  {
    id: 40,
    category: 'properties_quotient',
    formula: '8^10 : 8^7',
    questionText: {
      it: 'Riduci a un\'unica potenza: 8¹⁰ : 8⁷ =',
      en: 'Reduce to a single power: 8¹⁰ : 8⁷ ='
    },
    options: {
      it: ['8³', '8¹⁷', '1³', '8⁷⁰'],
      en: ['8³', '8¹⁷', '1³', '8⁷⁰']
    },
    correctIndex: 0,
    explanation: {
      it: '8¹⁰⁻⁷ = 8³.',
      en: '8¹⁰⁻⁷ = 8³.'
    }
  },
  {
    id: 41,
    category: 'properties_quotient',
    formula: '9^4 : 9',
    questionText: {
      it: 'Calcola il risultato di 9⁴ : 9 =',
      en: 'Calculate the result of 9⁴ : 9 ='
    },
    options: {
      it: ['9⁴', '9³', '1³', '9⁵'],
      en: ['9⁴', '9³', '1³', '9⁵']
    },
    correctIndex: 1,
    explanation: {
      it: '9 equivale a 9¹. Quindi 9⁴ : 9¹ = 9⁴⁻¹ = 9³.',
      en: '9 equals 9¹. So 9⁴ : 9¹ = 9⁴⁻¹ = 9³.'
    }
  },

  // --- 5. PROPRIETÀ: POTENZA DI POTENZA (7 domande) ---
  {
    id: 42,
    category: 'properties_power_of_power',
    formula: '(2^3)^2',
    questionText: {
      it: 'Applica la proprietà della potenza di potenza: (2³)² =',
      en: 'Apply the power of a power property: (2³)² ='
    },
    options: {
      it: ['2⁵', '2⁶', '2⁹', '4⁶'],
      en: ['2⁵', '2⁶', '2⁹', '4⁶']
    },
    correctIndex: 1,
    explanation: {
      it: 'Potenza di potenza: si mantiene la base e si MOLTIPLICANO gli esponenti: 3 × 2 = 6, quindi 2⁶.',
      en: 'Power of a power: keep the base and MULTIPLY exponents: 3 × 2 = 6, so 2⁶.'
    }
  },
  {
    id: 43,
    category: 'properties_power_of_power',
    formula: '(3^2)^4',
    questionText: {
      it: 'Semplifica l\'espressione: (3²)⁴ =',
      en: 'Simplify the expression: (3²)⁴ ='
    },
    options: {
      it: ['3⁶', '3⁸', '3¹⁶', '9⁸'],
      en: ['3⁶', '3⁸', '3¹⁶', '9⁸']
    },
    correctIndex: 1,
    explanation: {
      it: 'Si moltiplicano gli esponenti: 2 × 4 = 8, per cui il risultato è 3⁸.',
      en: 'Exponents are multiplied: 2 × 4 = 8, so the result is 3⁸.'
    }
  },
  {
    id: 44,
    category: 'properties_power_of_power',
    formula: '((5^2)^3)^2',
    questionText: {
      it: 'Calcola: [ (5²)³ ]² =',
      en: 'Calculate: [ (5²)³ ]² ='
    },
    options: {
      it: ['5⁷', '5¹²', '5¹⁸', '25¹²'],
      en: ['5⁷', '5¹²', '5¹⁸', '25¹²']
    },
    correctIndex: 1,
    explanation: {
      it: 'Moltiplica a cascata gli esponenti: 2 × 3 × 2 = 12, quindi 5¹².',
      en: 'Multiply exponents cascaded: 2 × 3 × 2 = 12, giving 5¹².'
    }
  },
  {
    id: 45,
    category: 'properties_power_of_power',
    formula: '(10^3)^2',
    questionText: {
      it: 'Nel calcolo di ordini di grandezza: (10³)² =',
      en: 'In order of magnitude calculations: (10³)² ='
    },
    options: {
      it: ['10⁵', '10⁶', '10⁹', '100⁶'],
      en: ['10⁵', '10⁶', '10⁹', '100⁶']
    },
    correctIndex: 1,
    explanation: {
      it: '(10³)² = 10³·² = 10⁶ (da kilo a mega: 1000² = 1.000.000).',
      en: '(10³)² = 10³·² = 10⁶ (from kilo to mega: 1000² = 1,000,000).'
    }
  },
  {
    id: 46,
    category: 'properties_power_of_power',
    formula: '(7^4)^0',
    questionText: {
      it: 'Quanto vale (7⁴)⁰ ?',
      en: 'What is (7⁴)⁰ ?'
    },
    options: {
      it: ['0', '7', '1', '7⁴'],
      en: ['0', '7', '1', '7⁴']
    },
    correctIndex: 2,
    explanation: {
      it: '(7⁴)⁰ = 7⁴·⁰ = 7⁰ = 1.',
      en: '(7⁴)⁰ = 7⁴·⁰ = 7⁰ = 1.'
    }
  },
  {
    id: 47,
    category: 'properties_power_of_power',
    formula: '(a^m)^n',
    questionText: {
      it: 'La formula generale per la potenza di potenza è :',
      en: 'The general formula for power of a power is:'
    },
    options: {
      it: ['(aᵐ)ⁿ = aᵐ⁺ⁿ', '(aᵐ)ⁿ = aᵐ·ⁿ', '(aᵐ)ⁿ = aᵐ⁻ⁿ', '(aᵐ)ⁿ = aᵐⁿ'],
      en: ['(aᵐ)ⁿ = aᵐ⁺ⁿ', '(aᵐ)ⁿ = aᵐ·ⁿ', '(aᵐ)ⁿ = aᵐ⁻ⁿ', '(aᵐ)ⁿ = aᵐⁿ']
    },
    correctIndex: 1,
    explanation: {
      it: 'La proprietà stabilisce che (aᵐ)ⁿ = aᵐ·ⁿ.',
      en: 'The rule states that (aᵐ)ⁿ = aᵐ·ⁿ.'
    }
  },
  {
    id: 48,
    category: 'properties_power_of_power',
    formula: '(2^2)^3',
    questionText: {
      it: 'Qual è il valore numerico di (2²)³ ?',
      en: 'What is the numerical value of (2²)³ ?'
    },
    options: {
      it: ['32', '64', '16', '128'],
      en: ['32', '64', '16', '128']
    },
    correctIndex: 1,
    explanation: {
      it: '(2²)³ = 2⁶ = 64 (oppure 4³ = 64).',
      en: '(2²)³ = 2⁶ = 64 (or 4³ = 64).'
    }
  },

  // --- 6. PROPRIETÀ: STESSO ESPONENTE (7 domande) ---
  {
    id: 49,
    category: 'properties_same_exponent',
    formula: '2^3 \cdot 5^3',
    questionText: {
      it: 'Calcola applicando le proprietà: 2³ × 5³ =',
      en: 'Calculate using properties: 2³ × 5³ ='
    },
    options: {
      it: ['10³ (= 1000)', '10⁶', '7³', '7⁶'],
      en: ['10³ (= 1000)', '10⁶', '7³', '7⁶']
    },
    correctIndex: 0,
    explanation: {
      it: 'Prodotto di potenze con stesso esponente: si moltiplicano le basi mantenendo l\'esponente: (2 × 5)³ = 10³ = 1000.',
      en: 'Product with same exponent: multiply bases and keep the exponent: (2 × 5)³ = 10³ = 1000.'
    }
  },
  {
    id: 50,
    category: 'properties_same_exponent',
    formula: '3^2 \cdot 4^2',
    questionText: {
      it: 'Come si esprime 3² × 4² sotto forma di un\'unica potenza ?',
      en: 'How do you express 3² × 4² as a single power?'
    },
    options: {
      it: ['12⁴', '7²', '12²', '7⁴'],
      en: ['12⁴', '7²', '12²', '7⁴']
    },
    correctIndex: 2,
    explanation: {
      it: 'Stesso esponente 2: moltiplica le basi (3 × 4)² = 12² (cioè 144).',
      en: 'Same exponent 2: multiply bases (3 × 4)² = 12² (which is 144).'
    }
  },
  {
    id: 51,
    category: 'properties_same_exponent',
    formula: '12^4 : 3^4',
    questionText: {
      it: 'Calcola: 12⁴ : 3⁴ =',
      en: 'Calculate: 12⁴ : 3⁴ ='
    },
    options: {
      it: ['4⁴', '9⁴', '4⁰', '4¹'],
      en: ['4⁴', '9⁴', '4⁰', '4¹']
    },
    correctIndex: 0,
    explanation: {
      it: 'Quoziente di potenze con stesso esponente: dividi le basi mantenendo l\'esponente: (12 : 3)⁴ = 4⁴.',
      en: 'Quotient with same exponent: divide bases and keep the exponent: (12 : 3)⁴ = 4⁴.'
    }
  },
  {
    id: 52,
    category: 'properties_same_exponent',
    formula: '20^3 : 5^3',
    questionText: {
      it: 'Semplifica: 20³ : 5³ =',
      en: 'Simplify: 20³ : 5³ ='
    },
    options: {
      it: ['15³', '4³', '4¹', '4⁶'],
      en: ['15³', '4³', '4¹', '4⁶']
    },
    correctIndex: 1,
    explanation: {
      it: '(20 : 5)³ = 4³ = 64.',
      en: '(20 : 5)³ = 4³ = 64.'
    }
  },
  {
    id: 53,
    category: 'properties_same_exponent',
    formula: 'a^n \cdot b^n',
    questionText: {
      it: 'Quale uguaglianza rappresenta la proprietà del prodotto con stesso esponente ?',
      en: 'Which equality represents the product property with the same exponent?'
    },
    options: {
      it: ['aⁿ × bⁿ = (a + b)ⁿ', 'aⁿ × bⁿ = (a × b)ⁿ', 'aⁿ × bⁿ = (a × b)²ⁿ', 'aⁿ × bⁿ = aⁿ⁺ⁿ'],
      en: ['aⁿ × bⁿ = (a + b)ⁿ', 'aⁿ × bⁿ = (a × b)ⁿ', 'aⁿ × bⁿ = (a × b)²ⁿ', 'aⁿ × bⁿ = aⁿ⁺ⁿ']
    },
    correctIndex: 1,
    explanation: {
      it: 'La proprietà afferma: aⁿ × bⁿ = (a × b)ⁿ.',
      en: 'The property states: aⁿ × bⁿ = (a × b)ⁿ.'
    }
  },
  {
    id: 54,
    category: 'properties_same_exponent',
    formula: '2^5 \cdot 3^5',
    questionText: {
      it: 'Riscrivi come unica potenza: 2⁵ × 3⁵ =',
      en: 'Rewrite as a single power: 2⁵ × 3⁵ ='
    },
    options: {
      it: ['6¹⁰', '5⁵', '6⁵', '5¹⁰'],
      en: ['6¹⁰', '5⁵', '6⁵', '5¹⁰']
    },
    correctIndex: 2,
    explanation: {
      it: '(2 × 3)⁵ = 6⁵.',
      en: '(2 × 3)⁵ = 6⁵.'
    }
  },
  {
    id: 55,
    category: 'properties_same_exponent',
    formula: '100^2 : 25^2',
    questionText: {
      it: 'Calcola velocemente: 100² : 25² =',
      en: 'Quickly calculate: 100² : 25² ='
    },
    options: {
      it: ['4² = 16', '75²', '4⁴ = 256', '2'],
      en: ['4² = 16', '75²', '4⁴ = 256', '2']
    },
    correctIndex: 0,
    explanation: {
      it: '(100 : 25)² = 4² = 16.',
      en: '(100 : 25)² = 4² = 16.'
    }
  },

  // --- 7. CASI PARTICOLARI E CONVENZIONI (8 domande) ---
  {
    id: 56,
    category: 'special_cases',
    formula: '8^0',
    questionText: {
      it: 'Qual è il valore di 8⁰ ?',
      en: 'What is the value of 8⁰ ?'
    },
    options: {
      it: ['0', '1', '8', 'Non si può calcolare'],
      en: ['0', '1', '8', 'Cannot be calculated']
    },
    correctIndex: 1,
    explanation: {
      it: 'Qualsiasi numero naturale diverso da zero elevato a zero vale 1 (a⁰ = 1).',
      en: 'Any natural number other than zero raised to the power of zero equals 1 (a⁰ = 1).'
    }
  },
  {
    id: 57,
    category: 'special_cases',
    formula: '1^{2026}',
    questionText: {
      it: 'Quanto vale 1²⁰²⁶ ?',
      en: 'What is 1²⁰²⁶ ?'
    },
    options: {
      it: ['2026', '1', '0', '2026!'],
      en: ['2026', '1', '0', '2026!']
    },
    correctIndex: 1,
    explanation: {
      it: '1 moltiplicato per se stesso qualsiasi numero di volte dà sempre 1.',
      en: '1 multiplied by itself any number of times is always 1.'
    }
  },
  {
    id: 58,
    category: 'special_cases',
    formula: '0^5',
    questionText: {
      it: 'A quanto corrisponde 0⁵ ?',
      en: 'What does 0⁵ equal?'
    },
    options: {
      it: ['0', '1', '5', 'Non esiste'],
      en: ['0', '1', '5', 'Does not exist']
    },
    correctIndex: 0,
    explanation: {
      it: '0 × 0 × 0 × 0 × 0 = 0. Zero elevato a qualunque esponente positivo dà 0.',
      en: '0 × 0 × 0 × 0 × 0 = 0. Zero raised to any positive exponent equals 0.'
    }
  },
  {
    id: 59,
    category: 'special_cases',
    formula: '0^0',
    questionText: {
      it: 'Cosa si può dire dell\'operazione 0⁰ nei numeri naturali ?',
      en: 'What can be said about 0⁰ in natural numbers?'
    },
    options: {
      it: ['Vale 0', 'Vale 1', 'Non ha significato (forma indeterminata)', 'Vale infinito'],
      en: ['Equals 0', 'Equals 1', 'Has no meaning (indeterminate)', 'Equals infinity']
    },
    correctIndex: 2,
    explanation: {
      it: 'In matematica elementare la scrittura 0⁰ è priva di significato (indeterminata).',
      en: 'In elementary arithmetic, the expression 0⁰ has no defined meaning (indeterminate).'
    }
  },
  {
    id: 60,
    category: 'special_cases',
    formula: '15^1',
    questionText: {
      it: 'Quanto vale 15¹ ?',
      en: 'What is 15¹ ?'
    },
    options: {
      it: ['1', '0', '15', '150'],
      en: ['1', '0', '15', '150']
    },
    correctIndex: 2,
    explanation: {
      it: 'Qualsiasi numero elevato a 1 è uguale a se stesso: a¹ = a.',
      en: 'Any number raised to 1 is equal to itself: a¹ = a.'
    }
  },
  {
    id: 61,
    category: 'special_cases',
    formula: '100^0 + 1^100',
    questionText: {
      it: 'Calcola: 100⁰ + 1¹⁰⁰ =',
      en: 'Calculate: 100⁰ + 1¹⁰⁰ ='
    },
    options: {
      it: ['101', '2', '1', '200'],
      en: ['101', '2', '1', '200']
    },
    correctIndex: 1,
    explanation: {
      it: '100⁰ = 1 e 1¹⁰⁰ = 1. Quindi 1 + 1 = 2.',
      en: '100⁰ = 1 and 1¹⁰⁰ = 1. Therefore 1 + 1 = 2.'
    }
  },
  {
    id: 62,
    category: 'special_cases',
    formula: '0^1',
    questionText: {
      it: 'Quanto fa 0¹ ?',
      en: 'What is 0¹ ?'
    },
    options: {
      it: ['0', '1', 'Non esiste', '10'],
      en: ['0', '1', 'Does not exist', '10']
    },
    correctIndex: 0,
    explanation: {
      it: 'La base 0 compare una volta sola: il risultato è 0.',
      en: 'The base 0 appears only once: the result is 0.'
    }
  },
  {
    id: 63,
    category: 'special_cases',
    formula: 'a^0 \text{ con } a \ne 0',
    questionText: {
      it: 'Se a è un numero naturale diverso da zero, quanto vale a⁰ ?',
      en: 'If a is a non-zero natural number, what is a⁰ ?'
    },
    options: {
      it: ['a', '0', '1', 'Dipende da a'],
      en: ['a', '0', '1', 'Depends on a']
    },
    correctIndex: 2,
    explanation: {
      it: 'Per convenzione coerente con le proprietà dei quozienti (aᵐ : aᵐ = a⁰ = 1), a⁰ = 1 per ogni a ≠ 0.',
      en: 'Consistent with quotient rules (aᵐ : aᵐ = a⁰ = 1), a⁰ = 1 for any a ≠ 0.'
    }
  },

  // --- 8. POTENZE DI 10 E APPLICAZIONI TECNICHE MAT (5 domande) ---
  {
    id: 64,
    category: 'powers_of_10_tech',
    formula: '10^6',
    questionText: {
      it: 'In officina e nelle unità di misura tecniche MAT, a cosa corrisponde 10⁶ (prefisso Mega) ?',
      en: 'In technical workshop units, what does 10⁶ correspond to (prefix Mega)?'
    },
    options: {
      it: ['1.000 (mille)', '10.000 (diecimila)', '100.000 (centomila)', '1.000.000 (un milione)'],
      en: ['1,000 (thousand)', '10,000 (ten thousand)', '100,000 (hundred thousand)', '1,000,000 (one million)']
    },
    correctIndex: 3,
    explanation: {
      it: '10⁶ = 1 seguito da 6 zeri = 1.000.000 (Mega, es. Megawatt o Megahertz).',
      en: '10⁶ = 1 followed by 6 zeros = 1,000,000 (Mega, e.g. Megawatt or Megahertz).'
    }
  },
  {
    id: 65,
    category: 'powers_of_10_tech',
    formula: '1 kW = 10^3 W',
    questionText: {
      it: 'Un motore elettrico ha una potenza di 5 kW (kilowatt). Quanti Watt sono espressi con potenze di 10 ?',
      en: 'An electric motor has a power of 5 kW. How many Watts is that expressed using powers of 10?'
    },
    options: {
      it: ['5 × 10² W', '5 × 10³ W', '5 × 10⁴ W', '5 × 10⁶ W'],
      en: ['5 × 10² W', '5 × 10³ W', '5 × 10⁴ W', '5 × 10⁶ W']
    },
    correctIndex: 1,
    explanation: {
      it: 'Il prefisso kilo (k) corrisponde a 10³ = 1000. Quindi 5 kW = 5 × 10³ W = 5000 W.',
      en: 'The prefix kilo (k) corresponds to 10³ = 1000. Thus 5 kW = 5 × 10³ W = 5000 W.'
    }
  },
  {
    id: 66,
    category: 'powers_of_10_tech',
    formula: '10^n',
    questionText: {
      it: 'Quanti zeri ha dopo l\'1 il numero naturale espresso come 10⁷ ?',
      en: 'How many zeros follow the 1 in the natural number written as 10⁷ ?'
    },
    options: {
      it: ['6 zeri', '7 zeri', '8 zeri', '10 zeri'],
      en: ['6 zeros', '7 zeros', '8 zeros', '10 zeros']
    },
    correctIndex: 1,
    explanation: {
      it: 'Nelle potenze di base 10 con esponente naturale n, il risultato è 1 seguito da esattamente n zeri.',
      en: 'For powers of base 10 with natural exponent n, the result is 1 followed by exactly n zeros.'
    }
  },
  {
    id: 67,
    category: 'powers_of_10_tech',
    formula: '3 \times 10^4',
    questionText: {
      it: 'Un tachimetro rileva 3 × 10⁴ giri/minuto. A quale numero intero corrisponde ?',
      en: 'A tachometer reads 3 × 10⁴ rpm. What integer does this correspond to?'
    },
    options: {
      it: ['300', '3.000', '30.000', '300.000'],
      en: ['300', '3,000', '30,000', '300,000']
    },
    correctIndex: 2,
    explanation: {
      it: '3 × 10⁴ = 3 × 10.000 = 30.000.',
      en: '3 × 10⁴ = 3 × 10,000 = 30,000.'
    }
  },

  // --- 9. ERRORI TIPICI E TRABOCCHETTI (3 domande) ---
  {
    id: 68,
    category: 'common_pitfalls',
    formula: '2^3 \ne 6',
    questionText: {
      it: 'Quale delle seguenti affermazioni è FALSA ?',
      en: 'Which of the following statements is FALSE ?'
    },
    options: {
      it: ['2³ = 8', '2³ = 2 × 3 = 6', '3² = 9', '4² = 16'],
      en: ['2³ = 8', '2³ = 2 × 3 = 6', '3² = 9', '4² = 16']
    },
    correctIndex: 1,
    explanation: {
      it: 'Errore classico! 2³ NON è 2 × 3 = 6, ma 2 × 2 × 2 = 8!',
      en: 'Classic mistake! 2³ is NOT 2 × 3 = 6, but 2 × 2 × 2 = 8!'
    }
  },
  {
    id: 69,
    category: 'common_pitfalls',
    formula: '2^3 + 2^2',
    questionText: {
      it: 'Attenzione alla somma! Calcola: 2³ + 2² =',
      en: 'Watch out for addition! Calculate: 2³ + 2² ='
    },
    options: {
      it: ['2⁵ = 32', '12', '4⁵ = 1024', '10'],
      en: ['2⁵ = 32', '12', '4⁵ = 1024', '10']
    },
    correctIndex: 1,
    explanation: {
      it: 'La proprietà della somma degli esponenti vale SOLO per il PRODOTTO (×), NON per la somma (+)! Qui bisogna calcolare i valori: 2³ = 8, 2² = 4, quindi 8 + 4 = 12.',
      en: 'The exponent addition rule applies ONLY to MULTIPLICATION (×), NOT addition (+)! Here calculate values: 2³ = 8, 2² = 4, thus 8 + 4 = 12.'
    }
  },
  {
    id: 70,
    category: 'common_pitfalls',
    formula: '5^1 \text{ vs } 5^0',
    questionText: {
      it: 'Quale confronto tra potenze è CORRETTO ?',
      en: 'Which comparison between powers is CORRECT ?'
    },
    options: {
      it: ['5⁰ > 5¹', '5⁰ = 0', '5¹ > 5⁰', '5⁰ = 5'],
      en: ['5⁰ > 5¹', '5⁰ = 0', '5¹ > 5⁰', '5⁰ = 5']
    },
    correctIndex: 2,
    explanation: {
      it: '5¹ = 5 e 5⁰ = 1. Poiché 5 > 1, l\'affermazione 5¹ > 5⁰ è vera.',
      en: '5¹ = 5 and 5⁰ = 1. Since 5 > 1, statement 5¹ > 5⁰ is true.'
    }
  }
];

export const CATEGORY_LABELS: Record<string, { it: string; en: string }> = {
  calculation: { it: 'Calcolo Valore', en: 'Calculation' },
  base_exponent: { it: 'Base ed Esponente', en: 'Base & Exponent' },
  properties_product: { it: 'Prodotto Stessa Base', en: 'Product Same Base' },
  properties_quotient: { it: 'Quoziente Stessa Base', en: 'Quotient Same Base' },
  properties_power_of_power: { it: 'Potenza di Potenza', en: 'Power of Power' },
  properties_same_exponent: { it: 'Stesso Esponente', en: 'Same Exponent' },
  special_cases: { it: 'Casi Particolari (0 e 1)', en: 'Special Cases (0 & 1)' },
  powers_of_10_tech: { it: 'Potenze di 10 (MAT)', en: 'Powers of 10 (Tech)' },
  common_pitfalls: { it: 'Errori Tipici & Attenzione', en: 'Common Pitfalls' }
};
