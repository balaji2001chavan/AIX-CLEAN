const { getState } = require("./selfAwareness");

function metaReflect() {
    const state = getState();

    let insight = {
        improvementNeeded: false,
        reason: "",
        strategy: ""
    };

    if (state.confidence < 0.4) {
        insight.improvementNeeded = true;
        insight.reason = "Low confidence in reasoning";
        insight.strategy = "Try alternative planning approach";
    }

    if (state.thoughts.length > 20) {
        insight.improvementNeeded = true;
        insight.reason = "Overthinking detected";
        insight.strategy = "Simplify task execution";
    }

    return insight;
}

module.exports = { metaReflect };
