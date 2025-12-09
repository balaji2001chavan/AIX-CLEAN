import { verifyOwner } from "../auth/root-secure.js";
import { verifyVoice } from "../auth/voice.js";
import { verifyPalm } from "../auth/palm.js";
import { verifyDevice } from "../auth/device.js";

export function activateRoot({ phrase, voiceScore, palmScan, deviceId }) {
  
  const auth = verifyOwner({
    phraseInput: phrase,
    voiceMatchScore: voiceScore,
    palmHash: palmScan,
    deviceId: deviceId
  });

  if (!auth.access) {
    return {
      mode: "LOCKED",
      message: "Root Access Denied",
      details: auth
    };
  }

  return {
    mode: "ROOT",
    message: "FULL ACCESS GRANTED",
    privileges: [
      "modify_files",
      "deploy_code",
      "create_apps",
      "system_override",
      "auto_repair",
      "global_execution"
    ]
  };
}
