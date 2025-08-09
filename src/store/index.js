import { createStore } from 'vuex';

const raceDistances = [1200, 1400, 1600, 1800, 2000, 2200];
const horseNames = [
  'Thunder Bolt', 'Lightning Strike', 'Storm Rider', 'Wind Walker', 'Fire Dancer',
  'Shadow Runner', 'Golden Arrow', 'Silver Bullet', 'Midnight Express', 'Sunrise Glory',
  'Ocean Wave', 'Mountain Peak', 'Desert Wind', 'Forest Spirit', 'Sky Dancer',
  'Star Chaser', 'Moon Runner', 'Sun Blazer', 'River Flow', 'Eagle Soar'
];

const colors = [
  '#FF6347', '#40E0D0', '#4682B4', '#9ACD32', '#FFD700',
  '#DA70D6', '#98FB98', '#FFDAB9', '#BA55D3', '#87CEFA',
  '#FFA07A', '#66CDAA', '#FA8072', '#87CEEB', '#D8BFD8',
  '#7FFFD4', '#F0E68C', '#DB7093', '#AFEEEE', '#DDA0DD'
];

const lapNames = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH'];

export default createStore({
  state: {
    horses: [],
    raceSchedule: [],
    currentRound: 0,
    raceResults: [],
    isRacing: false,
    lapNames: [],
  },
  getters: {
    hasProgram: (state) => {
      return Array.isArray(state.raceSchedule) && state.raceSchedule.length > 0
    },
    totalRounds: (state) => {
      return state.raceSchedule.length
    },
    canStartRace: (state, getters) => {
      return getters.hasProgram && state.currentRound < getters.totalRounds
    },
    raceButtonText: (state) => {
      if (state.isRacing) return 'PAUSE'
      return state.currentRound > 0 ? 'CONTINUE' : 'START'
    }
  },
  mutations: {
    GENERATE_HORSES(state) {
      const shuffledNames = [...horseNames].sort(() => Math.random() - 0.5);
      const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
      state.horses = shuffledNames
        .map((name, index) => ({
          id: index + 1,
          name,
          color: shuffledColors[index],
          condition: Math.floor(Math.random() * 100) + 1,
          position: 0
        }));
    },
    GENERATE_SCHEDULE(state) {
      state.raceSchedule = raceDistances.map(distance => {
        const shuffled = [...state.horses].sort(() => 0.5 - Math.random());
        return {
          distance,
          participants: shuffled.slice(0, 10),
        };
      });
      state.currentRound = 0;
      state.raceResults = [];
      state.lapNames = lapNames;
    },
    SET_RACING(state, value) {
      state.isRacing = !!value;
    },
    SET_CURRENT_ROUND(state, value) {
      const v = Number(value) || 0;
      const maxIdx = Math.max(0, state.raceSchedule.length - 1);
      state.currentRound = Math.max(0, Math.min(v, maxIdx));
    },
    ADD_RACE_RESULT(state, payload) {
      if (!Array.isArray(state.raceResults)) state.raceResults = [];
      state.raceResults.push(payload);
    },
  },
  actions: {
    generateHorses({ commit }) {
      commit('GENERATE_HORSES');
    },
    generateSchedule({ commit }) {
      commit('GENERATE_SCHEDULE');
    },
    toggleRacing({ commit, state }) {
      commit('SET_RACING', !state.isRacing);
    }
  },
});