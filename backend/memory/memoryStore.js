let store = {
  preferences: {},
  lastTopic: null,
  lastProposal: null
};

export function getMemory() {
  return store;
}

export function setMemory(patch) {
  store = { ...store, ...patch };
}
