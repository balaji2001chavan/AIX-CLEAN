export async function speak({ input, thought, actionResult, plan }) {
  return `
ठीक आहे, मी तुमचा आदेश समजलो आहे.

तुमचा विषय: ${input}
सध्याची योजना: ${plan}

मी हे केलं आहे:
${actionResult.work || "सध्या फक्त सल्ला दिला आहे"}

पुढे काय करायचं ते तुम्ही सांगू शकता.
`;
}
