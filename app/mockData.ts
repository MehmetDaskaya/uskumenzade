export const blogs = [
  {
    id: "1",
    title: "The Benefits of Herbal Tea",
    subtitle: "How herbal tea can improve your health.",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    id: "2",
    title: "Essential Oils for Relaxation",
    subtitle: "Discover the best essential oils to help you relax.",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    id: "3",
    title: "Natural Creams for Healthy Skin",
    subtitle: "Explore our range of natural creams to keep your skin healthy.",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  // Add more mock blogs as needed
];

// src/mockData.ts (assuming you're using TypeScript for mock data)

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Herbal Tea",
    price: 12.99,
    description: "A soothing blend of herbal tea for relaxation.",
    imageUrl: "https://via.placeholder.com/400x300",
  },
  {
    id: "2",
    name: "Lavender Oil",
    price: 8.99,
    description: "Pure lavender essential oil to calm your mind.",
    imageUrl: "https://via.placeholder.com/400x300",
  },
  {
    id: "3",
    name: "Aloe Vera Cream",
    price: 15.49,
    description: "Natural Aloe Vera cream to hydrate and nourish your skin.",
    imageUrl: "https://via.placeholder.com/400x300",
  },
  // Add more products if necessary
];
