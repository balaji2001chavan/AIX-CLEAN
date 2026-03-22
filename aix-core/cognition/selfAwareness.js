let internalState = {
    goals: [],
    thoughts: [],
    confidence: 0.5,
    lastAction: null
};

function updateState(thought) {
    internalState.thoughts.push(thought);
    internalState.lastAction = thought;

    if (thought.review && thought.review.toLowerCase().includes("success")) {
        internalState.confidence += 0.05;
    } else {
        internalState.confidence -= 0.02;
    }

    if (internalState.confidence > 1) internalState.confidence = 1;
    if (internalState.confidence < 0) internalState.confidence = 0;
}

function getState() {
    return internalState;
}

module.exports = {
    updateState,
    getState
};
