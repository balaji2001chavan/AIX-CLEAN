export function currencyFor(country) {
  if (country === "USA") return "$";
  if (country === "UAE") return "AED";
  return "₹";
}