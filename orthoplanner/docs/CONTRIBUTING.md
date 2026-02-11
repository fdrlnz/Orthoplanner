# Come Contribuire a OrthoPlanner

Grazie per il tuo interesse nel contribuire a OrthoPlanner! 🎉

## 🚀 Setup Sviluppo

1. Fai fork del repository su GitHub
2. Clona il tuo fork: `git clone https://github.com/TUO_USERNAME/orthoplanner.git`
3. Installa le dipendenze: `npm install`
4. Crea un branch: `git checkout -b feature/nome-feature`
5. Sviluppa e testa le modifiche: `npm run dev`
6. Committa: `git commit -m "Descrizione della modifica"`
7. Pusha: `git push origin feature/nome-feature`
8. Apri una Pull Request su GitHub

## 📐 Standard di Codice

- **TypeScript strict mode** — nessun `any` senza giustificazione
- **React functional components** con hooks
- **Nomi in inglese** per codice e commenti
- **Commenti in italiano** sono accettati per spiegazioni cliniche

## 🧩 Creare un Plugin

Vedi la documentazione della Plugin API in `src/core/plugin-api/index.ts`.

Ogni plugin deve:
1. Implementare l'interfaccia `OrthoPlugin`
2. Avere un `manifest` con id, nome, versione, autore
3. Essere in una cartella dentro `src/plugins/`

## 📋 Code of Conduct

Trattiamo tutti con rispetto. Nessuna discriminazione, nessun comportamento tossico.
Siamo qui per costruire qualcosa di utile per i pazienti e i chirurghi.

## 📄 Licenza

Contribuendo accetti che il tuo codice sia distribuito con licenza Apache 2.0.
