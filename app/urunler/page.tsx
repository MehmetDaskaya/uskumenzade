// app/urunler/page.tsx
import { ProductListings } from "../components/index";
import { OrganizationSchemaMarkup } from "../../Product_Schema_Markup_Template";

export default function ProductsPage() {
  return (
    <>
      <OrganizationSchemaMarkup />
      <div>
        <ProductListings isProductsPage={true} />
      </div>
    </>
  );
}
