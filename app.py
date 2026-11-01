"""
PowerQuest MAT - Gioco Didattico sulle Potenze dei Numeri Naturali
Progettato specificamente per il 1° anno degli Istituti Professionali e Tecnici (MAT - Manutenzione e Assistenza Tecnica)

Requisiti:
    pip install streamlit pandas
Esecuzione locale:
    streamlit run app.py
"""

import streamlit as st
import streamlit.components.v1 as components
import random
import time
import os
import json
import sqlite3
import pandas as pd
from datetime import datetime

# --- CONFIGURAZIONE PAGINA STREAMLIT ---
st.set_page_config(
    page_title="PowerQuest MAT - Potenze",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- INIEZIONE CSS AVANZATO PER REPLICARE IL DESIGN MODERNO DI AISTUDIO ---
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');

/* Reset sfondo globale e font */
html, body, [class*="css"], .stApp {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
    background-color: #020617 !important;
    color: #f1f5f9 !important;
}

/* Header e titoli */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-weight: 800 !important;
    color: #ffffff !important;
    letter-spacing: -0.02em;
}

/* Font matematico speciale */
.math-font {
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 700;
}

/* Card scure con bordo illuminato */
.mat-card {
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 1.25rem;
    padding: 1.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    margin-bottom: 1.25rem;
}

.mat-card-glow {
    background: #0f172a;
    border: 1px solid rgba(245, 158, 11, 0.4);
    border-radius: 1.25rem;
    padding: 1.75rem;
    box-shadow: 0 0 25px rgba(245, 158, 11, 0.15);
    margin-bottom: 1.25rem;
}

/* Badge MAT */
.mat-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Vite / Cuori */
.heart-active {
    color: #f43f5e;
    font-size: 1.75rem;
    filter: drop-shadow(0 0 8px rgba(244, 63, 94, 0.6));
    display: inline-block;
    transition: transform 0.2s;
}

.heart-lost {
    color: #475569;
    font-size: 1.75rem;
    opacity: 0.4;
    display: inline-block;
}

/* Stat metric container */
.metric-box {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
}

.metric-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.6rem;
    font-weight: 800;
    color: #fbbf24;
}

.metric-lbl {
    font-size: 0.75rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Personalizzazione pulsanti Streamlit */
div.stButton > button {
    border-radius: 0.85rem !important;
    font-weight: 800 !important;
    padding: 0.75rem 1.25rem !important;
    transition: all 0.15s ease-in-out !important;
    border: 1px solid #334155 !important;
    background: #1e293b !important;
    color: #f8fafc !important;
}

div.stButton > button:hover {
    background: #334155 !important;
    border-color: #f59e0b !important;
    color: #fbbf24 !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4) !important;
}

/* Pulsanti Primari Dorati stile AI Studio */
div.stButton > button[kind="primary"] {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
    color: #020617 !important;
    border: none !important;
    font-weight: 900 !important;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35) !important;
}

div.stButton > button[kind="primary"]:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5) !important;
    transform: translateY(-2px) scale(1.01) !important;
}

/* Opzioni di risposta (tasti A, B, C, D) */
.option-btn-container div.stButton > button {
    text-align: left !important;
    display: flex !important;
    justify-content: flex-start !important;
    font-size: 1.1rem !important;
    min-height: 4.2rem !important;
    background-color: #1e293b !important;
    border: 2px solid #334155 !important;
    color: #f8fafc !important;
}

.option-btn-container div.stButton > button:hover {
    border-color: #fbbf24 !important;
    background-color: #273549 !important;
}

/* Sidebar scura coordinata */
section[data-testid="stSidebar"] {
    background-color: #090d16 !important;
    border-right: 1px solid #1e293b !important;
}

/* Input form scuri */
div[data-baseweb="input"] {
    background-color: #1e293b !important;
    border: 1px solid #334155 !important;
    border-radius: 0.75rem !important;
    color: #ffffff !important;
}

/* Tabelle Streamlit */
div[data-testid="stDataFrame"] {
    border: 1px solid #1e293b !important;
    border-radius: 1rem !important;
}
</style>
""", unsafe_allow_html=True)

# --- DATABASE MULTI-STRATO ROBUSTO CON PERCORSO ASSOLUTO ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "powers_mat.db")
JSON_BACKUP = os.path.join(BASE_DIR, "powers_mat_attempts.json")

def init_db():
    try:
        conn = sqlite3.connect(DB_FILE, check_same_thread=False)
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS attempts (
                attempt_id TEXT PRIMARY KEY,
                student_name TEXT NOT NULL,
                student_surname TEXT NOT NULL,
                language TEXT NOT NULL,
                score INTEGER NOT NULL,
                correct_answers INTEGER NOT NULL,
                questions_answered INTEGER NOT NULL DEFAULT 0,
                timeouts_count INTEGER NOT NULL DEFAULT 0,
                total_questions INTEGER NOT NULL DEFAULT 12,
                lives_remaining INTEGER NOT NULL DEFAULT 3,
                total_time_seconds INTEGER NOT NULL DEFAULT 0,
                completed BOOLEAN NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'In corso',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Verifica se la tabella esistente necessita di migrazione colonne
        c.execute("PRAGMA table_info(attempts)")
        cols = [col[1] for col in c.fetchall()]
        if 'attempt_id' not in cols or 'questions_answered' not in cols:
            c.execute("DROP TABLE IF EXISTS attempts")
            c.execute('''
                CREATE TABLE attempts (
                    attempt_id TEXT PRIMARY KEY,
                    student_name TEXT NOT NULL,
                    student_surname TEXT NOT NULL,
                    language TEXT NOT NULL,
                    score INTEGER NOT NULL,
                    correct_answers INTEGER NOT NULL,
                    questions_answered INTEGER NOT NULL DEFAULT 0,
                    timeouts_count INTEGER NOT NULL DEFAULT 0,
                    total_questions INTEGER NOT NULL DEFAULT 12,
                    lives_remaining INTEGER NOT NULL DEFAULT 3,
                    total_time_seconds INTEGER NOT NULL DEFAULT 0,
                    completed BOOLEAN NOT NULL DEFAULT 0,
                    status TEXT NOT NULL DEFAULT 'In corso',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error init SQLite: {e}")

    # Inizializza anche backup JSON
    if not os.path.exists(JSON_BACKUP):
        try:
            with open(JSON_BACKUP, "w", encoding="utf-8") as f:
                json.dump([], f)
        except Exception:
            pass

def save_or_update_attempt(attempt_id, name, surname, language, score, correct, answered, timeouts, total, lives, total_time, completed, status):
    """Salva o aggiorna istantaneamente il tentativo su SQLite e JSON in tempo reale."""
    created_at_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 1. Salvataggio / Aggiornamento Atomico su SQLite
    try:
        conn = sqlite3.connect(DB_FILE, check_same_thread=False)
        c = conn.cursor()
        c.execute('''
            INSERT INTO attempts (
                attempt_id, student_name, student_surname, language, score,
                correct_answers, questions_answered, timeouts_count, total_questions,
                lives_remaining, total_time_seconds, completed, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(attempt_id) DO UPDATE SET
                score = excluded.score,
                correct_answers = excluded.correct_answers,
                questions_answered = excluded.questions_answered,
                timeouts_count = excluded.timeouts_count,
                lives_remaining = excluded.lives_remaining,
                total_time_seconds = excluded.total_time_seconds,
                completed = excluded.completed,
                status = excluded.status,
                updated_at = excluded.updated_at
        ''', (
            str(attempt_id), name.strip(), surname.strip(), language, int(score),
            int(correct), int(answered), int(timeouts), int(total), int(lives),
            int(total_time), bool(completed), str(status), created_at_str, created_at_str
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error SQLite save_or_update: {e}")

    # 2. Salvataggio / Aggiornamento in-place su JSON Backup
    try:
        records = []
        if os.path.exists(JSON_BACKUP):
            with open(JSON_BACKUP, "r", encoding="utf-8") as f:
                records = json.load(f)

        record_data = {
            "attempt_id": str(attempt_id),
            "student_name": name.strip(),
            "student_surname": surname.strip(),
            "language": language,
            "score": int(score),
            "correct_answers": int(correct),
            "questions_answered": int(answered),
            "timeouts_count": int(timeouts),
            "total_questions": int(total),
            "lives_remaining": int(lives),
            "total_time_seconds": int(total_time),
            "completed": bool(completed),
            "status": str(status),
            "created_at": created_at_str
        }

        found = False
        for i, r in enumerate(records):
            if r.get("attempt_id") == str(attempt_id):
                record_data["created_at"] = r.get("created_at", created_at_str)
                records[i] = record_data
                found = True
                break

        if not found:
            records.insert(0, record_data)

        with open(JSON_BACKUP, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)
    except Exception as e:
        print(f"Error JSON backup update: {e}")

def save_attempt(name, surname, language, score, correct, total, lives, total_time, completed):
    """Wrapper di retrocompatibilità per save_or_update_attempt."""
    att_id = st.session_state.get("attempt_id") or f"att_{int(time.time())}_{random.randint(100, 999)}"
    answered = st.session_state.get("answered_count", 0)
    timeouts = st.session_state.get("timeouts_count", 0)
    status = "Completato" if completed else "Interrotto"
    save_or_update_attempt(
        attempt_id=att_id,
        name=name,
        surname=surname,
        language=language,
        score=score,
        correct=correct,
        answered=answered,
        timeouts=timeouts,
        total=total,
        lives=lives,
        total_time=total_time,
        completed=completed,
        status=status
    )

def get_all_attempts():
    """Recupera tutti i tentativi con ordine decrescente (più recenti e punteggio)."""
    try:
        if os.path.exists(DB_FILE):
            conn = sqlite3.connect(DB_FILE, check_same_thread=False)
            df_sql = pd.read_sql_query("SELECT * FROM attempts ORDER BY created_at DESC", conn)
            conn.close()
            if not df_sql.empty:
                return df_sql
    except Exception:
        pass

    try:
        if os.path.exists(JSON_BACKUP):
            with open(JSON_BACKUP, "r", encoding="utf-8") as f:
                records = json.load(f)
            if records:
                return pd.DataFrame(records)
    except Exception:
        pass

    return pd.DataFrame(columns=[
        "attempt_id", "student_name", "student_surname", "language", "score",
        "correct_answers", "questions_answered", "timeouts_count", "total_questions",
        "lives_remaining", "total_time_seconds", "completed", "status", "created_at"
    ])

init_db()

# --- PANIERE COMPLETO DI 70 ESERCIZI SULLE POTENZE (BILINGUE IT/EN) ---
QUESTIONS_BANK = [
    # 1. Calcolo del valore
    {"id": 1, "cat": "Calcolo", "text_it": "Qual è il valore di 2³ ?", "text_en": "What is the value of 2³ ?", "opts_it": ["6", "8", "9", "16"], "opts_en": ["6", "8", "9", "16"], "correct": 1, "exp_it": "2³ = 2 × 2 × 2 = 8. Non confondere con 2 × 3 = 6!", "exp_en": "2³ = 2 × 2 × 2 = 8. Do not confuse with 2 × 3!"},
    {"id": 2, "cat": "Calcolo", "text_it": "Calcola il valore di 3³ :", "text_en": "Calculate the value of 3³ :", "opts_it": ["9", "18", "27", "81"], "opts_en": ["9", "18", "27", "81"], "correct": 2, "exp_it": "3³ = 3 × 3 × 3 = 27.", "exp_en": "3³ = 3 × 3 × 3 = 27."},
    {"id": 3, "cat": "Calcolo", "text_it": "Quanto vale 4³ ?", "text_en": "What is the value of 4³ ?", "opts_it": ["12", "16", "64", "32"], "opts_en": ["12", "16", "64", "32"], "correct": 2, "exp_it": "4³ = 4 × 4 × 4 = 64.", "exp_en": "4³ = 4 × 4 × 4 = 64."},
    {"id": 4, "cat": "Calcolo", "text_it": "Qual è il risultato di 5³ ?", "text_en": "What is the result of 5³ ?", "opts_it": ["15", "25", "75", "125"], "opts_en": ["15", "25", "75", "125"], "correct": 3, "exp_it": "5³ = 5 × 5 × 5 = 125.", "exp_en": "5³ = 5 × 5 × 5 = 125."},
    {"id": 5, "cat": "Calcolo", "text_it": "Calcola il valore della potenza 2⁴ :", "text_en": "Calculate the power 2⁴ :", "opts_it": ["8", "16", "24", "32"], "opts_en": ["8", "16", "24", "32"], "correct": 1, "exp_it": "2⁴ = 2 × 2 × 2 × 2 = 16.", "exp_en": "2⁴ = 2 × 2 × 2 × 2 = 16."},
    {"id": 6, "cat": "Calcolo", "text_it": "A quanto corrisponde 2⁵ ?", "text_en": "What does 2⁵ equal?", "opts_it": ["10", "25", "32", "64"], "opts_en": ["10", "25", "32", "64"], "correct": 2, "exp_it": "2⁵ = 2 × 2 × 2 × 2 × 2 = 32.", "exp_en": "2⁵ = 32."},
    {"id": 7, "cat": "Calcolo", "text_it": "Calcola 2⁶ (usatissimo nei sistemi digitali MAT) :", "text_en": "Calculate 2⁶ (digital circuits MAT):", "opts_it": ["12", "36", "48", "64"], "opts_en": ["12", "36", "48", "64"], "correct": 3, "exp_it": "2⁶ = 32 × 2 = 64.", "exp_en": "2⁶ = 64."},
    {"id": 8, "cat": "Calcolo", "text_it": "Quanto fa 3⁴ ?", "text_en": "What is 3⁴ ?", "opts_it": ["12", "27", "81", "243"], "opts_en": ["12", "27", "81", "243"], "correct": 2, "exp_it": "3⁴ = 3 × 3 × 3 × 3 = 81.", "exp_en": "3⁴ = 81."},
    {"id": 9, "cat": "Calcolo", "text_it": "Calcola il quadrato di 6 (6²) :", "text_en": "Calculate 6² :", "opts_it": ["12", "36", "66", "30"], "opts_en": ["12", "36", "66", "30"], "correct": 1, "exp_it": "6² = 6 × 6 = 36.", "exp_en": "6² = 36."},
    {"id": 10, "cat": "Calcolo", "text_it": "Qual è il valore di 7² ?", "text_en": "What is 7² ?", "opts_it": ["14", "42", "49", "56"], "opts_en": ["14", "42", "49", "56"], "correct": 2, "exp_it": "7² = 7 × 7 = 49.", "exp_en": "7² = 49."},
    {"id": 11, "cat": "Calcolo", "text_it": "A quanto corrisponde 8² ?", "text_en": "What does 8² equal?", "opts_it": ["16", "64", "72", "80"], "opts_en": ["16", "64", "72", "80"], "correct": 1, "exp_it": "8² = 8 × 8 = 64.", "exp_en": "8² = 64."},
    {"id": 12, "cat": "Calcolo", "text_it": "Quanto vale 9² ?", "text_en": "What is 9² ?", "opts_it": ["18", "72", "81", "90"], "opts_en": ["18", "72", "81", "90"], "correct": 2, "exp_it": "9² = 9 × 9 = 81.", "exp_en": "9² = 81."},
    {"id": 13, "cat": "Calcolo", "text_it": "Calcola il valore di 11² :", "text_en": "Calculate 11² :", "opts_it": ["22", "110", "121", "132"], "opts_en": ["22", "110", "121", "132"], "correct": 2, "exp_it": "11² = 11 × 11 = 121.", "exp_en": "11² = 121."},
    {"id": 14, "cat": "Calcolo", "text_it": "Quanto misura 12² (calcoli d'officina) ?", "text_en": "What is 12² ?", "opts_it": ["24", "120", "144", "164"], "opts_en": ["24", "120", "144", "164"], "correct": 2, "exp_it": "12² = 12 × 12 = 144.", "exp_en": "12² = 144."},
    {"id": 15, "cat": "Calcolo", "text_it": "Qual è il valore di 10³ ?", "text_en": "What is 10³ ?", "opts_it": ["30", "100", "1000", "10000"], "opts_en": ["30", "100", "1000", "10000"], "correct": 2, "exp_it": "10³ = 1000 (prefisso kilo).", "exp_en": "10³ = 1000 (prefix kilo)."},

    # 2. Base ed Esponente
    {"id": 16, "cat": "Base/Esponente", "text_it": "Nella scrittura 7⁴, qual è la BASE ?", "text_en": "In 7⁴, which is the BASE ?", "opts_it": ["4", "7", "28", "11"], "opts_en": ["4", "7", "28", "11"], "correct": 1, "exp_it": "In aⁿ, il numero in basso (7) è la base, quello in alto (4) è l'esponente.", "exp_en": "7 is the base and 4 is the exponent."},
    {"id": 17, "cat": "Base/Esponente", "text_it": "Nella potenza 5⁸, qual è l'ESPONENTE ?", "text_en": "In 5⁸, which is the EXPONENT ?", "opts_it": ["5", "8", "40", "13"], "opts_en": ["5", "8", "40", "13"], "correct": 1, "exp_it": "L'esponente è 8: indica quante volte moltiplicare la base.", "exp_en": "The exponent is 8."},
    {"id": 18, "cat": "Base/Esponente", "text_it": "Trova l'esponente: 2ˣ = 16. Quanto vale x ?", "text_en": "Find x: 2ˣ = 16 :", "opts_it": ["x = 3", "x = 4", "x = 8", "x = 5"], "opts_en": ["x = 3", "x = 4", "x = 8", "x = 5"], "correct": 1, "exp_it": "2 × 2 × 2 × 2 = 16 (4 fattori 2), quindi x = 4.", "exp_en": "2⁴ = 16, so x = 4."},
    {"id": 19, "cat": "Base/Esponente", "text_it": "Trova il valore di x: 3ˣ = 81 :", "text_en": "Find x: 3ˣ = 81 :", "opts_it": ["x = 3", "x = 4", "x = 27", "x = 5"], "opts_en": ["x = 3", "x = 4", "x = 27", "x = 5"], "correct": 1, "exp_it": "3⁴ = 81, quindi x = 4.", "exp_en": "3⁴ = 81, so x = 4."},
    {"id": 20, "cat": "Base/Esponente", "text_it": "Quale base elevata a 3 dà 27 (x³ = 27) ?", "text_en": "What base cubed gives 27 (x³ = 27) ?", "opts_it": ["x = 9", "x = 3", "x = 2", "x = 6"], "opts_en": ["x = 9", "x = 3", "x = 2", "x = 6"], "correct": 1, "exp_it": "3 × 3 × 3 = 27, quindi x = 3.", "exp_en": "3³ = 27, so x = 3."},
    {"id": 21, "cat": "Base/Esponente", "text_it": "Trova la base naturale x: x² = 100 :", "text_en": "Find base x: x² = 100 :", "opts_it": ["x = 50", "x = 10", "x = 20", "x = 5"], "opts_en": ["x = 50", "x = 10", "x = 20", "x = 5"], "correct": 1, "exp_it": "10 × 10 = 100, quindi x = 10.", "exp_en": "10² = 100, so x = 10."},
    {"id": 22, "cat": "Base/Esponente", "text_it": "Scrivi come potenza: 4 × 4 × 4 × 4 × 4 =", "text_en": "Write as power: 4 × 4 × 4 × 4 × 4 =", "opts_it": ["4 × 5", "5⁴", "4⁵", "20"], "opts_en": ["4 × 5", "5⁴", "4⁵", "20"], "correct": 2, "exp_it": "Base 4 ripetuta 5 volte = 4⁵.", "exp_en": "Base 4 repeated 5 times = 4⁵."},
    {"id": 23, "cat": "Base/Esponente", "text_it": "Nell'espressione 2ˣ = 64, quanto vale x ?", "text_en": "In 2ˣ = 64, what is x ?", "opts_it": ["x = 5", "x = 6", "x = 7", "x = 8"], "opts_en": ["x = 5", "x = 6", "x = 7", "x = 8"], "correct": 1, "exp_it": "2⁶ = 64, quindi x = 6.", "exp_en": "2⁶ = 64, so x = 6."},
    {"id": 24, "cat": "Base/Esponente", "text_it": "Trova x in: 10ˣ = 10.000 :", "text_en": "Find x: 10ˣ = 10,000 :", "opts_it": ["x = 3", "x = 4", "x = 5", "x = 40"], "opts_en": ["x = 3", "x = 4", "x = 5", "x = 40"], "correct": 1, "exp_it": "Il numero ha 4 zeri: 10⁴ = 10.000, quindi x = 4.", "exp_en": "4 zeros: 10⁴ = 10,000."},

    # 3. Proprietà: Prodotto stessa base
    {"id": 25, "cat": "Prodotto", "text_it": "Applica la proprietà: 2³ × 2⁴ = ?", "text_en": "Apply rule: 2³ × 2⁴ = ?", "opts_it": ["2¹²", "4⁷", "2⁷", "4¹²"], "opts_en": ["2¹²", "4⁷", "2⁷", "4¹²"], "correct": 2, "exp_it": "Stessa base: si mantiene la base e si SOMMANO gli esponenti (3+4=7) -> 2⁷.", "exp_en": "Keep base and add exponents (3+4=7) -> 2⁷."},
    {"id": 26, "cat": "Prodotto", "text_it": "Semplifica: 5² × 5⁵ =", "text_en": "Simplify: 5² × 5⁵ =", "opts_it": ["5¹⁰", "5⁷", "25⁷", "10⁷"], "opts_en": ["5¹⁰", "5⁷", "25⁷", "10⁷"], "correct": 1, "exp_it": "2 + 5 = 7, quindi 5⁷.", "exp_en": "2 + 5 = 7 -> 5⁷."},
    {"id": 27, "cat": "Prodotto", "text_it": "Calcola: 3⁴ × 3² × 3 =", "text_en": "Calculate: 3⁴ × 3² × 3 =", "opts_it": ["3⁶", "3⁷", "3⁸", "27⁷"], "opts_en": ["3⁶", "3⁷", "3⁸", "27⁷"], "correct": 1, "exp_it": "Ricorda che 3 = 3¹. Somma esponenti: 4 + 2 + 1 = 7 -> 3⁷.", "exp_en": "3 = 3¹. 4 + 2 + 1 = 7 -> 3⁷."},
    {"id": 28, "cat": "Prodotto", "text_it": "Risultato di 7³ × 7⁶ :", "text_en": "Result of 7³ × 7⁶ :", "opts_it": ["7¹⁸", "7⁹", "49⁹", "14⁹"], "opts_en": ["7¹⁸", "7⁹", "49⁹", "14⁹"], "correct": 1, "exp_it": "3 + 6 = 9 -> 7⁹.", "exp_en": "3 + 6 = 9 -> 7⁹."},
    {"id": 29, "cat": "Prodotto", "text_it": "Calcolo MAT: 10² × 10³ equivale a :", "text_en": "MAT calculation: 10² × 10³ =", "opts_it": ["10⁶", "10⁵", "100⁵", "20⁵"], "opts_en": ["10⁶", "10⁵", "100⁵", "20⁵"], "correct": 1, "exp_it": "10²⁺³ = 10⁵ = 100.000.", "exp_en": "10²⁺³ = 10⁵ = 100,000."},
    {"id": 30, "cat": "Prodotto", "text_it": "Qual è la formula del prodotto con stessa base ?", "text_en": "Product of powers formula:", "opts_it": ["aᵐ × aⁿ = aᵐ·ⁿ", "aᵐ × aⁿ = aᵐ⁺ⁿ", "aᵐ × aⁿ = (2a)ᵐ⁺ⁿ", "aᵐ × aⁿ = aᵐ⁻ⁿ"], "opts_en": ["aᵐ × aⁿ = aᵐ·ⁿ", "aᵐ × aⁿ = aᵐ⁺ⁿ", "aᵐ × aⁿ = (2a)ᵐ⁺ⁿ", "aᵐ × aⁿ = aᵐ⁻ⁿ"], "correct": 1, "exp_it": "La proprietà fondamentale: aᵐ × aⁿ = aᵐ⁺ⁿ.", "exp_en": "aᵐ × aⁿ = aᵐ⁺ⁿ."},
    {"id": 31, "cat": "Prodotto", "text_it": "Applica proprietà a: 4⁵ × 4⁰ =", "text_en": "Apply properties: 4⁵ × 4⁰ =", "opts_it": ["0", "4⁰", "4⁵", "1"], "opts_en": ["0", "4⁰", "4⁵", "1"], "correct": 2, "exp_it": "5 + 0 = 5 -> 4⁵.", "exp_en": "5 + 0 = 5 -> 4⁵."},
    {"id": 32, "cat": "Prodotto", "text_it": "A quanto corrisponde 6 × 6⁴ ?", "text_en": "What does 6 × 6⁴ equal?", "opts_it": ["6⁴", "6⁵", "36⁴", "6⁶"], "opts_en": ["6⁴", "6⁵", "36⁴", "6⁶"], "correct": 1, "exp_it": "6¹ × 6⁴ = 6⁵.", "exp_en": "6¹ × 6⁴ = 6⁵."},

    # 4. Proprietà: Quoziente stessa base
    {"id": 33, "cat": "Quoziente", "text_it": "Calcola: 2⁷ : 2³ =", "text_en": "Calculate: 2⁷ : 2³ =", "opts_it": ["2⁴", "2¹⁰", "1⁴", "2²¹"], "opts_en": ["2⁴", "2¹⁰", "1⁴", "2²¹"], "correct": 0, "exp_it": "Quoziente stessa base: si SOTTRAGGONO gli esponenti (7-3=4) -> 2⁴.", "exp_en": "Subtract exponents: 7 - 3 = 4 -> 2⁴."},
    {"id": 34, "cat": "Quoziente", "text_it": "Semplifica: 5⁸ : 5² =", "text_en": "Simplify: 5⁸ : 5² =", "opts_it": ["5⁴", "5⁶", "5¹⁰", "1⁶"], "opts_en": ["5⁴", "5⁶", "5¹⁰", "1⁶"], "correct": 1, "exp_it": "8 - 2 = 6 -> 5⁶.", "exp_en": "8 - 2 = 6 -> 5⁶."},
    {"id": 35, "cat": "Quoziente", "text_it": "Quanto vale 3⁹ : 3⁶ ?", "text_en": "What is 3⁹ : 3⁶ ?", "opts_it": ["3³ (= 27)", "3¹⁵", "1³ (= 1)", "3¹.⁵"], "opts_en": ["3³ (= 27)", "3¹⁵", "1³ (= 1)", "3¹.⁵"], "correct": 0, "exp_it": "3⁹⁻⁶ = 3³ = 27.", "exp_en": "3⁹⁻⁶ = 3³ = 27."},
    {"id": 36, "cat": "Quoziente", "text_it": "In officina MAT: 10⁶ : 10² =", "text_en": "Workshop calculation: 10⁶ : 10² =", "opts_it": ["10³", "10⁴", "10⁸", "10¹²"], "opts_en": ["10³", "10⁴", "10⁸", "10¹²"], "correct": 1, "exp_it": "10⁶⁻² = 10⁴ = 10.000.", "exp_en": "10⁶⁻² = 10⁴ = 10,000."},
    {"id": 37, "cat": "Quoziente", "text_it": "Quanto fa 7⁵ : 7⁴ ?", "text_en": "What is 7⁵ : 7⁴ ?", "opts_it": ["7¹ = 7", "7⁹", "1", "49"], "opts_en": ["7¹ = 7", "7⁹", "1", "49"], "correct": 0, "exp_it": "7⁵⁻⁴ = 7¹ = 7.", "exp_en": "7⁵⁻⁴ = 7¹ = 7."},
    {"id": 38, "cat": "Quoziente", "text_it": "Calcola: 4⁶ : 4⁶ =", "text_en": "Calculate: 4⁶ : 4⁶ =", "opts_it": ["4¹²", "0", "4⁰ = 1", "4"], "opts_en": ["4¹²", "0", "4⁰ = 1", "4"], "correct": 2, "exp_it": "4⁶⁻⁶ = 4⁰ = 1. Qualsiasi numero diviso per se stesso vale 1!", "exp_en": "4⁶⁻⁶ = 4⁰ = 1."},
    {"id": 39, "cat": "Quoziente", "text_it": "Riduci a una potenza: 8¹⁰ : 8⁷ =", "text_en": "Reduce: 8¹⁰ : 8⁷ =", "opts_it": ["8³", "8¹⁷", "1³", "8⁷⁰"], "opts_en": ["8³", "8¹⁷", "1³", "8⁷⁰"], "correct": 0, "exp_it": "8¹⁰⁻⁷ = 8³.", "exp_en": "8¹⁰⁻⁷ = 8³."},

    # 5. Proprietà: Potenza di potenza
    {"id": 40, "cat": "Potenza di Potenza", "text_it": "Applica la proprietà: (2³)² =", "text_en": "Apply rule: (2³)² =", "opts_it": ["2⁵", "2⁶", "2⁹", "4⁶"], "opts_en": ["2⁵", "2⁶", "2⁹", "4⁶"], "correct": 1, "exp_it": "Potenza di potenza: si MOLTIPLICANO gli esponenti (3×2=6) -> 2⁶.", "exp_en": "Multiply exponents: 3 × 2 = 6 -> 2⁶."},
    {"id": 41, "cat": "Potenza di Potenza", "text_it": "Semplifica l'espressione: (3²)⁴ =", "text_en": "Simplify: (3²)⁴ =", "opts_it": ["3⁶", "3⁸", "3¹⁶", "9⁸"], "opts_en": ["3⁶", "3⁸", "3¹⁶", "9⁸"], "correct": 1, "exp_it": "2 × 4 = 8 -> 3⁸.", "exp_en": "2 × 4 = 8 -> 3⁸."},
    {"id": 42, "cat": "Potenza di Potenza", "text_it": "Calcola: [ (5²)³ ]² =", "text_en": "Calculate: [ (5²)³ ]² =", "opts_it": ["5⁷", "5¹²", "5¹⁸", "25¹²"], "opts_en": ["5⁷", "5¹²", "5¹⁸", "25¹²"], "correct": 1, "exp_it": "2 × 3 × 2 = 12 -> 5¹².", "exp_en": "2 × 3 × 2 = 12 -> 5¹²."},
    {"id": 43, "cat": "Potenza di Potenza", "text_it": "Ordini di grandezza: (10³)² =", "text_en": "Magnitude: (10³)² =", "opts_it": ["10⁵", "10⁶", "10⁹", "100⁶"], "opts_en": ["10⁵", "10⁶", "10⁹", "100⁶"], "correct": 1, "exp_it": "10³·² = 10⁶ (da kilo a mega).", "exp_en": "10³·² = 10⁶."},
    {"id": 44, "cat": "Potenza di Potenza", "text_it": "Quanto vale (7⁴)⁰ ?", "text_en": "What is (7⁴)⁰ ?", "opts_it": ["0", "7", "1", "7⁴"], "opts_en": ["0", "7", "1", "7⁴"], "correct": 2, "exp_it": "7⁴·⁰ = 7⁰ = 1.", "exp_en": "7⁴·⁰ = 7⁰ = 1."},

    # 6. Proprietà: Stesso esponente
    {"id": 45, "cat": "Stesso Esponente", "text_it": "Calcola con le proprietà: 2³ × 5³ =", "text_en": "Calculate: 2³ × 5³ =", "opts_it": ["10³ (= 1000)", "10⁶", "7³", "7⁶"], "opts_en": ["10³ (= 1000)", "10⁶", "7³", "7⁶"], "correct": 0, "exp_it": "Stesso esponente: si moltiplicano le basi (2×5)³ = 10³ = 1000.", "exp_en": "(2 × 5)³ = 10³ = 1000."},
    {"id": 46, "cat": "Stesso Esponente", "text_it": "Esprimi come unica potenza: 3² × 4² =", "text_en": "Express as single power: 3² × 4² =", "opts_it": ["12⁴", "7²", "12²", "7⁴"], "opts_en": ["12⁴", "7²", "12²", "7⁴"], "correct": 2, "exp_it": "(3 × 4)² = 12².", "exp_en": "(3 × 4)² = 12²."},
    {"id": 47, "cat": "Stesso Esponente", "text_it": "Calcola: 12⁴ : 3⁴ =", "text_en": "Calculate: 12⁴ : 3⁴ =", "opts_it": ["4⁴", "9⁴", "4⁰", "4¹"], "opts_en": ["4⁴", "9⁴", "4⁰", "4¹"], "correct": 0, "exp_it": "(12 : 3)⁴ = 4⁴.", "exp_en": "(12 : 3)⁴ = 4⁴."},
    {"id": 48, "cat": "Stesso Esponente", "text_it": "Semplifica: 20³ : 5³ =", "text_en": "Simplify: 20³ : 5³ =", "opts_it": ["15³", "4³", "4¹", "4⁶"], "opts_en": ["15³", "4³", "4¹", "4⁶"], "correct": 1, "exp_it": "(20 : 5)³ = 4³ = 64.", "exp_en": "(20 : 5)³ = 4³ = 64."},
    {"id": 49, "cat": "Stesso Esponente", "text_it": "Riscrivi: 2⁵ × 3⁵ =", "text_en": "Rewrite: 2⁵ × 3⁵ =", "opts_it": ["6¹⁰", "5⁵", "6⁵", "5¹⁰"], "opts_en": ["6¹⁰", "5⁵", "6⁵", "5¹⁰"], "correct": 2, "exp_it": "(2 × 3)⁵ = 6⁵.", "exp_en": "(2 × 3)⁵ = 6⁵."},

    # 7. Casi particolari (0 e 1)
    {"id": 50, "cat": "Casi Particolari", "text_it": "Qual è il valore di 8⁰ ?", "text_en": "What is the value of 8⁰ ?", "opts_it": ["0", "1", "8", "Impossibile"], "opts_en": ["0", "1", "8", "Impossible"], "correct": 1, "exp_it": "Ogni numero diverso da zero elevato a zero vale 1 (a⁰ = 1).", "exp_en": "Any non-zero number to power 0 is 1."},
    {"id": 51, "cat": "Casi Particolari", "text_it": "Quanto vale 1²⁰²⁶ ?", "text_en": "What is 1²⁰²⁶ ?", "opts_it": ["2026", "1", "0", "2026!"], "opts_en": ["2026", "1", "0", "2026!"], "correct": 1, "exp_it": "1 moltiplicato per se stesso qualsiasi numero di volte dà sempre 1.", "exp_en": "1 to any power is always 1."},
    {"id": 52, "cat": "Casi Particolari", "text_it": "A quanto corrisponde 0⁵ ?", "text_en": "What does 0⁵ equal?", "opts_it": ["0", "1", "5", "Non esiste"], "opts_en": ["0", "1", "5", "Does not exist"], "correct": 0, "exp_it": "0 elevato a esponente positivo fa sempre 0.", "exp_en": "0 to any positive power is 0."},
    {"id": 53, "cat": "Casi Particolari", "text_it": "Cosa si dice di 0⁰ nei numeri naturali ?", "text_en": "What is 0⁰ in natural numbers?", "opts_it": ["Vale 0", "Vale 1", "Non ha significato (forma indeterminata)", "Vale infinito"], "opts_en": ["Equals 0", "Equals 1", "Has no meaning (indeterminate)", "Infinity"], "correct": 2, "exp_it": "0⁰ è una scrittura priva di significato aritmetico (indeterminata).", "exp_en": "0⁰ is indeterminate."},
    {"id": 54, "cat": "Casi Particolari", "text_it": "Quanto vale 15¹ ?", "text_en": "What is 15¹ ?", "opts_it": ["1", "0", "15", "150"], "opts_en": ["1", "0", "15", "150"], "correct": 2, "exp_it": "a¹ = a. Quindi 15¹ = 15.", "exp_en": "a¹ = a, so 15¹ = 15."},
    {"id": 55, "cat": "Casi Particolari", "text_it": "Calcola: 100⁰ + 1¹⁰⁰ =", "text_en": "Calculate: 100⁰ + 1¹⁰⁰ =", "opts_it": ["101", "2", "1", "200"], "opts_en": ["101", "2", "1", "200"], "correct": 1, "exp_it": "100⁰ = 1 e 1¹⁰⁰ = 1. Quindi 1 + 1 = 2.", "exp_en": "1 + 1 = 2."},

    # 8. Potenze di 10 e unità MAT
    {"id": 56, "cat": "Potenze di 10", "text_it": "Nel settore MAT, a cosa corrisponde 10⁶ (prefisso Mega) ?", "text_en": "In technical MAT, what does 10⁶ (Mega) represent?", "opts_it": ["1.000", "10.000", "100.000", "1.000.000 (un milione)"], "opts_en": ["1,000", "10,000", "100,000", "1,000,000 (one million)"], "correct": 3, "exp_it": "10⁶ = 1 seguito da 6 zeri = 1.000.000 (Mega, es. MHz).", "exp_en": "10⁶ = 1,000,000."},
    {"id": 57, "cat": "Potenze di 10", "text_it": "Un motore eroga 5 kW (kilowatt). Quanti Watt sono espressi con potenze di 10 ?", "text_en": "A motor delivers 5 kW. How many Watts using powers of 10?", "opts_it": ["5 × 10² W", "5 × 10³ W", "5 × 10⁴ W", "5 × 10⁶ W"], "opts_en": ["5 × 10² W", "5 × 10³ W", "5 × 10⁴ W", "5 × 10⁶ W"], "correct": 1, "exp_it": "kilo = 10³ = 1000. Dunque 5 kW = 5 × 10³ W = 5000 W.", "exp_en": "kilo = 10³, so 5 × 10³ W."},
    {"id": 58, "cat": "Potenze di 10", "text_it": "Quanti zeri ha dopo l'1 il numero naturale 10⁷ ?", "text_en": "How many zeros in 10⁷ ?", "opts_it": ["6 zeri", "7 zeri", "8 zeri", "10 zeri"], "opts_en": ["6 zeros", "7 zeros", "8 zeros", "10 zeros"], "correct": 1, "exp_it": "Nelle potenze di 10, l'esponente indica esattamente il numero di zeri (7 zeri).", "exp_en": "10ⁿ has n zeros, so 7 zeros."},
    {"id": 59, "cat": "Potenze di 10", "text_it": "Un tornio gira a 3 × 10⁴ giri/min. A quale numero intero corrisponde ?", "text_en": "A lathe rotates at 3 × 10⁴ rpm. What integer is this?", "opts_it": ["300", "3.000", "30.000", "300.000"], "opts_en": ["300", "3,000", "30,000", "300,000"], "correct": 2, "exp_it": "3 × 10⁴ = 3 × 10.000 = 30.000 giri/min.", "exp_en": "3 × 10,000 = 30,000."},

    # 9. Errori tipici da evitare
    {"id": 60, "cat": "Errori Tipici", "text_it": "Quale delle seguenti affermazioni è FALSA ?", "text_en": "Which statement is FALSE ?", "opts_it": ["2³ = 8", "2³ = 2 × 3 = 6", "3² = 9", "4² = 16"], "opts_en": ["2³ = 8", "2³ = 2 × 3 = 6", "3² = 9", "4² = 16"], "correct": 1, "exp_it": "Errore tipico grave! 2³ NON è 2 × 3 = 6, ma 2 × 2 × 2 = 8!", "exp_en": "2³ is 8, not 6!"},
    {"id": 61, "cat": "Errori Tipici", "text_it": "Attenzione alla somma: 2³ + 2² =", "text_en": "Watch addition: 2³ + 2² =", "opts_it": ["2⁵ = 32", "12", "4⁵ = 1024", "10"], "opts_en": ["2⁵ = 32", "12", "4⁵ = 1024", "10"], "correct": 1, "exp_it": "Le proprietà valgono per il PRODOTTO (×), non per la somma (+)! Si calcola: 8 + 4 = 12.", "exp_en": "Rules apply to multiplication, not addition: 8 + 4 = 12."},
    {"id": 62, "cat": "Errori Tipici", "text_it": "Quale confronto tra potenze è CORRETTO ?", "text_en": "Which comparison is CORRECT ?", "opts_it": ["5⁰ > 5¹", "5⁰ = 0", "5¹ > 5⁰", "5⁰ = 5"], "opts_en": ["5⁰ > 5¹", "5⁰ = 0", "5¹ > 5⁰", "5⁰ = 5"], "correct": 2, "exp_it": "5¹ = 5 e 5⁰ = 1. Dato che 5 > 1, la risposta corretta è 5¹ > 5⁰.", "exp_en": "5¹ = 5 and 5⁰ = 1, so 5¹ > 5⁰."}
]

# --- INIZIALIZZAZIONE DELLO STATO DELLA SESSIONE ---
if "view" not in st.session_state:
    st.session_state.view = "login"
if "student_name" not in st.session_state:
    st.session_state.student_name = ""
if "student_surname" not in st.session_state:
    st.session_state.student_surname = ""
if "language" not in st.session_state:
    st.session_state.language = "it"
if "game_questions" not in st.session_state:
    st.session_state.game_questions = []
if "current_q_idx" not in st.session_state:
    st.session_state.current_q_idx = 0
if "lives" not in st.session_state:
    st.session_state.lives = 3
if "score" not in st.session_state:
    st.session_state.score = 0
if "streak" not in st.session_state:
    st.session_state.streak = 0
if "answered_count" not in st.session_state:
    st.session_state.answered_count = 0
if "timeouts_count" not in st.session_state:
    st.session_state.timeouts_count = 0
if "attempt_id" not in st.session_state:
    st.session_state.attempt_id = ""
if "q_start_time" not in st.session_state:
    st.session_state.q_start_time = time.time()
if "total_start_time" not in st.session_state:
    st.session_state.total_start_time = time.time()
if "answers_log" not in st.session_state:
    st.session_state.answers_log = []
if "last_feedback" not in st.session_state:
    st.session_state.last_feedback = None
if "attempt_saved" not in st.session_state:
    st.session_state.attempt_saved = False

def start_new_game():
    st.session_state.attempt_id = f"att_{int(time.time())}_{random.randint(100, 999)}"
    st.session_state.game_questions = random.sample(QUESTIONS_BANK, 12)
    st.session_state.current_q_idx = 0
    st.session_state.lives = 3
    st.session_state.score = 0
    st.session_state.streak = 0
    st.session_state.answered_count = 0
    st.session_state.timeouts_count = 0
    st.session_state.answers_log = []
    st.session_state.last_feedback = None
    st.session_state.total_start_time = time.time()
    st.session_state.q_start_time = time.time()
    st.session_state.attempt_saved = True

    # SALVATAGGIO IMMEDIATO ALL'AVVIO: traccia l'alunno fin dal primo secondo (anche se risponde a 0 domande!)
    save_or_update_attempt(
        attempt_id=st.session_state.attempt_id,
        name=st.session_state.student_name,
        surname=st.session_state.student_surname,
        language=st.session_state.language,
        score=0,
        correct=0,
        answered=0,
        timeouts=0,
        total=12,
        lives=3,
        total_time=0,
        completed=False,
        status="In corso (0/12 risposte date)"
    )
    st.session_state.view = "game"

# --- SIDEBAR: NAVIGAZIONE, DOCENTE E INFO ---
st.sidebar.markdown("""
<div style="text-align: center; padding: 1rem 0;">
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); width: 48px; height: 48px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: #020617; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        ⚡
    </div>
    <h2 style="margin: 0.5rem 0 0 0; font-size: 1.4rem;">PowerQuest</h2>
    <span class="mat-badge" style="margin-top: 0.25rem;">MAT 1° Anno</span>
</div>
""", unsafe_allow_html=True)

st.sidebar.markdown("---")
st.sidebar.subheader("🔒 Area Riservata Docente")
admin_pass = st.sidebar.text_input("Password Amministratore", type="password", key="sidebar_pass")
is_teacher = (admin_pass == "DocenteMAT2026")

if admin_pass and not is_teacher:
    st.sidebar.error("❌ Password non corretta")
elif is_teacher:
    st.sidebar.success("✅ Accesso Docente Verificato")

show_teacher_dash = st.sidebar.checkbox("Visualizza Dashboard Docente", value=False) if is_teacher else False

# ==============================================================================
# VISTA 1: DASHBOARD DOCENTE
# ==============================================================================
if show_teacher_dash:
    st.markdown("""
    <div class="mat-card-glow">
        <span class="mat-badge">Pannello di Amministrazione</span>
        <h1 style="margin-top: 0.5rem;">📊 Dashboard e Registro Docente MAT</h1>
        <p style="color: #94a3b8; font-size: 0.9rem;">
            I tentativi degli studenti vengono registrati istantaneamente in tempo reale: sono visibili anche gli alunni che hanno risposto a 0 domande o lasciato scadere il tempo.
        </p>
    </div>
    """, unsafe_allow_html=True)

    col_ref, col_csv, col_del = st.columns([1, 1, 1])
    with col_ref:
        if st.button("🔄 Aggiorna Registro Dati", use_container_width=True):
            st.rerun()

    df = get_all_attempts()

    if df.empty:
        st.info("ℹ️ Nessun tentativo registrato finora. Gli esiti appariranno qui automaticamente appena gli studenti avviano una sessione.")
    else:
        # Metriche di classe
        total_attempts = len(df)
        unique_students = df['student_surname'].str.lower().nunique() if 'student_surname' in df else 0
        avg_score = round(df['score'].mean(), 1) if 'score' in df else 0
        max_score = int(df['score'].max()) if 'score' in df else 0
        
        m1, m2, m3, m4 = st.columns(4)
        with m1:
            st.markdown(f"""
            <div class="metric-box">
                <div class="metric-lbl">Tentativi Registrati</div>
                <div class="metric-val">{total_attempts}</div>
            </div>
            """, unsafe_allow_html=True)
        with m2:
            st.markdown(f"""
            <div class="metric-box">
                <div class="metric-lbl">Alunni Unici</div>
                <div class="metric-val">{unique_students}</div>
            </div>
            """, unsafe_allow_html=True)
        with m3:
            st.markdown(f"""
            <div class="metric-box">
                <div class="metric-lbl">Punteggio Medio</div>
                <div class="metric-val">{avg_score} pt</div>
            </div>
            """, unsafe_allow_html=True)
        with m4:
            st.markdown(f"""
            <div class="metric-box">
                <div class="metric-lbl">Miglior Punteggio</div>
                <div class="metric-val">{max_score} pt</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)
        st.subheader("🏆 Registro Completo Alunni (Tracciamento Risposte e Timeout)")
        
        df_display = df.copy()
        if 'student_name' in df_display and 'student_surname' in df_display:
            df_display['Studente'] = df_display['student_name'] + " " + df_display['student_surname']
        
        if 'questions_answered' not in df_display:
            df_display['questions_answered'] = 0
        if 'timeouts_count' not in df_display:
            df_display['timeouts_count'] = 0
        if 'status' not in df_display:
            df_display['status'] = df_display.get('completed', False).apply(lambda x: "Completato 12/12 ✅" if x else "Vite Finite ❌")

        df_display['Domande Risposte'] = df_display['questions_answered'].astype(str) + " / 12"
        df_display['Risposte Esatte'] = df_display['correct_answers'].astype(str) + " / 12"
        df_display['Timeout'] = df_display['timeouts_count'].astype(str)
        
        cols_to_show = []
        rename_dict = {}
        for c, label in [
            ('Studente', 'Alunno'),
            ('score', 'Punteggio'),
            ('Domande Risposte', 'Quesiti Risposti'),
            ('Risposte Esatte', 'Risposte Esatte'),
            ('Timeout', 'Timeout (Scaduti)'),
            ('lives_remaining', 'Vite Rimaste'),
            ('total_time_seconds', 'Tempo (s)'),
            ('status', 'Stato / Esito'),
            ('created_at', 'Data / Ora')
        ]:
            if c in df_display.columns:
                cols_to_show.append(c)
                rename_dict[c] = label
                
        table_final = df_display[cols_to_show].rename(columns=rename_dict)
        st.dataframe(table_final.reset_index(drop=True), use_container_width=True)

        with col_csv:
            csv_data = df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="📥 Esporta CSV",
                data=csv_data,
                file_name=f"registro_potenze_mat_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv",
                use_container_width=True
            )

        with col_del:
            if st.button("⚠️ Cancella Registro", use_container_width=True):
                try:
                    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
                    c = conn.cursor()
                    c.execute("DELETE FROM attempts")
                    conn.commit()
                    conn.close()
                except Exception:
                    pass
                try:
                    with open(JSON_BACKUP, "w", encoding="utf-8") as f:
                        json.dump([], f)
                except Exception:
                    pass
                st.success("Registro azzerato.")
                st.rerun()

# ==============================================================================
# VISTA 2: LOGIN STUDENTE
# ==============================================================================
elif st.session_state.view == "login":
    st.markdown("""
    <div style="text-align: center; padding: 2rem 0 1rem 0;">
        <span class="mat-badge">Istituto Professionale / Tecnico MAT - 1° Anno</span>
        <h1 style="font-size: 2.8rem; margin: 0.75rem 0 0.5rem 0; font-weight: 900;">
            ⚡ PowerQuest MAT
        </h1>
        <p style="color: #94a3b8; font-size: 1.1rem; max-width: 600px; margin: 0 auto;">
            Banco di prova e gioco didattico interattivo sulle potenze nei numeri naturali.
        </p>
    </div>
    """, unsafe_allow_html=True)

    col_left, col_right = st.columns([6, 5], gap="large")

    with col_left:
        st.markdown("""
        <div class="mat-card">
            <h3 style="margin-top: 0;">📝 Accesso Studente</h3>
            <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 1.25rem;">
                Compila i campi per avviare la sessione di 12 quesiti.
            </p>
        </div>
        """, unsafe_allow_html=True)

        name = st.text_input("1. Nome *", value=st.session_state.student_name, placeholder="Es. Marco")
        surname = st.text_input("2. Cognome *", value=st.session_state.student_surname, placeholder="Es. Rossi")
        lang_choice = st.selectbox("3. Lingua di gioco / Language *", ["Italiano 🇮🇹", "English 🇬🇧"], index=0 if st.session_state.language == "it" else 1)

        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("🚀 INIZIA LA PARTITA", type="primary", use_container_width=True):
            if not name.strip() or not surname.strip():
                st.error("⚠️ Per favore, inserisci sia il Nome che il Cognome per iniziare!")
            else:
                st.session_state.student_name = name.strip()
                st.session_state.student_surname = surname.strip()
                st.session_state.language = "it" if "Italiano" in lang_choice else "en"
                start_new_game()
                st.rerun()

    with col_right:
        st.markdown("""
        <div class="mat-card">
            <h3 style="margin-top: 0;">📜 Regole del Banco di Prova</h3>
            <ul style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.8; padding-left: 1.25rem;">
                <li>🎲 <strong>12 Esercizi</strong> estratti casualmente dal paniere delle potenze.</li>
                <li>⏳ <strong>2 Minuti (120s)</strong> per ciascun esercizio.</li>
                <li>❤️ <strong>3 Vite</strong> a disposizione: ogni errore o tempo scaduto consuma 1 vita.</li>
                <li>⚡ <strong>Bonus Velocità</strong>: rispondere rapidamente conferisce punti addizionali.</li>
                <li>💾 <strong>Salvataggio Automatico</strong>: il punteggio finale viene archiviato centralmente per il docente.</li>
            </ul>
        </div>
        
        <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 1rem; padding: 1rem; font-size: 0.85rem; color: #fde68a;">
            💡 <strong>Didattica MAT:</strong> Gli esercizi includono proprietà delle potenze, basi ed esponenti, casi speciali (0 e 1), potenze di 10 (kilo, mega) ed errori tipici d'officina.
        </div>
        """, unsafe_allow_html=True)

# ==============================================================================
# VISTA 3: GIOCO ATTIVO (TIMER FUNZIONANTE + RISPOSTA CON 1 CLICK SENZA ERRORI)
# ==============================================================================
elif st.session_state.view == "game":
    lang = st.session_state.language
    q_idx = st.session_state.current_q_idx
    q = st.session_state.game_questions[q_idx]

    # Calcolo tempo trascorso sul quesito corrente (max 120 secondi)
    elapsed_q = int(time.time() - st.session_state.q_start_time)
    remaining_q = max(0, 120 - elapsed_q)

    # 1. BARRA SUPERIORE (HUD): Alunno, Progresso, Cuori Vite, Punteggio
    lives_hearts = "".join([f'<span class="heart-active">❤️</span>' if i < st.session_state.lives else '<span class="heart-lost">🖤</span>' for i in range(3)])

    st.markdown(f"""
    <div class="mat-card" style="padding: 1rem 1.5rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
                <span class="mat-badge">Domanda {q_idx + 1} di 12</span>
                <div style="font-weight: 800; font-size: 1.1rem; color: white; margin-top: 0.25rem;">
                    👤 {st.session_state.student_name} {st.session_state.student_surname}
                </div>
            </div>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; display: block;">Vite Rimaste</span>
                <div>{lives_hearts}</div>
            </div>
            <div style="text-align: right;">
                <span style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; display: block;">Punteggio</span>
                <div class="math-font" style="font-size: 1.4rem; font-weight: 900; color: #fbbf24;">
                    🏆 {st.session_state.score} pt
                </div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # 2. CONTATORE VISIVO DEL TIMER (Client-Side HTML/JS che scorre in tempo reale)
    timer_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <style>
    * {{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }}
    body {{
        background: transparent;
        color: #f1f5f9;
        overflow: hidden;
    }}
    .timer-wrap {{
        padding: 2px 0 6px 0;
    }}
    .timer-meta {{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
    }}
    .timer-pill {{
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        font-size: 0.95rem;
        padding: 4px 10px;
        border-radius: 8px;
        transition: all 0.3s ease;
    }}
    .timer-track {{
        width: 100%;
        height: 8px;
        background: #1e293b;
        border-radius: 9999px;
        overflow: hidden;
    }}
    .timer-bar {{
        height: 100%;
        border-radius: 9999px;
        transition: width 1s linear, background-color 0.4s ease;
    }}
    @keyframes pulseWarning {{
        0%, 100% {{ opacity: 1; transform: scale(1); }}
        50% {{ opacity: 0.75; transform: scale(1.02); }}
    }}
    .urgent {{
        animation: pulseWarning 0.8s infinite;
    }}
    </style>
    </head>
    <body>
    <div class="timer-wrap">
        <div class="timer-meta">
            <div id="pill" class="timer-pill" style="color: #10b981; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3);">
                ⏳ <span id="secs">{remaining_q}</span>s rimanenti
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">
                2 Minuti (120s) per esercizio
            </div>
        </div>
        <div class="timer-track">
            <div id="bar" class="timer-bar" style="width: {(remaining_q / 120.0) * 100}%; background-color: #10b981;"></div>
        </div>
    </div>

    <script>
    let remaining = {remaining_q};
    const total = 120;
    const secsEl = document.getElementById('secs');
    const pillEl = document.getElementById('pill');
    const barEl = document.getElementById('bar');

    function renderTimer() {{
        secsEl.textContent = remaining;
        const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
        barEl.style.width = pct + '%';

        if (remaining > 60) {{
            barEl.style.backgroundColor = '#10b981';
            pillEl.style.color = '#10b981';
            pillEl.style.background = 'rgba(16, 185, 129, 0.15)';
            pillEl.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            pillEl.classList.remove('urgent');
        }} else if (remaining > 25) {{
            barEl.style.backgroundColor = '#f59e0b';
            pillEl.style.color = '#f59e0b';
            pillEl.style.background = 'rgba(245, 158, 11, 0.15)';
            pillEl.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            pillEl.classList.remove('urgent');
        }} else {{
            barEl.style.backgroundColor = '#ef4444';
            pillEl.style.color = '#ef4444';
            pillEl.style.background = 'rgba(239, 68, 68, 0.2)';
            pillEl.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            pillEl.classList.add('urgent');
        }}
    }}

    renderTimer();

    const interval = setInterval(() => {{
        remaining -= 1;
        if (remaining <= 0) {{
            remaining = 0;
            renderTimer();
            clearInterval(interval);
            try {{
                window.parent.location.reload();
            }} catch(e) {{
                // fallback
            }}
        }} else {{
            renderTimer();
        }}
    }}, 1000);
    </script>
    </body>
    </html>
    """
    components.html(timer_html, height=52)

    # Verifica scadenza tempo
    if remaining_q <= 0:
        st.session_state.lives -= 1
        st.session_state.streak = 0
        st.session_state.timeouts_count += 1
        current_opts = q["opts_it"] if lang == "it" else q["opts_en"]
        st.session_state.answers_log.append({
            "question": q.get("text_it" if lang == "it" else "text_en"),
            "selected": "Tempo scaduto (Timeout)",
            "correct": current_opts[q["correct"]],
            "is_correct": False
        })
        st.session_state.last_feedback = {
            "correct": False,
            "timeout": True,
            "points": 0,
            "correct_ans": current_opts[q["correct"]],
            "explanation": q["exp_it"] if lang == "it" else q["exp_en"]
        }
        tot_time = int(time.time() - st.session_state.total_start_time)
        correct_count = sum(1 for a in st.session_state.answers_log if a.get("is_correct"))
        is_game_over = (st.session_state.lives <= 0)
        status_msg = "Game Over (Vite finite per timeout)" if is_game_over else f"In corso ({st.session_state.answered_count}/12 risposte, {st.session_state.timeouts_count} timeout)"
        save_or_update_attempt(
            attempt_id=st.session_state.attempt_id,
            name=st.session_state.student_name,
            surname=st.session_state.student_surname,
            language=st.session_state.language,
            score=st.session_state.score,
            correct=correct_count,
            answered=st.session_state.answered_count,
            timeouts=st.session_state.timeouts_count,
            total=12,
            lives=max(0, st.session_state.lives),
            total_time=tot_time,
            completed=False,
            status=status_msg
        )
        st.session_state.view = "feedback"
        st.rerun()

    # 3. CARD QUESITO MATEMATICO
    q_text = q["text_it"] if lang == "it" else q["text_en"]
    opts = q["opts_it"] if lang == "it" else q["opts_en"]

    st.markdown(f"""
    <div class="mat-card-glow">
        <span class="mat-badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3);">
            📐 {q.get('cat', 'Potenze')}
        </span>
        <h2 style="font-size: 1.8rem; margin: 1rem 0 0.5rem 0; line-height: 1.3;">
            {q_text}
        </h2>
        <p style="color: #94a3b8; font-size: 0.85rem;">
            Seleziona la risposta esatta cliccando sul pulsante corrispondente:
        </p>
    </div>
    """, unsafe_allow_html=True)

    # 4. PULSANTI RISPOSTA DIRETTI (A, B, C, D) CON INVIO IMMEDIATO E SENZA DESINCRONIZZAZIONE
    col1, col2 = st.columns(2, gap="medium")
    letter_badges = ["A", "B", "C", "D"]

    def process_answer(chosen_idx):
        time_spent = int(time.time() - st.session_state.q_start_time)
        remaining = max(0, 120 - time_spent)

        if remaining <= 0:
            st.session_state.lives -= 1
            st.session_state.streak = 0
            st.session_state.timeouts_count += 1
            st.session_state.last_feedback = {
                "correct": False,
                "timeout": True,
                "points": 0,
                "correct_ans": opts[q["correct"]],
                "explanation": q["exp_it"] if lang == "it" else q["exp_en"]
            }
            st.session_state.answers_log.append({
                "question": q_text,
                "selected": "Tempo scaduto (Timeout)",
                "correct": opts[q["correct"]],
                "is_correct": False
            })
            tot_time = int(time.time() - st.session_state.total_start_time)
            correct_count = sum(1 for a in st.session_state.answers_log if a.get("is_correct"))
            is_game_over = (st.session_state.lives <= 0)
            status_msg = "Game Over (Vite finite per timeout)" if is_game_over else f"In corso ({st.session_state.answered_count}/12 risposte, {st.session_state.timeouts_count} timeout)"
            save_or_update_attempt(
                attempt_id=st.session_state.attempt_id,
                name=st.session_state.student_name,
                surname=st.session_state.student_surname,
                language=st.session_state.language,
                score=st.session_state.score,
                correct=correct_count,
                answered=st.session_state.answered_count,
                timeouts=st.session_state.timeouts_count,
                total=12,
                lives=max(0, st.session_state.lives),
                total_time=tot_time,
                completed=False,
                status=status_msg
            )
            st.session_state.view = "feedback"
            st.rerun()
            return

        is_correct = (chosen_idx == q["correct"])
        st.session_state.answered_count += 1

        if is_correct:
            streak = st.session_state.streak + 1
            st.session_state.streak = streak
            multiplier = 1.5 if streak >= 3 else (1.2 if streak >= 2 else 1.0)
            earned = int((100 + remaining) * multiplier)
            st.session_state.score += earned
            st.session_state.last_feedback = {
                "correct": True,
                "timeout": False,
                "points": earned,
                "correct_ans": opts[q["correct"]],
                "explanation": q["exp_it"] if lang == "it" else q["exp_en"]
            }
        else:
            st.session_state.lives -= 1
            st.session_state.streak = 0
            st.session_state.last_feedback = {
                "correct": False,
                "timeout": False,
                "points": 0,
                "correct_ans": opts[q["correct"]],
                "explanation": q["exp_it"] if lang == "it" else q["exp_en"]
            }

        st.session_state.answers_log.append({
            "question": q_text,
            "selected": opts[chosen_idx],
            "correct": opts[q["correct"]],
            "is_correct": is_correct
        })

        # Aggiornamento atomico immediato del tentativo
        tot_time = int(time.time() - st.session_state.total_start_time)
        correct_count = sum(1 for a in st.session_state.answers_log if a.get("is_correct"))
        is_game_over = (st.session_state.lives <= 0)
        is_finished = (st.session_state.current_q_idx + 1 >= 12)

        if is_game_over:
            status_msg = f"Game Over (Vite esaurite alla dom. {st.session_state.current_q_idx + 1})"
        elif is_finished:
            status_msg = f"Completato ({correct_count}/12 corrette)"
        else:
            status_msg = f"In corso ({st.session_state.answered_count}/12 risposte date)"

        save_or_update_attempt(
            attempt_id=st.session_state.attempt_id,
            name=st.session_state.student_name,
            surname=st.session_state.student_surname,
            language=st.session_state.language,
            score=st.session_state.score,
            correct=correct_count,
            answered=st.session_state.answered_count,
            timeouts=st.session_state.timeouts_count,
            total=12,
            lives=max(0, st.session_state.lives),
            total_time=tot_time,
            completed=is_finished and not is_game_over,
            status=status_msg
        )

        st.session_state.view = "feedback"
        st.rerun()

    for idx, opt_text in enumerate(opts):
        target_col = col1 if idx % 2 == 0 else col2
        with target_col:
            btn_label = f"{letter_badges[idx]} )   {opt_text}"
            if st.button(btn_label, key=f"ans_btn_{q_idx}_{idx}", use_container_width=True):
                process_answer(idx)

# ==============================================================================
# VISTA 4: FEEDBACK IMMEDIATO E SPIEGAZIONE DIDATTICA
# ==============================================================================
elif st.session_state.view == "feedback":
    fb = st.session_state.last_feedback
    lang = st.session_state.language
    is_game_over = (st.session_state.lives <= 0)
    is_finished = (st.session_state.current_q_idx + 1 >= 12)

    # Salvataggio automatico se la partita si chiude
    if (is_game_over or is_finished):
        tot_time = int(time.time() - st.session_state.total_start_time)
        correct_count = sum(1 for a in st.session_state.answers_log if a.get("is_correct"))
        status_msg = f"Completato ({correct_count}/12 corrette)" if is_finished and not is_game_over else "Game Over (Vite esaurite)"
        save_or_update_attempt(
            attempt_id=st.session_state.attempt_id,
            name=st.session_state.student_name,
            surname=st.session_state.student_surname,
            language=st.session_state.language,
            score=st.session_state.score,
            correct=correct_count,
            answered=st.session_state.answered_count,
            timeouts=st.session_state.timeouts_count,
            total=12,
            lives=max(0, st.session_state.lives),
            total_time=tot_time,
            completed=is_finished and not is_game_over,
            status=status_msg
        )

    if fb["correct"]:
        st.markdown(f"""
        <div style="background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; border-radius: 1.25rem; padding: 1.5rem; margin-bottom: 1.25rem;">
            <h2 style="color: #34d399; margin: 0 0 0.5rem 0;">🎉 ESATTO! +{fb['points']} punti</h2>
            <p style="color: #e2e8f0; font-size: 1.1rem; margin: 0;">
                Hai risposto correttamente al quesito.
            </p>
        </div>
        """, unsafe_allow_html=True)
    elif fb.get("timeout"):
        st.markdown(f"""
        <div style="background: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; border-radius: 1.25rem; padding: 1.5rem; margin-bottom: 1.25rem;">
            <h2 style="color: #f87171; margin: 0 0 0.5rem 0;">⏳ TEMPO SCADUTO!</h2>
            <p style="color: #e2e8f0; font-size: 1.1rem; margin: 0;">
                Hai esaurito i 120 secondi. Hai perso 1 vita (vite rimaste: {st.session_state.lives}).
                <br>La risposta corretta era: <strong>{fb['correct_ans']}</strong>
            </p>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div style="background: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; border-radius: 1.25rem; padding: 1.5rem; margin-bottom: 1.25rem;">
            <h2 style="color: #f87171; margin: 0 0 0.5rem 0;">❌ RISPOSTA NON CORRETTA!</h2>
            <p style="color: #e2e8f0; font-size: 1.1rem; margin: 0;">
                Hai perso 1 vita (vite rimaste: {st.session_state.lives}).
                <br>La risposta corretta era: <strong>{fb['correct_ans']}</strong>
            </p>
        </div>
        """, unsafe_allow_html=True)

    # Box spiegazione didattica con regola algebrica
    st.markdown(f"""
    <div class="mat-card">
        <h4 style="color: #fbbf24; margin-top: 0;">💡 Spiegazione della Regola (MAT):</h4>
        <p style="color: #f1f5f9; font-size: 1rem; line-height: 1.6; margin: 0;">
            {fb['explanation']}
        </p>
    </div>
    """, unsafe_allow_html=True)

    # Azione successiva
    if is_game_over:
        st.markdown("""
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 1rem; padding: 1rem; color: #fca5a5; margin-bottom: 1rem;">
            ⚠️ <strong>Vite esaurite (0/3).</strong> La partita si conclude qui, ma il punteggio è stato registrato per il docente.
        </div>
        """, unsafe_allow_html=True)
        if st.button("Vedi Risultato Finale (Game Over) ➔", type="primary", use_container_width=True):
            st.session_state.view = "end"
            st.rerun()
    elif is_finished:
        st.markdown("""
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 1rem; padding: 1rem; color: #6ee7b7; margin-bottom: 1rem;">
            🏆 <strong>Congratulazioni!</strong> Hai completato tutti i 12 quesiti della sfida!
        </div>
        """, unsafe_allow_html=True)
        if st.button("Guarda la Schermata di Vittoria! 🏆", type="primary", use_container_width=True):
            st.session_state.view = "end"
            st.rerun()
    else:
        if st.button("Prossimo Esercizio ➔", type="primary", use_container_width=True):
            st.session_state.current_q_idx += 1
            st.session_state.q_start_time = time.time()
            st.session_state.view = "game"
            st.rerun()

# ==============================================================================
# VISTA 5: SCHERMATA FINALE (VITTORIA O GAME OVER)
# ==============================================================================
elif st.session_state.view == "end":
    is_win = (st.session_state.lives > 0)
    correct_count = sum(1 for a in st.session_state.answers_log if a.get("is_correct"))

    if is_win:
        st.balloons()
        st.markdown(f"""
        <div class="mat-card-glow" style="text-align: center; padding: 2.5rem 1.5rem;">
            <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🏆</div>
            <span class="mat-badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.4);">
                Certificato: Mastro delle Potenze MAT 1° Anno
            </span>
            <h1 style="font-size: 2.4rem; margin: 1rem 0 0.5rem 0;">Grandioso! Missione Compiuta!</h1>
            <p style="color: #cbd5e1; font-size: 1.1rem; max-width: 600px; margin: 0 auto;">
                Complimenti <strong>{st.session_state.student_name} {st.session_state.student_surname}</strong>, hai completato con successo il percorso didattico.
            </p>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div class="mat-card" style="text-align: center; padding: 2.5rem 1.5rem; border-color: rgba(239, 68, 68, 0.4);">
            <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">💀</div>
            <span class="mat-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.4);">
                Partita Terminata - Vite Esaurite
            </span>
            <h1 style="font-size: 2.4rem; margin: 1rem 0 0.5rem 0;">Game Over</h1>
            <p style="color: #cbd5e1; font-size: 1.1rem; max-width: 600px; margin: 0 auto;">
                Hai esaurito le 3 vite, <strong>{st.session_state.student_name} {st.session_state.student_surname}</strong>. Rivedi le proprietà delle potenze e riprova!
            </p>
        </div>
        """, unsafe_allow_html=True)

    # Box Salvataggio Automatico Garantito
    st.markdown("""
    <div style="text-align: center; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 1rem; padding: 0.85rem; margin-bottom: 1.5rem; color: #6ee7b7; font-size: 0.95rem;">
        ✅ <strong>Salvataggio Automatico Completato:</strong> I tuoi risultati sono stati archiviati nel database centralizzato del docente.
    </div>
    """, unsafe_allow_html=True)

    # 4 Riquadri metriche finali
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-lbl">Punteggio Finale</div>
            <div class="metric-val">{st.session_state.score} pt</div>
        </div>
        """, unsafe_allow_html=True)
    with c2:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-lbl">Risposte Esatte</div>
            <div class="metric-val" style="color: #34d399;">{correct_count} / 12</div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-lbl">Vite Rimaste</div>
            <div class="metric-val" style="color: #f43f5e;">{st.session_state.lives} / 3</div>
        </div>
        """, unsafe_allow_html=True)
    with c4:
        tot_secs = int(time.time() - st.session_state.total_start_time)
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-lbl">Tempo Totale</div>
            <div class="metric-val" style="color: #60a5fa;">{tot_secs // 60}m {tot_secs % 60}s</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    if st.button("🔄 Gioca di Nuovo (Nuova Sfida)", type="primary", use_container_width=True):
        st.session_state.view = "login"
        st.rerun()
