export async function findProducts({ budget, categories }) {
  const products = [
    {
      title: "Men Casual T-Shirt",
      price: 289,
      openUrl: "https://example.com/men-tshirt"
    },
    {
      title: "Kids Toy Set",
      price: 279,
      openUrl: "https://example.com/kids-toy"
    },
    {
      title: "Wireless Earbuds",
      price: 299,
      openUrl: "https://example.com/earbuds"
    }
  ];

  return products.filter(p => p.price <= budget);
}
