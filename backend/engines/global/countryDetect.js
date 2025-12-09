export function detectCountry(text) {
  if (text.toLowerCase().includes("dubai") || text.toLowerCase().includes("uae"))
    return "UAE";
  if (text.toLowerCase().includes("usa"))
    return "USA";
  return "IN"; // default India
}