export function affiliateSearch(query, country) {
  if (country === "UAE") {
    return [
      { title:"Men Shirt UAE", price:50, site:"Noon",
        link:"https://www.noon.com", image:"https://via.placeholder.com/120" }
    ];
  }
  if (country === "USA") {
    return [
      { title:"Men Shirt USA", price:20, site:"Amazon",
        link:"https://www.amazon.com", image:"https://via.placeholder.com/120" }
    ];
  }
  return [
    { title:"Men Shirt India", price:499, site:"Flipkart",
      link:"https://www.flipkart.com", image:"https://via.placeholder.com/120" },
    { title:"Cotton Shirt", price:450, site:"Amazon",
      link:"https://www.amazon.in", image:"https://via.placeholder.com/120" }
  ];
}