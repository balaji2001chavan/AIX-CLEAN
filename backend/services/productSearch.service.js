export async function findProducts({ query, budget, categories }) {

  // 🔒 Phase 1 – real structure, safe data
  // (पुढे इथे live connectors येतील)

  const allProducts = [
    {
      id: "f1",
      category: "fashion",
      title: "Men Casual T-Shirt",
      price: 289,
      image: "https://via.placeholder.com/300",
      openUrl: "https://example.com/product/1",
      source: "Marketplace"
    },
    {
      id: "g1",
      category: "gadgets",
      title: "Wireless Earbuds",
      price: 299,
      image: "https://via.placeholder.com/300",
      openUrl: "https://example.com/product/2",
      source: "Marketplace"
    },
    {
      id: "k1",
      category: "kids",
      title: "Kids Toy Set",
      price: 279,
      image: "https://via.placeholder.com/300",
      openUrl: "https://example.com/product/3",
      source: "Marketplace"
    }
  ];

  return allProducts.filter(
    (p) =>
      p.price <= budget &&
      categories.includes(p.category)
  );
}
