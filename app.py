"""
PowerQuest MAT - Gioco Didattico sulle Potenze dei Numeri Naturali
Progettato per il 1° anno degli Istituti Professionali e Tecnici (MAT - Manutenzione e Assistenza Tecnica)

Requisiti:
    pip install streamlit pandas
Esecuzione locale:
    streamlit run app.py
"""

import streamlit as st
import random
import time
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

# --- DATABASE SQLITE PER PERSISTENZA CENTRALIZZATA ---
DB_NAME = "powers_mat.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            student_surname TEXT NOT NULL,
            language TEXT NOT NULL,
            score INTEGER NOT NULL,
            correct_answers INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            lives_remaining INTEGER NOT NULL,
            total_time_seconds INTEGER NOT NULL,
            completed BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_attempt(name, surname, language, score, correct, total, lives, total_time, completed):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        INSERT INTO attempts (
            student_name, student_surname, language, score,
            correct_answers, total_questions, lives_remaining,
            total_time_seconds, completed, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        name.strip(), surname.strip(), language, score,
        correct, total, lives, total_time, completed,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    conn.commit()
    conn.close()

def get_all_attempts():
    conn = sqlite3.connect(DB_NAME)
    df = pd.read_sql_query("SELECT * FROM attempts ORDER BY score DESC, total_time_seconds ASC", conn)
    conn.close()
    return df

init_db()

# --- PANIERE DI OLTRE 60 ESERCIZI SULLE POTENZE (BILINGUE IT/EN) ---
QUESTIONS_BANK = [
    # Calcolo valore
    {"id": 1, "text_it": "Quanto vale 2³ ?", "text_en": "What is the value of 2³ ?", "opts_it": ["6", "8", "9", "16"], "opts_en": ["6", "8", "9", "16"], "correct": 1, "exp_it": "2³ = 2 × 2 × 2 = 8. Non confondere con 2 × 3!", "exp_en": "2³ = 2 × 2 × 2 = 8."},
    {"id": 2, "text_it": "Calcola il valore di 3³ :", "text_en": "Calculate the value of 3³ :", "opts_it": ["9", "18", "27", "81"], "opts_en": ["9", "18", "27", "81"], "correct": 2, "exp_it": "3³ = 3 × 3 × 3 = 27.", "exp_en": "3³ = 3 × 3 × 3 = 27."},
    {"id": 3, "text_it": "Quanto vale 4³ ?", "text_en": "What is the value of 4³ ?", "opts_it": ["12", "16", "64", "32"], "opts_en": ["12", "16", "64", "32"], "correct": 2, "exp_it": "4³ = 4 × 4 × 4 = 64.", "exp_en": "4³ = 4 × 4 × 4 = 64."},
    {"id": 4, "text_it": "Qual è il risultato di 5³ ?", "text_en": "What is the result of 5³ ?", "opts_it": ["15", "25", "75", "125"], "opts_en": ["15", "25", "75", "125"], "correct": 3, "exp_it": "5³ = 5 × 5 × 5 = 125.", "exp_en": "5³ = 5 × 5 × 5 = 125."},
    {"id": 5, "text_it": "Calcola il valore di 2⁴ :", "text_en": "Calculate the power 2⁴ :", "opts_it": ["8", "16", "24", "32"], "opts_en": ["8", "16", "24", "32"], "correct": 1, "exp_it": "2⁴ = 2 × 2 × 2 × 2 = 16.", "exp_en": "2⁴ = 2 × 2 × 2 × 2 = 16."},
    {"id": 6, "text_it": "A quanto corrisponde 2⁵ ?", "text_en": "What does 2⁵ equal?", "opts_it": ["10", "25", "32", "64"], "opts_en": ["10", "25", "32", "64"], "correct": 2, "exp_it": "2⁵ = 32.", "exp_en": "2⁵ = 32."},
    {"id": 7, "text_it": "Calcola 2⁶ (frequente nei sistemi elettronici) :", "text_en": "Calculate 2⁶ (common in digital tech):", "opts_it": ["12", "36", "48", "64"], "opts_en": ["12", "36", "48", "64"], "correct": 3, "exp_it": "2⁶ = 64.", "exp_en": "2⁶ = 64."},
    {"id": 8, "text_it": "Quanto fa 3⁴ ?", "text_en": "What is 3⁴ ?", "opts_it": ["12", "27", "81", "243"], "opts_en": ["12", "27", "81", "243"], "correct": 2, "exp_it": "3⁴ = 3 × 3 × 3 × 3 = 81.", "exp_en": "3⁴ = 81."},
    {"id": 9, "text_it": "Calcola il quadrato di 6 (6²) :", "text_en": "Calculate the square of 6 (6²) :", "opts_it": ["12", "36", "66", "30"], "opts_en": ["12", "36", "66", "30"], "correct": 1, "exp_it": "6² = 6 × 6 = 36.", "exp_en": "6² = 36."},
    {"id": 10, "text_it": "Qual è il valore di 7² ?", "text_en": "What is 7² ?", "opts_it": ["14", "42", "49", "56"], "opts_en": ["14", "42", "49", "56"], "correct": 2, "exp_it": "7² = 7 × 7 = 49.", "exp_en": "7² = 49."},
    {"id": 11, "text_it": "A quanto corrisponde 8² ?", "text_en": "What does 8² equal?", "opts_it": ["16", "64", "72", "80"], "opts_en": ["16", "64", "72", "80"], "correct": 1, "exp_it": "8² = 64.", "exp_en": "8² = 64."},
    {"id": 12, "text_it": "Quanto vale 9² ?", "text_en": "What is the square of 9 (9²) ?", "opts_it": ["18", "72", "81", "90"], "opts_en": ["18", "72", "81", "90"], "correct": 2, "exp_it": "9² = 9 × 9 = 81.", "exp_en": "9² = 81."},
    {"id": 13, "text_it": "Calcola il valore di 11² :", "text_en": "Calculate the value of 11² :", "opts_it": ["22", "110", "121", "132"], "opts_en": ["22", "110", "121", "132"], "correct": 2, "exp_it": "11 × 11 = 121.", "exp_en": "11 × 11 = 121."},
    {"id": 14, "text_it": "Quanto misura 12² (calcoli d'officina) ?", "text_en": "What is 12² ?", "opts_it": ["24", "120", "144", "164"], "opts_en": ["24", "120", "144", "164"], "correct": 2, "exp_it": "12² = 144.", "exp_en": "12² = 144."},
    {"id": 15, "text_it": "Qual è il valore di 10³ ?", "text_en": "What is the value of 10³ ?", "opts_it": ["30", "100", "1000", "10000"], "opts_en": ["30", "100", "1000", "10000"], "correct": 2, "exp_it": "10³ = 1000 (prefisso kilo).", "exp_en": "10³ = 1000 (prefix kilo)."},

    # Base ed esponente
    {"id": 16, "text_it": "Nella scrittura 7⁴, qual è la BASE ?", "text_en": "In the expression 7⁴, which is the BASE ?", "opts_it": ["4", "7", "28", "11"], "opts_en": ["4", "7", "28", "11"], "correct": 1, "exp_it": "In aⁿ, 'a' è la base (7) e 'n' è l'esponente (4).", "exp_en": "In aⁿ, 7 is the base and 4 is exponent."},
    {"id": 17, "text_it": "Nella potenza 5⁸, qual è l'ESPONENTE ?", "text_en": "In 5⁸, which is the EXPONENT ?", "opts_it": ["5", "8", "40", "13"], "opts_en": ["5", "8", "40", "13"], "correct": 1, "exp_it": "L'esponente è il numero in alto: 8.", "exp_en": "The exponent is 8."},
    {"id": 18, "text_it": "Trova l'esponente: 2ˣ = 16. Quanto vale x ?", "text_en": "Find x: 2ˣ = 16. What is x ?", "opts_it": ["x = 3", "x = 4", "x = 8", "x = 5"], "opts_en": ["x = 3", "x = 4", "x = 8", "x = 5"], "correct": 1, "exp_it": "2⁴ = 16, quindi x = 4.", "exp_en": "2⁴ = 16, so x = 4."},
    {"id": 19, "text_it": "Trova il valore di x: 3ˣ = 81 :", "text_en": "Find x: 3ˣ = 81 :", "opts_it": ["x = 3", "x = 4", "x = 27", "x = 5"], "opts_en": ["x = 3", "x = 4", "x = 27", "x = 5"], "correct": 1, "exp_it": "3⁴ = 81, quindi x = 4.", "exp_en": "3⁴ = 81, so x = 4."},
    {"id": 20, "text_it": "Quale base elevata alla terza dà 27 (x³ = 27) ?", "text_en": "What base cubed gives 27 (x³ = 27) ?", "opts_it": ["x = 9", "x = 3", "x = 2", "x = 6"], "opts_en": ["x = 9", "x = 3", "x = 2", "x = 6"], "correct": 1, "exp_it": "3³ = 27, quindi x = 3.", "exp_en": "3³ = 27, so x = 3."},
    {"id": 21, "text_it": "Trova la base naturale x: x² = 100 :", "text_en": "Find the base x: x² = 100 :", "opts_it": ["x = 50", "x = 10", "x = 20", "x = 5"], "opts_en": ["x = 50", "x = 10", "x = 20", "x = 5"], "correct": 1, "exp_it": "10² = 100, quindi x = 10.", "exp_en": "10² = 100, so x = 10."},
    {"id": 22, "text_it": "Come si scrive come potenza: 4 × 4 × 4 × 4 × 4 ?", "text_en": "How is 4 × 4 × 4 × 4 × 4 written as a power?", "opts_it": ["4 × 5", "5⁴", "4⁵", "20"], "opts_en": ["4 × 5", "5⁴", "4⁵", "20"], "correct": 2, "exp_it": "Base 4 moltiplicata per 5 volte = 4⁵.", "exp_en": "Base 4 repeated 5 times = 4⁵."},
    {"id": 23, "text_it": "Nell'espressione 2ˣ = 64, quanto vale x ?", "text_en": "In 2ˣ = 64, what is x ?", "opts_it": ["x = 5", "x = 6", "x = 7", "x = 8"], "opts_en": ["x = 5", "x = 6", "x = 7", "x = 8"], "correct": 1, "exp_it": "2⁶ = 64, quindi x = 6.", "exp_en": "2⁶ = 64, so x = 6."},
    {"id": 24, "text_it": "Trova x in: 10ˣ = 10.000 :", "text_en": "Find x in: 10ˣ = 10,000 :", "opts_it": ["x = 3", "x = 4", "x = 5", "x = 40"], "opts_en": ["x = 3", "x = 4", "x = 5", "x = 40"], "correct": 1, "exp_it": "4 zeri dopo l'uno: 10⁴ = 10.000.", "exp_en": "4 zeros: 10⁴ = 10,000."},

    # Proprietà: Prodotto stessa base
    {"id": 25, "text_it": "Applica la proprietà: 2³ × 2⁴ = ?", "text_en": "Apply power rule: 2³ × 2⁴ = ?", "opts_it": ["2¹²", "4⁷", "2⁷", "4¹²"], "opts_en": ["2¹²", "4⁷", "2⁷", "4¹²"], "correct": 2, "exp_it": "Stessa base: si sommano gli esponenti (3+4=7) -> 2⁷.", "exp_en": "Same base: add exponents (3+4=7) -> 2⁷."},
    {"id": 26, "text_it": "Semplifica: 5² × 5⁵ =", "text_en": "Simplify: 5² × 5⁵ =", "opts_it": ["5¹⁰", "5⁷", "25⁷", "10⁷"], "opts_en": ["5¹⁰", "5⁷", "25⁷", "10⁷"], "correct": 1, "exp_it": "2 + 5 = 7 -> 5⁷.", "exp_en": "2 + 5 = 7 -> 5⁷."},
    {"id": 27, "text_it": "Calcola: 3⁴ × 3² × 3 =", "text_en": "Calculate: 3⁴ × 3² × 3 =", "opts_it": ["3⁶", "3⁷", "3⁸", "27⁷"], "opts_en": ["3⁶", "3⁷", "3⁸", "27⁷"], "correct": 1, "exp_it": "Ricorda 3 = 3¹. Esponenti: 4 + 2 + 1 = 7 -> 3⁷.", "exp_en": "3 = 3¹. Exponents: 4 + 2 + 1 = 7 -> 3⁷."},
    {"id": 28, "text_it": "Risultato di 7³ × 7⁶ :", "text_en": "Result of 7³ × 7⁶ :", "opts_it": ["7¹⁸", "7⁹", "49⁹", "14⁹"], "opts_en": ["7¹⁸", "7⁹", "49⁹", "14⁹"], "correct": 1, "exp_it": "3 + 6 = 9 -> 7⁹.", "exp_en": "3 + 6 = 9 -> 7⁹."},
    {"id": 29, "text_it": "Calcolo MAT: 10² × 10³ equivale a :", "text_en": "Tech calculation: 10² × 10³ equals:", "opts_it": ["10⁶", "10⁵", "100⁵", "20⁵"], "opts_en": ["10⁶", "10⁵", "100⁵", "20⁵"], "correct": 1, "exp_it": "10²⁺³ = 10⁵ = 100.000.", "exp_en": "10²⁺³ = 10⁵ = 100,000."},
    {"id": 30, "text_it": "Qual è la formula del prodotto con stessa base ?", "text_en": "Formula for product of powers with same base?", "opts_it": ["aᵐ × aⁿ = aᵐ·ⁿ", "aᵐ × aⁿ = aᵐ⁺ⁿ", "aᵐ × aⁿ = (2a)ᵐ⁺ⁿ", "aᵐ × aⁿ = aᵐ⁻ⁿ"], "opts_en": ["aᵐ × aⁿ = aᵐ·ⁿ", "aᵐ × aⁿ = aᵐ⁺ⁿ", "aᵐ × aⁿ = (2a)ᵐ⁺ⁿ", "aᵐ × aⁿ = aᵐ⁻ⁿ"], "correct": 1, "exp_it": "La regola è: aᵐ × aⁿ = aᵐ⁺ⁿ.", "exp_en": "The rule is: aᵐ × aⁿ = aᵐ⁺ⁿ."},
    {"id": 31, "text_it": "Applica proprietà a: 4⁵ × 4⁰ =", "text_en": "Apply properties to: 4⁵ × 4⁰ =", "opts_it": ["0", "4⁰", "4⁵", "1"], "opts_en": ["0", "4⁰", "4⁵", "1"], "correct": 2, "exp_it": "5 + 0 = 5 -> 4⁵.", "exp_en": "5 + 0 = 5 -> 4⁵."},
    {"id": 32, "text_it": "A quanto corrisponde 6 × 6⁴ ?", "text_en": "What does 6 × 6⁴ equal?", "opts_it": ["6⁴", "6⁵", "36⁴", "6⁶"], "opts_en": ["6⁴", "6⁵", "36⁴", "6⁶"], "correct": 1, "exp_it": "6¹ × 6⁴ = 6⁵.", "exp_en": "6¹ × 6⁴ = 6⁵."},

    # Proprietà: Quoziente stessa base
    {"id": 33, "text_it": "Calcola: 2⁷ : 2³ =", "text_en": "Calculate: 2⁷ : 2³ =", "opts_it": ["2⁴", "2¹⁰", "1⁴", "2²¹"], "opts_en": ["2⁴", "2¹⁰", "1⁴", "2²¹"], "correct": 0, "exp_it": "Quoziente stessa base: si sottraggono (7-3=4) -> 2⁴.", "exp_en": "Subtract exponents (7-3=4) -> 2⁴."},
    {"id": 34, "text_it": "Semplifica: 5⁸ : 5² =", "text_en": "Simplify: 5⁸ : 5² =", "opts_it": ["5⁴", "5⁶", "5¹⁰", "1⁶"], "opts_en": ["5⁴", "5⁶", "5¹⁰", "1⁶"], "correct": 1, "exp_it": "8 - 2 = 6 -> 5⁶.", "exp_en": "8 - 2 = 6 -> 5⁶."},
    {"id": 35, "text_it": "Quanto vale 3⁹ : 3⁶ ?", "text_en": "What is 3⁹ : 3⁶ ?", "opts_it": ["3³ (= 27)", "3¹⁵", "1³ (= 1)", "3¹.⁵"], "opts_en": ["3³ (= 27)", "3¹⁵", "1³ (= 1)", "3¹.⁵"], "correct": 0, "exp_it": "3⁹⁻⁶ = 3³ = 27.", "exp_en": "3⁹⁻⁶ = 3³ = 27."},
    {"id": 36, "text_it": "In officina MAT: 10⁶ : 10² =", "text_en": "Workshop calculation: 10⁶ : 10² =", "opts_it": ["10³", "10⁴", "10⁸", "10¹²"], "opts_en": ["10³", "10⁴", "10⁸", "10¹²"], "correct": 1, "exp_it": "10⁶⁻² = 10⁴ = 10.000.", "exp_en": "10⁶⁻² = 10⁴ = 10,000."},
    {"id": 37, "text_it": "Quanto fa 7⁵ : 7⁴ ?", "text_en": "What is 7⁵ : 7⁴ ?", "opts_it": ["7¹ = 7", "7⁹", "1", "49"], "opts_en": ["7¹ = 7", "7⁹", "1", "49"], "correct": 0, "exp_it": "7⁵⁻⁴ = 7¹ = 7.", "exp_en": "7⁵⁻⁴ = 7¹ = 7."},
    {"id": 38, "text_it": "Calcola: 4⁶ : 4⁶ =", "text_en": "Calculate: 4⁶ : 4⁶ =", "opts_it": ["4¹²", "0", "4⁰ = 1", "4"], "opts_en": ["4¹²", "0", "4⁰ = 1", "4"], "correct": 2, "exp_it": "4⁶⁻⁶ = 4⁰ = 1.", "exp_en": "4⁶⁻⁶ = 4⁰ = 1."},
    {"id": 39, "text_it": "Riduci a una potenza: 8¹⁰ : 8⁷ =", "text_en": "Reduce: 8¹⁰ : 8⁷ =", "opts_it": ["8³", "8¹⁷", "1³", "8⁷⁰"], "opts_en": ["8³", "8¹⁷", "1³", "8⁷⁰"], "correct": 0, "exp_it": "8¹⁰⁻⁷ = 8³.", "exp_en": "8¹⁰⁻⁷ = 8³."},

    # Proprietà: Potenza di potenza
    {"id": 40, "text_it": "Applica: (2³)² =", "text_en": "Apply: (2³)² =", "opts_it": ["2⁵", "2⁶", "2⁹", "4⁶"], "opts_en": ["2⁵", "2⁶", "2⁹", "4⁶"], "correct": 1, "exp_it": "Potenza di potenza: si moltiplicano gli esponenti (3×2=6) -> 2⁶.", "exp_en": "Multiply exponents (3×2=6) -> 2⁶."},
    {"id": 41, "text_it": "Semplifica: (3²)⁴ =", "text_en": "Simplify: (3²)⁴ =", "opts_it": ["3⁶", "3⁸", "3¹⁶", "9⁸"], "opts_en": ["3⁶", "3⁸", "3¹⁶", "9⁸"], "correct": 1, "exp_it": "2 × 4 = 8 -> 3⁸.", "exp_en": "2 × 4 = 8 -> 3⁸."},
    {"id": 42, "text_it": "Calcola: [ (5²)³ ]² =", "text_en": "Calculate: [ (5²)³ ]² =", "opts_it": ["5⁷", "5¹²", "5¹⁸", "25¹²"], "opts_en": ["5⁷", "5¹²', "5¹⁸", "25¹²"], "correct": 1, "exp_it": "2 × 3 × 2 = 12 -> 5¹².", "exp_en": "2 × 3 × 2 = 12 -> 5¹²."},
    {"id": 43, "text_it": "Ordini di grandezza: (10³)² =", "text_en": "Orders of magnitude: (10³)² =", "opts_it": ["10⁵", "10⁶", "10⁹", "100⁶"], "opts_en": ["10⁵", "10⁶", "10⁹", "100⁶"], "correct": 1, "exp_it": "10³·² = 10⁶ (da kilo a mega).", "exp_en": "10³·² = 10⁶."},
    {"id": 44, "text_it": "Quanto vale (7⁴)⁰ ?", "text_en": "What is (7⁴)⁰ ?", "opts_it": ["0", "7", "1", "7⁴"], "opts_en": ["0", "7", "1", "7⁴"], "correct": 2, "exp_it": "7⁴·⁰ = 7⁰ = 1.", "exp_en": "7⁴·⁰ = 7⁰ = 1."},

    # Proprietà: Stesso esponente
    {"id": 45, "text_it": "Calcola: 2³ × 5³ =", "text_en": "Calculate: 2³ × 5³ =", "opts_it": ["10³ (= 1000)", "10⁶", "7³", "7⁶"], "opts_en": ["10³ (= 1000)", "10⁶", "7³", "7⁶"], "correct": 0, "exp_it": "Stesso esponente: si moltiplicano le basi (2×5)³ = 10³ = 1000.", "exp_en": "Multiply bases: (2×5)³ = 10³ = 1000."},
    {"id": 46, "text_it": "Esprimi come unica potenza: 3² × 4² =", "text_en": "Express as single power: 3² × 4² =", "opts_it": ["12⁴", "7²", "12²", "7⁴"], "opts_en": ["12⁴", "7²", "12²", "7⁴"], "correct": 2, "exp_it": "(3 × 4)² = 12².", "exp_en": "(3 × 4)² = 12²."},
    {"id": 47, "text_it": "Calcola: 12⁴ : 3⁴ =", "text_en": "Calculate: 12⁴ : 3⁴ =", "opts_it": ["4⁴", "9⁴", "4⁰", "4¹"], "opts_en": ["4⁴", "9⁴", "4⁰", "4¹"], "correct": 0, "exp_it": "(12 : 3)⁴ = 4⁴.", "exp_en": "(12 : 3)⁴ = 4⁴."},
    {"id": 48, "text_it": "Semplifica: 20³ : 5³ =", "text_en": "Simplify: 20³ : 5³ =", "opts_it": ["15³", "4³", "4¹", "4⁶"], "opts_en": ["15³", "4³", "4¹", "4⁶"], "correct": 1, "exp_it": "(20 : 5)³ = 4³ = 64.", "exp_en": "(20 : 5)³ = 4³ = 64."},
    {"id": 49, "text_it": "Riscrivi: 2⁵ × 3⁵ =", "text_en": "Rewrite: 2⁵ × 3⁵ =", "opts_it": ["6¹⁰", "5⁵", "6⁵", "5¹⁰"], "opts_en": ["6¹⁰", "5⁵", "6⁵", "5¹⁰"], "correct": 2, "exp_it": "(2 × 3)⁵ = 6⁵.", "exp_en": "(2 × 3)⁵ = 6⁵."},

    # Casi particolari (0 e 1)
    {"id": 50, "text_it": "Qual è il valore di 8⁰ ?", "text_en": "What is the value of 8⁰ ?", "opts_it": ["0", "1", "8", "Impossibile"], "opts_en": ["0", "1", "8", "Impossible"], "correct": 1, "exp_it": "Ogni numero diverso da zero elevato a zero vale 1 (a⁰ = 1).", "exp_en": "Any non-zero number to power 0 is 1."},
    {"id": 51, "text_it": "Quanto vale 1²⁰²⁶ ?", "text_en": "What is 1²⁰²⁶ ?", "opts_it": ["2026", "1", "0", "2026!"], "opts_en": ["2026", "1", "0", "2026!"], "correct": 1, "exp_it": "1 moltiplicato per se stesso qualsiasi numero di volte vale sempre 1.", "exp_en": "1 to any power is always 1."},
    {"id": 52, "text_it": "A quanto corrisponde 0⁵ ?", "text_en": "What does 0⁵ equal?", "opts_it": ["0", "1", "5", "Non esiste"], "opts_en": ["0", "1", "5", "Does not exist"], "correct": 0, "exp_it": "0 elevato a esponente positivo fa 0.", "exp_en": "0 to any positive power is 0."},
    {"id": 53, "text_it": "Cosa si dice di 0⁰ nei numeri naturali ?", "text_en": "What is 0⁰ in natural numbers?", "opts_it": ["Vale 0", "Vale 1", "Non ha significato (indeterminata)", "Vale infinito"], "opts_en": ["Equals 0", "Equals 1", "Has no meaning (indeterminate)", "Infinity"], "correct": 2, "exp_it": "0⁰ è una forma priva di significato.", "exp_en": "0⁰ is indeterminate."},
    {"id": 54, "text_it": "Quanto vale 15¹ ?", "text_en": "What is 15¹ ?", "opts_it": ["1", "0", "15", "150"], "opts_en": ["1", "0", "15", "150"], "correct": 2, "exp_it": "a¹ = a. Quindi 15¹ = 15.", "exp_en": "a¹ = a. Therefore 15¹ = 15."},
    {"id": 55, "text_it": "Calcola: 100⁰ + 1¹⁰⁰ =", "text_en": "Calculate: 100⁰ + 1¹⁰⁰ =", "opts_it": ["101", "2", "1", "200"], "opts_en": ["101", "2", "1", "200"], "correct": 1, "exp_it": "1 + 1 = 2.", "exp_en": "1 + 1 = 2."},

    # Potenze di 10 e unità MAT
    {"id": 56, "text_it": "Nel settore MAT, a cosa corrisponde 10⁶ (Mega) ?", "text_en": "In technical MAT, what does 10⁶ (Mega) represent?", "opts_it": ["1.000", "10.000", "100.000", "1.000.000 (un milione)"], "opts_en": ["1,000", "10,000", "100,000", "1,000,000 (one million)"], "correct": 3, "exp_it": "10⁶ = 1.000.000.", "exp_en": "10⁶ = 1,000,000."},
    {"id": 57, "text_it": "Un motore eroga 5 kW (kilowatt). Quanti Watt sono con potenze di 10 ?", "text_en": "A motor delivers 5 kW. How many Watts using powers of 10?", "opts_it": ["5 × 10² W", "5 × 10³ W", "5 × 10⁴ W", "5 × 10⁶ W"], "opts_en": ["5 × 10² W", "5 × 10³ W", "5 × 10⁴ W", "5 × 10⁶ W"], "correct": 1, "exp_it": "kilo = 10³, quindi 5 × 10³ W.", "exp_en": "kilo = 10³, so 5 × 10³ W."},
    {"id": 58, "text_it": "Quanti zeri ha dopo l'1 il numero 10⁷ ?", "text_en": "How many zeros in 10⁷ ?", "opts_it": ["6 zeri", "7 zeri", "8 zeri", "10 zeri"], "opts_en": ["6 zeros", "7 zeros", "8 zeros", "10 zeros"], "correct": 1, "exp_it": "10ⁿ ha esattamente n zeri, quindi 7 zeri.", "exp_en": "10ⁿ has n zeros, so 7 zeros."},
    {"id": 59, "text_it": "Un tornio gira a 3 × 10⁴ giri/min. A quale numero intero corrisponde ?", "text_en": "A lathe rotates at 3 × 10⁴ rpm. What number is this?", "opts_it": ["300", "3.000", "30.000", "300.000"], "opts_en": ["300", "3,000", "30,000", "300,000"], "correct": 2, "exp_it": "3 × 10.000 = 30.000.", "exp_en": "3 × 10,000 = 30,000."},

    # Errori tipici
    {"id": 60, "text_it": "Quale affermazione è FALSA ?", "text_en": "Which statement is FALSE ?", "opts_it": ["2³ = 8", "2³ = 2 × 3 = 6", "3² = 9", "4² = 16"], "opts_en": ["2³ = 8", "2³ = 2 × 3 = 6", "3² = 9", "4² = 16"], "correct": 1, "exp_it": "Errore grave! 2³ = 2×2×2 = 8, non 6!", "exp_en": "2³ is 8, not 6!"},
    {"id": 61, "text_it": "Attenzione alla somma: 2³ + 2² =", "text_en": "Watch addition: 2³ + 2² =", "opts_it": ["2⁵ = 32", "12", "4⁵ = 1024", "10"], "opts_en": ["2⁵ = 32", "12", "4⁵ = 1024", "10"], "correct": 1, "exp_it": "Le proprietà valgono per il PRODOTTO, non per la somma! 8 + 4 = 12.", "exp_en": "Exponent rules are for multiplication, not addition: 8 + 4 = 12."},
    {"id": 62, "text_it": "Quale confronto è CORRETTO ?", "text_en": "Which comparison is CORRECT ?", "opts_it": ["5⁰ > 5¹", "5⁰ = 0", "5¹ > 5⁰", "5⁰ = 5"], "opts_en": ["5⁰ > 5¹", "5⁰ = 0", "5¹ > 5⁰", "5⁰ = 5"], "correct": 2, "exp_it": "5¹ = 5 e 5⁰ = 1. Quindi 5¹ > 5⁰.", "exp_en": "5¹ = 5 and 5⁰ = 1, so 5¹ > 5⁰."}
]

# --- INIZIALIZZAZIONE SESSION STATE ---
if "view" not in st.session_state:
    st.session_state.view = "login"  # login, game, feedback, end
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
if "q_start_time" not in st.session_state:
    st.session_state.q_start_time = 0
if "total_start_time" not in st.session_state:
    st.session_state.total_start_time = 0
if "last_feedback" not in st.session_state:
    st.session_state.last_feedback = None

# --- SIDEBAR: ACCESSO DOCENTE E INFO ---
st.sidebar.title("⚡ PowerQuest MAT")
st.sidebar.markdown("**Istituto Professionale / Tecnico MAT**  \n*Classe 1ª - Potenze nei Numeri Naturali*")

st.sidebar.markdown("---")
st.sidebar.subheader("🔒 Area Riservata Docente")
admin_pass = st.sidebar.text_input("Password Amministratore", type="password", key="sidebar_pass")
is_teacher = admin_pass == "DocenteMAT2026"

if admin_pass and not is_teacher:
    st.sidebar.error("Password non valida!")
elif is_teacher:
    st.sidebar.success("Accesso Docente Verificato ✅")

show_teacher_dash = st.sidebar.checkbox("Visualizza Dashboard Docente", value=False) if is_teacher else False

# --- LOGICA DEL GIOCO E VISTE ---

def start_new_game():
    st.session_state.game_questions = random.sample(QUESTIONS_BANK, 12)
    st.session_state.current_q_idx = 0
    st.session_state.lives = 3
    st.session_state.score = 0
    st.session_state.total_start_time = time.time()
    st.session_state.q_start_time = time.time()
    st.session_state.last_feedback = None
    st.session_state.view = "game"

# --- VISTA 1: DASHBOARD DOCENTE ---
if show_teacher_dash:
    st.title("📊 Dashboard e Registro Docente MAT")
    st.info("I dati degli studenti vengono salvati automaticamente al termine della partita o al Game Over.")
    
    df = get_all_attempts()
    
    if df.empty:
        st.warning("Nessun tentativo registrato finora.")
    else:
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Tentativi Totali", len(df))
        col2.metric("Studenti Unici", df['student_surname'].nunique())
        col3.metric("Punteggio Medio", round(df['score'].mean(), 1))
        col4.metric("Miglior Punteggio", int(df['score'].max()))
        
        st.subheader("🏆 Classifica Generale (Leaderboard)")
        leaderboard_df = df.copy()
        leaderboard_df['Studente'] = leaderboard_df['student_name'] + " " + leaderboard_df['student_surname']
        leaderboard_df['Esito'] = leaderboard_df['completed'].apply(lambda x: "Completato ✅" if x else "Vite Finite ❌")
        
        display_df = leaderboard_df[['Studente', 'score', 'correct_answers', 'total_time_seconds', 'Esito', 'created_at']]
        display_df.columns = ['Alunno', 'Punteggio', 'Corrette (su 12)', 'Tempo (s)', 'Esito', 'Data / Ora']
        st.dataframe(display_df.reset_index(drop=True), use_container_width=True)
        
        # Download CSV per comodità del docente
        csv_data = df.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="📥 Scarica Registro Completo (CSV)",
            data=csv_data,
            file_name=f"registro_potenze_mat_{datetime.now().strftime('%Y%m%d')}.csv",
            mime="text/csv"
        )
        
        if st.button("⚠️ Cancella Tutto il Database"):
            conn = sqlite3.connect(DB_NAME)
            c = conn.cursor()
            c.execute("DELETE FROM attempts")
            conn.commit()
            conn.close()
            st.success("Database azzerato.")
            st.rerun()

# --- VISTA 2: LOGIN STUDENTE ---
elif st.session_state.view == "login":
    st.title("⚡ PowerQuest MAT: Sfida sulle Potenze")
    st.markdown("Benvenuto nella piattaforma di allenamento e verifica per gli studenti del **1° anno MAT**.")
    
    col_form, col_rules = st.columns([1, 1])
    
    with col_form:
        st.subheader("📝 Accesso Studente")
        name = st.text_input("Nome", value=st.session_state.student_name, placeholder="Es. Marco")
        surname = st.text_input("Cognome", value=st.session_state.student_surname, placeholder="Es. Rossi")
        lang = st.selectbox("Lingua / Language", ["Italiano", "English"], index=0 if st.session_state.language == "it" else 1)
        
        if st.button("🚀 Inizia la Partita", type="primary", use_container_width=True):
            if not name.strip() or not surname.strip():
                st.error("Inserisci sia il Nome che il Cognome per iniziare!")
            else:
                st.session_state.student_name = name
                st.session_state.student_surname = surname
                st.session_state.language = "it" if lang == "Italiano" else "en"
                start_new_game()
                st.rerun()
                
    with col_rules:
        st.subheader("📜 Regole della Partita")
        st.markdown("""
        - 🎲 **12 Esercizi** estratti casualmente dal paniere delle potenze.
        - ⏳ **2 Minuti (120 secondi)** per ciascuna domanda.
        - ❤️ **3 Vite iniziali**: ogni errore o tempo scaduto fa perdere 1 vita.
        - ⚡ **Bonus Velocità**: più in fretta rispondi, più punti ottieni!
        - 💾 **Salvataggio Automatico**: il tuo punteggio viene registrato nel sistema per il docente.
        """)

# --- VISTA 3: GIOCO ATTIVO ---
elif st.session_state.view == "game":
    lang = st.session_state.language
    q_idx = st.session_state.current_q_idx
    q = st.session_state.game_questions[q_idx]
    
    # Calcolo tempo trascorso sulla domanda corrente (max 120s)
    elapsed_q = int(time.time() - st.session_state.q_start_time)
    remaining_q = max(0, 120 - elapsed_q)
    
    # Barra superiore: vite, progresso, punteggio, timer
    top_col1, top_col2, top_col3, top_col4 = st.columns([1, 1, 1, 1])
    top_col1.markdown(f"**Alunno:** {st.session_state.student_name} {st.session_state.student_surname}")
    top_col2.markdown(f"**Domanda:** {q_idx + 1} / 12")
    top_col3.markdown(f"**Vite:** {'❤️' * st.session_state.lives}{'🖤' * (3 - st.session_state.lives)}")
    top_col4.markdown(f"**Punti:** {st.session_state.score}")
    
    # Barra timer
    progress = max(0.0, min(1.0, remaining_q / 120.0))
    st.progress(progress)
    st.caption(f"⏳ Tempo rimasto: **{remaining_q} secondi** (su 120s)")
    
    # Verifica scadenza timer
    if remaining_q <= 0:
        st.session_state.lives -= 1
        st.session_state.last_feedback = {
            "correct": False,
            "timeout": True,
            "explanation": q["exp_it"] if lang == "it" else q["exp_en"],
            "correct_ans": (q["opts_it"] if lang == "it" else q["opts_en"])[q["correct"]]
        }
        st.session_state.view = "feedback"
        st.rerun()
    
    # Domanda corrente
    st.markdown("---")
    q_text = q["text_it"] if lang == "it" else q["text_en"]
    opts = q["opts_it"] if lang == "it" else q["opts_en"]
    
    st.subheader(f"Esercizio {q_idx + 1}: {q_text}")
    
    selected_opt = st.radio("Seleziona la tua risposta:", opts, index=None, key=f"q_{q_idx}_{time.time()}")
    
    if st.button("Invia Risposta ➔", type="primary"):
        if selected_opt is None:
            st.warning("Seleziona un'opzione prima di inviare!")
        else:
            opt_idx = opts.index(selected_opt)
            is_correct = opt_idx == q["correct"]
            
            if is_correct:
                points = 100 + remaining_q  # 100 base + 1 pt per ogni secondo risparmiato
                st.session_state.score += points
                st.session_state.last_feedback = {
                    "correct": True,
                    "timeout": False,
                    "points": points,
                    "explanation": q["exp_it"] if lang == "it" else q["exp_en"]
                }
            else:
                st.session_state.lives -= 1
                st.session_state.last_feedback = {
                    "correct": False,
                    "timeout": False,
                    "explanation": q["exp_it"] if lang == "it" else q["exp_en"],
                    "correct_ans": opts[q["correct"]]
                }
            st.session_state.view = "feedback"
            st.rerun()

# --- VISTA 4: FEEDBACK IMMEDIATO DOPO RISPOSTA ---
elif st.session_state.view == "feedback":
    fb = st.session_state.last_feedback
    lang = st.session_state.language
    
    if fb["correct"]:
        st.success(f"🎉 **RISPOSTA ESATTA!** (+{fb['points']} punti)")
    elif fb.get("timeout"):
        st.error(f"⏳ **TEMPO SCADUTO!** Hai perso 1 vita. Risposta corretta: **{fb['correct_ans']}**")
    else:
        st.error(f"❌ **RISPOSTA ERRATA!** Hai perso 1 vita. Risposta corretta: **{fb['correct_ans']}**")
        
    st.info(f"💡 **Spiegazione didattica:** {fb['explanation']}")
    
    # Verifica vite o fine gioco
    if st.session_state.lives <= 0:
        if st.button("Guarda il Risultato Finale (Game Over) ➔", type="primary"):
            # Salvataggio automatico
            total_time = int(time.time() - st.session_state.total_start_time)
            save_attempt(
                st.session_state.student_name,
                st.session_state.student_surname,
                st.session_state.language,
                st.session_state.score,
                st.session_state.current_q_idx,  # quante ne ha superate
                12,
                0,
                total_time,
                False
            )
            st.session_state.view = "end"
            st.rerun()
    elif st.session_state.current_q_idx + 1 >= 12:
        if st.button("Vedi la Schermata Finale di Vittoria! 🏆", type="primary"):
            total_time = int(time.time() - st.session_state.total_start_time)
            save_attempt(
                st.session_state.student_name,
                st.session_state.student_surname,
                st.session_state.language,
                st.session_state.score,
                12,
                12,
                st.session_state.lives,
                total_time,
                True
            )
            st.session_state.view = "end"
            st.rerun()
    else:
        if st.button("Prossima Domanda ➔", type="primary"):
            st.session_state.current_q_idx += 1
            st.session_state.q_start_time = time.time()
            st.session_state.view = "game"
            st.rerun()

# --- VISTA 5: SCHERMATA FINALE (VITTORIA O GAME OVER) ---
elif st.session_state.view == "end":
    if st.session_state.lives > 0:
        st.balloons()
        st.title("🏆 Grandioso! Missione Compiuta!")
        st.markdown(f"Complimenti **{st.session_state.student_name} {st.session_state.student_surname}**! Hai completato la sfida sulle potenze per il 1° anno MAT.")
    else:
        st.title("💀 Game Over - Vite Esaurite")
        st.markdown(f"Partita terminata per **{st.session_state.student_name} {st.session_state.student_surname}**.")
        
    st.success("✅ Il tuo punteggio è stato salvato automaticamente nel database del docente.")
    
    col1, col2, col3 = st.columns(3)
    col1.metric("Punteggio Finale", st.session_state.score)
    col2.metric("Esercizi Raggiunti", f"{st.session_state.current_q_idx + (1 if st.session_state.lives > 0 else 0)} / 12")
    col3.metric("Vite Rimaste", f"{st.session_state.lives} / 3")
    
    st.markdown("---")
    if st.button("🔄 Gioca di Nuovo", type="primary"):
        st.session_state.view = "login"
        st.rerun()
