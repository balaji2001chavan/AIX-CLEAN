export function trackClick(itemId, source) {
  console.log("AIX CLICK:", {
    itemId,
    source,
    time: new Date().toISOString()
  });
}
