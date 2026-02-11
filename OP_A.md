**OrthoPlanner**

Open Source Orthognathic Surgery Planning Software

Documento di Architettura del Progetto

Versione 2.0 \| Febbraio 2026

**Licenza: Apache 2.0**

Piattaforma: Desktop (Windows / macOS / Linux)

1\. Vision e Obiettivi

1.1 Cos'è OrthoPlanner

OrthoPlanner è un software open source di pianificazione chirurgica per
interventi di chirurgia ortognatica. Nasce dall'esigenza clinica di
avere uno strumento accessibile, modulare e trasparente per pianificare
osteotomie virtuali, partendo dai dati radiologici (CBCT/DICOM) e dalle
scansioni intraorali (STL) del paziente.

Il progetto è guidato da un chirurgo maxillo-facciale e sviluppato in
modo incrementale. L'obiettivo a lungo termine è creare una piattaforma
che la comunità CMF (cranio-maxillo-facciale) possa usare, estendere e
migliorare collettivamente.

1.2 Principi Fondamentali

- **Open Source (Apache 2.0):** Codice libero, utilizzabile anche
  commercialmente, con protezione brevetti per tutti i contributori.

- **Desktop-First:** Applicazione nativa con Electron per accesso
  diretto a filesystem e GPU. Nessun server remoto, nessun upload di
  dati paziente.

- **Architettura a Plugin:** Un core solido (viewer 3D, gestione mesh,
  sistema di coordinate) su cui chiunque può costruire moduli
  aggiuntivi: osteotomie, impianti, distrazioni, placche, guide
  chirurgiche.

- **Clinically Driven:** Ogni decisione di design è guidata dal workflow
  chirurgico reale, non dalla tecnologia.

- **Privacy by Design:** I dati paziente restano sempre sul PC del
  chirurgo. Mai su cloud, mai condivisi.

1.3 Cosa NON è OrthoPlanner (per ora)

- Non è un dispositivo medico certificato (MDR/FDA) --- lo sarà in
  futuro, se il progetto matura

- Non è un'applicazione web (la versione web potrebbe arrivare in
  futuro, il codice lo permette)

- Non è un prodotto commerciale --- è un progetto open source guidato
  dalla community

2\. Stack Tecnologico

La scelta dello stack è guidata da tre criteri: performance per il 3D
medicale, architettura estensibile a plugin, e disponibilità di librerie
open source mature.

2.1 Architettura Desktop

L'applicazione usa Electron come shell desktop, con un frontend React
per l'interfaccia utente e Three.js/vtk.js per il rendering 3D. I moduli
computazionalmente pesanti (segmentazione, boolean operations su mesh)
sono implementati in WebAssembly (compilato da C++) per performance
quasi-native. Python viene usato per algoritmi di image processing
medicale tramite un processo backend locale.

  ---------------- ------------------- ----------------------------------
  **Componente**   **Tecnologia**      **Motivazione**

  Shell desktop    Electron            Accesso filesystem nativo, GPU,
                                       packaging cross-platform

  Frontend / UI    React + TypeScript  Ecosistema maturo,
                                       componentizzazione, type safety

  Rendering 3D     Three.js + vtk.js   Three.js per UX fluida, vtk.js per
                                       elaborazione medicale

  Elaborazione     cornerstone3D /     Parsing DICOM standard,
  DICOM            itk-wasm            ricostruzione volumetrica

  Elaborazione     itk-wasm + CGAL     Segmentazione, boolean ops, CSG su
  mesh 3D          (WASM)              mesh

  Backend locale   Python (FastAPI)    Algoritmi pesanti: segmentazione
                   embedded            AI, FEM tessuti molli

  Database locale  SQLite              Archiviazione casi paziente, tutto
                                       locale, zero cloud

  Sistema plugin   Custom plugin       Caricamento dinamico di moduli
                   loader              aggiuntivi

  Export 3D        Custom STL/OBJ      Generazione geometrie per stampa
                   writer              3D
  ---------------- ------------------- ----------------------------------

2.2 Librerie Chiave

- **Three.js:** Rendering 3D: scene, materiali, luci, interazione mouse.
  Il cuore visivo dell'app.

- **vtk.js:** Visualizzazione scientifica: volume rendering, isosurface
  extraction (marching cubes), manipolazione mesh.

- **cornerstone3D:** Parsing e visualizzazione DICOM, supporto
  multiframe, MPR (ricostruzioni multiplanari).

- **itk-wasm:** Image processing medicale in WebAssembly: filtri,
  segmentazione, registrazione.

- **CGAL (via WASM):** Operazioni geometriche avanzate: boolean
  operations su mesh, remeshing, offset surfaces.

- **Electron:** Wrapper desktop: accesso a filesystem, GPU nativa,
  processi background, auto-update.

- **Zustand:** State management leggero e reattivo per React.

2.3 Prerequisiti di Sviluppo (sul PC del developer)

Questi sono gli strumenti necessari per sviluppare OrthoPlanner:

  --------------- -------------- --------------------------- -----------------------
  **Strumento**   **Versione**   **A cosa serve**            **Download**

  Node.js         LTS (22.x)     Runtime JavaScript + npm    nodejs.org
                                 package manager             

  Git             2.x            Versioning del codice e     git-scm.com
                                 push su GitHub              

  Visual Studio   Latest         Editor di codice con        code.visualstudio.com
  Code                           estensioni                  

  Python          3.12+          Backend per algoritmi di    python.org
                                 image processing            

  Account GitHub  \-             Repository online del       github.com
                                 progetto                    
  --------------- -------------- --------------------------- -----------------------

3\. Architettura Modulare e Sistema Plugin

3.1 Filosofia: Core + Plugin

OrthoPlanner è progettato con una separazione netta tra il core
(funzionalità fondamentali che tutti usano) e i plugin (funzionalità
specialistiche che possono essere aggiunte da chiunque). Il core
fornisce le API e i servizi su cui i plugin si appoggiano.

Il Core fornisce

- Viewer 3D: scena Three.js con controlli camera, luci, materiali

- DICOM engine: parsing, visualizzazione MPR, ricostruzione 3D

- Mesh engine: import/export STL-OBJ-PLY, operazioni su mesh (taglio,
  boolean, smoothing)

- Sistema di coordinate: gestione dei sistemi di riferimento anatomici

- Gestione paziente: database locale, metadati, sessioni di
  pianificazione

- UI framework: pannelli, toolbar, sidebar, sistema di finestre

- Plugin API: interfaccia standard per registrare nuovi moduli

- Undo/Redo: sistema di history condiviso tra tutti i moduli

Esempi di Plugin (presenti e futuri)

  -------------------------- ---------------------------------- --------------
  **Plugin**                 **Descrizione**                    **Stato**

  orthognathic-planning      Osteotomie (Le Fort I, BSSO,       Core v1
                             genioplastica), simulazione,       
                             splint                             

  cephalometry-3d            Analisi cefalometrica con          Core v1
                             landmarks 3D e report              

  soft-tissue-sim            Simulazione tessuti molli          Core v1
                             post-operatoria                    

  implant-planning           Pianificazione posizionamento      Futuro
                             impianti dentali                   

  distraction-osteogenesis   Pianificazione distrazioni         Futuro
                             osteogenetiche                     

  plate-planning             Posizionamento placche e viti di   Futuro
                             osteosintesi                       

  tmj-analysis               Analisi articolazione              Futuro
                             temporo-mandibolare                

  airway-analysis            Analisi vie aeree pre/post         Futuro
                             chirurgia                          

  orthopedic-sim             Simulazione apparecchi ortopedici  Futuro
                             / ortodontici                      
  -------------------------- ---------------------------------- --------------

3.2 Come Funziona il Sistema Plugin

Ogni plugin è una cartella con una struttura standard:

- manifest.json --- nome, versione, autore, dipendenze, punto di
  ingresso

- index.ts --- classe principale che implementa l'interfaccia PluginAPI

- components/ --- componenti React specifici del plugin

- tools/ --- strumenti 3D (es. tool di taglio osteotomico)

- assets/ --- icone, modelli di riferimento, ecc.

Il core espone una PluginAPI con metodi come: registerTool(),
registerPanel(), registerMenuItem(), getScene(), getMeshById(),
addMeshToScene(), getPatientData(). Ogni plugin si registra all'avvio e
aggiunge le sue funzionalità all'interfaccia senza modificare il core.

4\. Moduli Core (versione 1.0)

Questi sono i moduli che compongono la prima release funzionante di
OrthoPlanner. Sono suddivisi tra moduli core (sempre attivi) e plugin
inclusi nella distribuzione base.

  -------- ----------------- ----------- -------------------------------------
  **ID**   **Modulo**        **Tipo**    **Descrizione**

  M1       DICOM Viewer      Core        Import e visualizzazione CBCT (MPR +
                                         3D)

  M2       STL Manager       Core        Import e gestione scansioni
                                         intraorali

  M3       Segmentazione     Core        Isolamento mascella, mandibola, denti

  M4       Registrazione     Core        Fusione STL su ricostruzione CBCT

  M5       Cefalometria 3D   Plugin      Landmarks, misurazioni, report
                             built-in    cefalometrico

  M6       Simulatore        Plugin      Tagli virtuali e riposizionamento
           Osteotomie        built-in    segmenti

  M7       Simulazione       Plugin      Predizione profilo facciale post-op
           Tessuti Molli     built-in    

  M8       Export e Splint   Plugin      Generazione splint e guide per stampa
                             built-in    3D
  -------- ----------------- ----------- -------------------------------------

4.1 Modulo M1: DICOM Viewer \[Core\]

**Obiettivo:** Importare file DICOM da CBCT e visualizzarli nelle tre
proiezioni standard (assiale, coronale, sagittale) più una ricostruzione
3D volumetrica.

Funzionalità

- Importazione cartella DICOM con parsing automatico dei metadati
  (paziente, voxel spacing, orientamento)

- Visualizzazione MPR (Multi-Planar Reconstruction) con scroll
  interattivo

- Ricostruzione 3D tramite Marching Cubes con threshold regolabile (per
  isolare osso dai tessuti molli)

- Strumenti base: zoom, pan, rotate, windowing (livello/ampiezza),
  misurazioni lineari

- Supporto per diversi FOV (Field of View) delle CBCT

Tecnologie

- **cornerstone3D:** parsing DICOM e viste MPR

- **vtk.js:** ricostruzione 3D volumetrica (vtkImageMarchingCubes)

- **Three.js:** rendering interattivo della mesh 3D risultante

Input / Output

- **Input:** Cartella DICOM (.dcm files) da filesystem locale

- **Output:** Volume 3D in memoria + mesh triangolare della superficie
  ossea

4.2 Modulo M2: STL Manager \[Core\]

**Obiettivo:** Importare e gestire scansioni intraorali in formato STL
(o PLY/OBJ), visualizzarle e prepararle per la registrazione con i dati
CBCT.

Funzionalità

- Importazione file STL (binary e ASCII), PLY, OBJ dal filesystem locale

- Visualizzazione 3D con materiali realistici (colore denti, gengiva)

- Strumenti di pulizia mesh: rimozione artefatti, smoothing, riparazione
  buchi

- Gestione multipla: arcata superiore, arcata inferiore, bite di
  registrazione

- Allineamento manuale iniziale (drag & rotate) per facilitare la
  registrazione automatica

4.3 Modulo M3: Segmentazione \[Core\]

**Obiettivo:** Separare automaticamente o semi-automaticamente le
strutture anatomiche dalla CBCT: mascella (maxilla), mandibola, singoli
denti, condili.

Funzionalità

- Segmentazione per threshold (Hounsfield Units) con refinement manuale

- Separazione mascella/mandibola tramite piano di taglio interattivo

- Segmentazione individuale dei denti (opzionale, più complessa)

- Isolamento condili per analisi articolazione temporo-mandibolare

- Esportazione di ogni segmento come mesh indipendente

Approcci Tecnici (incrementali)

- **Fase 1:** Threshold + region growing + manual refinement (fattibile
  subito)

- **Fase 2:** Deep learning (U-Net 3D) per segmentazione automatica
  (richiede training con dataset CBCT)

4.4 Modulo M4: Registrazione STL-CBCT \[Core\]

**Obiettivo:** Allineare le scansioni intraorali STL alla ricostruzione
3D da CBCT, per ottenere un modello composito con la precisione dentale
dell'impronta ottica e il contesto scheletrico della CBCT.

Funzionalità

- Allineamento manuale iniziale tramite selezione di 3+ punti
  corrispondenti

- Registrazione automatica fine con algoritmo ICP (Iterative Closest
  Point)

- Visualizzazione qualità di registrazione (mappa di distanza a colori,
  errore medio/max)

- Sostituzione dei denti CBCT (bassa risoluzione) con quelli STL (alta
  risoluzione)

Algoritmi

- **ICP standard:** rigid registration per allineamento fine

- **Super4PCS:** allineamento iniziale globale robusto (senza punti
  manuali)

- **Trimmed ICP:** gestione delle differenze di copertura tra STL e CBCT

4.5 Modulo M5: Cefalometria Digitale 3D \[Plugin built-in\]

**Obiettivo:** Eseguire analisi cefalometriche direttamente sul volume
3D, con posizionamento di landmarks anatomici e calcolo automatico di
angoli, distanze e rapporti.

Funzionalità

- Posizionamento interattivo di landmarks cefalometrici 3D (Nasion,
  Sella, punto A, punto B, Pogonion, Menton, ecc.)

- Calcolo automatico delle misure cefalometriche standard (SNA, SNB,
  ANB, piano mandibolare, Wits appraisal, ecc.)

- Confronto con norme cefalometriche (Ricketts, Steiner, McNamara,
  Burstone)

- Generazione report cefalometrico con diagnosi suggerita e grafici
  radar

- Aggiornamento automatico delle misure dopo simulazione osteotomia

4.6 Modulo M6: Simulatore Osteotomie \[Plugin built-in\] --- MODULO CORE

**Obiettivo:** Permettere al chirurgo di pianificare virtualmente le
osteotomie e riposizionare i segmenti ossei nella posizione desiderata,
con feedback numerico in tempo reale.

Funzionalità Essenziali

- Definizione interattiva del piano/linea di taglio osteotomico sulla
  mesh 3D

- Separazione della mesh in segmenti lungo il piano di taglio (mesh
  cutting)

- Manipolazione 6DOF (6 gradi di libertà) dei segmenti: traslazione
  X/Y/Z + rotazione X/Y/Z

- Feedback numerico real-time: mm di avanzamento, arretramento,
  impaction, rotazione, cant correction

- Visualizzazione side-by-side o overlay pre/post operatorio

- Snap e vincoli: movimento lungo un asse, simmetria bilaterale, blocco
  rotazione

- Sistema Undo/Redo completo per ogni operazione

Osteotomie Supportate

- **Le Fort I:** Taglio orizzontale della mascella. Movimenti:
  avanzamento, arretramento, impaction, downgraft, rotazione (yaw, roll,
  pitch). Possibilità di segmentazione in 2-3 pezzi.

- **BSSO:** Split sagittale bilaterale della mandibola. Movimenti:
  avanzamento, arretramento, rotazione del corpo mandibolare. Segmenti:
  corpo + 2 rami.

- **Genioplastica:** Taglio del mento con riposizionamento verticale,
  orizzontale e laterale.

- **Osteotomie segmentarie:** Divisione della mascella o mandibola in
  sotto-segmenti per espansione, compressione o correzione di
  discrepanze trasversali.

Implementazione Tecnica

- **Mesh cutting:** Divisione di una mesh triangolare con un piano. CGAL
  via WebAssembly o algoritmo Sutherland-Hodgman custom.

- **Gizmo 3D:** Widget di trasformazione (frecce + anelli) per muovere e
  ruotare i segmenti. Three.js TransformControls.

- **Collision detection:** Rilevamento interferenze tra segmenti. BVH
  (Bounding Volume Hierarchy).

- **Measurement overlay:** Visualizzazione delle distanze di spostamento
  in tempo reale accanto ai segmenti.

4.7 Modulo M7: Simulazione Tessuti Molli \[Plugin built-in\]

**Obiettivo:** Predire come cambierà il profilo facciale in seguito ai
movimenti ossei pianificati, fornendo un'anteprima visiva del risultato
estetico.

Approcci (implementazione incrementale)

- **MVP --- Ratio-based:** Rapporti fissi osso/tessuto molle (es. 1mm
  avanzamento maxillare = 0.7mm avanzamento labbro superiore). Veloce e
  semplice, buono per una prima versione.

- **V2 --- Mass-Spring:** Modello a molle tra vertici della mesh dei
  tessuti molli e punti di ancoraggio ossei. Buon compromesso
  qualità/velocità.

- **V3 --- FEM:** Finite Element Method con meshing volumetrico e
  proprietà biomeccaniche dei tessuti. Massima accuratezza, richiede
  calcolo pesante (Python/WASM).

4.8 Modulo M8: Export e Generazione Splint \[Plugin built-in\]

**Obiettivo:** Trasformare la pianificazione virtuale in oggetti fisici:
splint intermedi e finali per guidare il chirurgo in sala operatoria.

Funzionalità

- Generazione automatica dello splint intermedio (posizione maxillare
  dopo Le Fort I, prima del riposizionamento mandibolare)

- Generazione dello splint finale (occlusione definitiva pianificata)

- Export in formato STL per stampa 3D (FDM, SLA, SLS)

- Spessore, offset e parametri di stampa configurabili

- Preview dello splint in situ (sovrapposto ai modelli dentali)

- Generazione guide di taglio osteotomico per stampa 3D

- Export report chirurgico PDF con dati completi della pianificazione

5\. Roadmap di Sviluppo

La roadmap è organizzata in fasi incrementali. Ogni fase produce un
deliverable funzionante e testabile. Le sessioni stimate si riferiscono
a sessioni di lavoro con Claude, ciascuna della durata di una
conversazione.

  ---------- ------------ ---------------------------------- --------------
  **Fase**   **Moduli**   **Deliverable**                    **Sessioni**

  Fase 0     Setup        Progetto Electron + React +        2-3
                          Three.js, struttura cartelle,      
                          build, GitHub                      

  Fase 1     M1 (base)    DICOM viewer: caricamento da       5-8
                          filesystem, viste MPR,             
                          ricostruzione 3D                   

  Fase 2     M2           Import e visualizzazione STL con   3-5
                          strumenti base                     

  Fase 3     M3 (base)    Segmentazione threshold:           5-8
                          separazione mascella/mandibola     

  Fase 4     M6 (MVP)     Simulatore osteotomie base: taglio 8-12
                          mesh + gizmo 6DOF                  

  Fase 5     M4           Registrazione ICP: fusione STL su  5-8
                          CBCT                               

  Fase 6     M5           Cefalometria 3D con landmarks e    4-6
                          report                             

  Fase 7     M7 (base)    Simulazione tessuti molli          4-6
                          ratio-based                        

  Fase 8     M8           Generazione splint e export STL    6-10

  Fase 9     Plugin       Implementazione plugin loader,     4-6
             system       API, e documentazione contributori 

  Fase 10    Tutti        Integrazione finale, UI polish,    10-15
                          testing con casi reali             
  ---------- ------------ ---------------------------------- --------------

**Totale stimato:** 55-90 sessioni di lavoro con Claude. Ogni sessione
produce codice funzionante che viene scaricato e versionato su GitHub.

5.1 Strategia di Lavoro Sessione per Sessione

Ogni sessione di lavoro con Claude segue questo flusso:

- 1\. Allega il documento di architettura e/o i file su cui lavorare

- 2\. Claude scrive il codice, lo testa, e produce file scaricabili

- 3\. Tu scarichi i file e li metti nella cartella del progetto sul tuo
  PC

- 4\. Lanci i comandi che Claude ti indica per testare

- 5\. Se funziona, fai commit e push su GitHub

- 6\. Se non funziona, torni nella sessione e correggiamo insieme

6\. Struttura del Progetto

La struttura delle cartelle riflette l'architettura core + plugin:

  ----------------------- ----------------------------------------------
  **Cartella / File**     **Contenuto**

  orthoplanner/           Root del progetto

  src/                    Codice sorgente principale

  core/                   Moduli core sempre attivi

  dicom-engine/           M1: parsing e visualizzazione DICOM

  mesh-engine/            Operazioni su mesh: import, export, taglio,
                          boolean

  scene-manager/          Gestione scena Three.js: camera, luci,
                          materiali

  patient-manager/        Database pazienti, sessioni, metadati

  coordinate-system/      Sistemi di riferimento anatomici

  plugin-api/             Interfaccia per registrare e caricare plugin

  undo-redo/              Sistema history condiviso

  plugins/                Plugin built-in e di terze parti

  orthognathic/           M6: simulatore osteotomie

  cephalometry/           M5: cefalometria 3D

  soft-tissue/            M7: simulazione tessuti molli

  export-splint/          M8: generazione splint e report

  ui/                     Componenti UI condivisi (toolbar, sidebar,
                          dialog, ecc.)

  store/                  State management (Zustand)

  styles/                 CSS / tema dell'applicazione

  electron/               Main process Electron (lifecycle, menu, file
                          dialogs)

  python/                 Backend Python per algoritmi pesanti

  wasm/                   Moduli WebAssembly compilati (CGAL, itk)

  public/                 Asset statici (icone, font, modelli di test)

  tests/                  Test unitari e di integrazione

  docs/                   Documentazione per contributori e utenti

  LICENSE                 Apache License 2.0

  README.md               Descrizione progetto, setup, come contribuire

  package.json            Dipendenze npm e script

  tsconfig.json           Configurazione TypeScript

  electron-builder.yml    Configurazione packaging (installer
                          Windows/Mac/Linux)
  ----------------------- ----------------------------------------------

7\. Workflow Clinico di Riferimento

Questo è il flusso clinico completo che il software supporta, dal dato
grezzo alla sala operatoria:

**Step 1 --- Acquisizione dati:** Il chirurgo acquisisce una CBCT del
paziente e scansioni intraorali digitali (scanner intraorale).
Risultato: file DICOM e file STL.

**Step 2 --- Importazione:** I file vengono importati in OrthoPlanner
dal filesystem locale. Il DICOM viene processato per creare una
ricostruzione 3D volumetrica. Gli STL vengono caricati e visualizzati.

**Step 3 --- Segmentazione:** La CBCT viene segmentata per isolare
mascella, mandibola e denti come mesh 3D separate e manipolabili
indipendentemente.

**Step 4 --- Registrazione:** Le scansioni intraorali STL vengono
allineate alla ricostruzione CBCT tramite ICP, ottenendo un modello
composito con la precisione dentale dell'impronta ottica e il contesto
scheletrico della CBCT.

**Step 5 --- Analisi cefalometrica:** Il chirurgo posiziona i landmarks
cefalometrici 3D. Il software calcola automaticamente le misure e
suggerisce la diagnosi.

**Step 6 --- Pianificazione osteotomie:** Il chirurgo definisce i tagli
virtuali (Le Fort I, BSSO, genioplastica) e riposiziona i segmenti ossei
nella posizione ideale. Feedback numerico in tempo reale.

**Step 7 --- Simulazione tessuti molli:** Il software predice il nuovo
profilo facciale basandosi sui movimenti ossei pianificati. Il chirurgo
valuta il risultato estetico.

**Step 8 --- Generazione splint:** Il software genera gli splint
chirurgici (intermedio e finale) come file STL pronti per la stampa 3D.

**Step 9 --- Report:** Viene generato un report PDF completo: movimenti
pianificati, misure cefalometriche pre/post, immagini 3D, dati degli
splint, note del chirurgo.

8\. Open Source: Licenza e Contribuzione

8.1 Licenza Apache 2.0

OrthoPlanner è distribuito con licenza Apache 2.0. Questo significa che
chiunque può usare, modificare, distribuire e vendere il software o
prodotti derivati, a condizione di includere la nota di copyright e la
licenza. La licenza include una concessione esplicita di brevetto: ogni
contributore concede una licenza perpetua e gratuita sui propri brevetti
correlati al codice contribuito. Questo protegge tutti i contributori e
gli utenti.

8.2 Come Contribuire

Il repository GitHub include una guida CONTRIBUTING.md che spiega:

- Come fare fork del repository e creare branch

- Standard di codice (linting, TypeScript strict, test obbligatori)

- Come creare un nuovo plugin (template e documentazione API)

- Processo di review e merge delle Pull Request

- Code of Conduct per la community

8.3 Governance del Progetto

Il progetto adotta un modello BDFL (Benevolent Dictator For Life)
iniziale, dove il fondatore ha l'ultima parola sulle decisioni
architetturali. Man mano che la community cresce, si può evolvere verso
un modello a comitato (steering committee). Le decisioni importanti
vengono discusse in issue GitHub aperte prima di essere implementate.

9\. Note Importanti

9.1 Certificazione come Dispositivo Medico

Se OrthoPlanner verrà usato in contesto clinico per decisioni
chirurgiche, dovrà essere certificato come dispositivo medico secondo il
regolamento MDR (Medical Device Regulation, UE 2017/745), classe IIa.
Requisiti: sistema di gestione qualità (ISO 13485), documentazione
tecnica, valutazione clinica, marcatura CE, e sorveglianza post-market.
Per il mercato USA serve la clearance FDA (510(k) o De Novo). Questo
processo è lungo e costoso ma necessario per l'uso clinico. Si consiglia
di coinvolgere un consulente regolatorio fin dalle fasi iniziali.

Nella fase di sviluppo e prototipazione, OrthoPlanner è da considerarsi
uno strumento di ricerca e studio, non un dispositivo medico.

9.2 Privacy e Dati Paziente

I file DICOM contengono dati identificativi del paziente (nome, data di
nascita, ID). OrthoPlanner lavora esclusivamente in locale e non
trasmette mai dati in rete. Per la versione clinica futura sarà
necessario implementare: anonimizzazione DICOM automatica, crittografia
dei dati a riposo, audit log degli accessi, conformità GDPR. Per lo
sviluppo, usare esclusivamente dataset DICOM anonimizzati o pubblici.

9.3 Dataset di Test

Per lo sviluppo e il testing, si possono utilizzare dataset DICOM
pubblici e anonimizzati disponibili online, come quelli su The Cancer
Imaging Archive (TCIA) o dataset specifici per cranio-maxillo-facciale
disponibili su piattaforme accademiche. Mai usare dati reali di pazienti
durante lo sviluppo.

10\. Prossimo Passo: Fase 0

La Fase 0 è il setup iniziale del progetto. Alla fine di questa fase
avrai un'applicazione Electron funzionante con una scena 3D vuota,
pronta per ricevere i moduli successivi. Il codice sarà su GitHub.

10.1 Prerequisiti (da installare prima)

- Node.js LTS (22.x) --- nodejs.org

- Git (2.x) --- git-scm.com

- Visual Studio Code --- code.visualstudio.com

- Python (3.12+) --- python.org (spuntare "Add to PATH" durante
  l'installazione)

- Account GitHub --- github.com

10.2 Cosa faremo nella Fase 0

- Inizializzazione progetto con React + TypeScript + Electron

- Integrazione Three.js con scena 3D di base

- Struttura cartelle come definita nella sezione 6

- Configurazione build e hot-reload per sviluppo rapido

- Creazione repository GitHub con README, LICENSE (Apache 2.0),
  .gitignore

- Primo commit e push

10.3 Come iniziare la sessione

Quando sei pronto, apri una nuova conversazione con Claude e scrivi:

> *\"Ho installato tutto, partiamo con la Fase 0 di OrthoPlanner\"*

Allega questo documento. Claude avrà tutto il contesto per partire
immediatamente.

*--- Fine del documento ---*
