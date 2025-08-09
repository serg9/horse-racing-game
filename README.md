# Horse Racing Game

An interactive horse racing simulation built with Vue 3 using Vite and Vuex. The game allows you to generate a race schedule, watch animated horse competitions, and view results.

## Features

### Main Functionality
- **20 unique horses** with individual names and colors
- **Race schedule generation** with 6 different distances (1200-2200m)
- **Animated race simulation** with realistic speed
- **Result tracking system** with position and time tracking
- **Multi-round competitions** with pause and resume capabilities

### Technical Features
- **Vue 3 Composition API** with `<script setup>`
- **Vuex 4** for state management
- **Smart/Dumb components** for clean architecture
- **Composables** for race logic and animation
- **SCSS** for styling with BEM-like methodology
- **Vite** for fast development and build

## Quick Start

### Requirements
Make sure you have:
- **Node.js** (version 16 or higher)
- **Yarn** or **npm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:serg9/horse-racing-game.git
   cd horse-racing-game
   ```

2. **Install dependencies:**
   ```bash
   # Using Yarn (recommended)
   yarn install
   
   # Or using npm
   npm install
   ```

### Running the application

#### Development mode
```bash
# Yarn
yarn dev

# npm
npm run dev
```
Application will be available at: `https://556e70b8.horse-racing-game-6sk.pages.dev/`

#### Production build
```bash
# Yarn
yarn build

# npm
npm run build
```

#### Preview build
```bash
# Yarn
yarn preview

# npm
npm run preview
```

## How to play

1. **Program generation:** Click the "Generate program" button to create a race schedule
2. **Start the race:** Click "START" to begin the first race
3. **Control:** Use the "PAUSE"/"RESUME" buttons to control the race
4. **View results:** Observe the results of each race in real-time

## Project structure

```
src/
├── components/
│   ├── dumb/              # Presentation components
│   │   ├── Controls.vue   # Control elements
│   │   ├── RaceTrack.vue  # Race track
│   │   ├── RacingHorse.vue # Animated horse
│   │   └── ...
│   └── smart/             # Container components
│       ├── RaceTrackContainer.vue
│       └── ...
├── composables/           # Reusable logic
│   ├── useRaceAnimation.js # Race animation
│   ├── useRaceLogic.js    # Race logic
│   └── useRaceState.js    # Race state
├── store/                 # Vuex store
│   └── index.js          # State configuration
├── views/                 # Application pages
│   └── HorseRacingGame.vue
└── App.vue               # Main component
```

## 🛠️ Technical stack

- **Frontend Framework:** Vue 3
- **Build Tool:** Vite
- **State Management:** Vuex 4
- **Styling:** SCSS/Sass
- **Package Manager:** Yarn

## 🎨 Components

### Smart Components (Smart)
- `RaceTrackContainer.vue` - Manages track logic and animation
- `HorseListContainer.vue` - Displays horse list
- `RaceInfoContainer.vue` - Shows race information

### Dumb Components (Presentation)
- `Controls.vue` - Control buttons
- `RaceTrack.vue` - Visual track
- `RacingHorse.vue` - Animated horse
- `RaceProgram.vue` - Race program
- `RaceResults.vue` - Race results

## 🔧 Development

The project uses modern Vue 3 practices:
- **Composition API** for component logic
- **Composables** for primary logic
- **TypeScript-ready** structure (can be easily migrated)
- **Modular architecture** with clear separation of concerns

## ✅ Unit Testing & Coverage

This project includes comprehensive unit tests for components, composables, and the Vuex store.

- **Test runner:** Vitest (+ Vue Test Utils)
- **Scripts:**
  - Run tests: `yarn test`
  - Run with coverage: `yarn test:coverage`

### Latest test run summary

- **Test files**: 7 passed (7)
- **Tests**: 40 passed (40)
- **Duration**: ~2s on local machine

### Coverage summary (v8)

| Scope       | % Stmts | % Branch | % Funcs | % Lines |
|-------------|---------|----------|---------|---------|
| All files   | 100     | 89.47    | 100     | 100     |

### Breakdown by path

| File/Path                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered lines |
|-------------------------------------|---------|----------|---------|---------|-----------------|
| `src/`                              | 100     | 100      | 100     | 100     | —               |
| `src/components/dumb/`              | 100     | 100      | 100     | 100     | —               |
| `src/components/smart/`             | 100     | 100      | 100     | 100     | —               |
| `src/views/HorseRacingGame.vue`     | 100     | 100      | 100     | 100     | —               |
| `src/composables/useRaceAnimation.js` | 100   | 90       | 100     | 100     | 39, 49, 121     |
| `src/composables/useRaceLogic.js`   | 100     | 87.5     | 100     | 100     | 48, 63          |
| `src/composables/useRaceState.js`   | 100     | 88.23    | 100     | 100     | 14, 26          |
| `src/store/index.js`                | 100     | 90.62    | 100     | 100     | 39, 42, 103     |

### Notes and next steps

- **Branches below 100%** are mainly in composables and store conditionals. Add tests for edge cases around race start/stop transitions and animation boundary conditions to improve branch coverage.

## 📝 License

This project is created for educational and demonstrative purposes.

---

## Enjoy the game! 🏆
