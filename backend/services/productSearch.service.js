export async function findProducts({ query, budget, categories }) {

  // ⚠️ Phase-1: clean, legal, real pattern
  // This will be replaced with real connectors / partnerships

  return [
    {
      id: "p1",
      category: "fashion",
      title: "Men Casual T-Shirt",
      price: 289,
      image: "https://via.placeholder.com/300",
      openUrl: "https://example-seller.com/product/123",
      source: "Marketplace"
    },
    {
      id: "p2",
      category: "gadgets",
      title: "Wireless Earbuds",
      price: 299,
      image: "https://via.placeholder.com/300",
      openUrl: "https://example-seller.com/product/456",
      source: "Marketplace"
    }
  ].filter(p => p.price <= budget);
}
