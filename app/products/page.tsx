// app/products/page.tsx
import { ProductListings } from "../components/index";

export default function ProductsPage() {
  return (
    <div>
      <ProductListings isProductsPage={true} />
    </div>
  );
}
