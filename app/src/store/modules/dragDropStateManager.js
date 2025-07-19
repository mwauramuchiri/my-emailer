const dragDropStates = {
  state: {
    // isDraggingChip: false,
    // chipIsDropping: false,
    fakeChip: "----", // should be a HTMLElement
    chipData: {},
    chipIsDropped: false,
    dropIsComplete: null // should be either [null] or a [Promise]
  },
  mutations: {
    toggleIsDraggingChip(state, val = false) {
      console.log("changing [isDraggingChip] : ", val);
      state.isDraggingChip = val;
    },
    toggleChipIsDropping(state, val = false) {
      console.log("changing [chipIsDropping] : ", val);
      state.chipIsDropping = val;
    },
    toggleChipisDropped(state, val = false) {
      state.chipIsDropped = val;
    },
    changeChipData(state, val = {}) {
      state.chipData = Object.assign({}, state.chipData, val);
    },
    changeFakeChip(state, val = null) {
      state.fakeChip = val;
    },
    changeDropIsComplete(state, val = null) {
      state.dropIsComplete = val;
    }
  }
};

export default dragDropStates;