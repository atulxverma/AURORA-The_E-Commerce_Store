import CategoryTemplate from "../components/CategoryTemplate";

export default function AccessoriesPage() {
  return (
    <CategoryTemplate 
        title="Accessories" 
        subtitle="The finishing touch. Premium watches, sunglasses, and essentials."
        filterType="category"
        filterValue="accessories"
        heroGradient="bg-gradient-to-r from-amber-50 via-orange-50 to-white"
    />
  );
}