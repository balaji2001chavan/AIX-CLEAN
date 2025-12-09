export function decide(scan, rules) {
  const activate = [];
  const ignore = [];

  scan.backend.forEach(f => {
    if (rules.avoid_keywords.some(k => f.includes(k))) {
      ignore.push("backend:" + f);
    } else {
      activate.push("backend:" + f);
    }
  });

  scan.frontend.forEach(f => {
    if (rules.avoid_keywords.some(k => f.includes(k))) {
      ignore.push("frontend:" + f);
    } else {
      activate.push("frontend:" + f);
    }
  });

  return { activate, ignore };
}