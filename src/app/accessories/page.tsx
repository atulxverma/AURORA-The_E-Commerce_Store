import CategoryTemplate from "../components/CategoryTemplate";

export default function AccessoriesPage() {
  return (
    <CategoryTemplate 
        title="Accessories" 
        subtitle="The finishing touch. Watches, jewelry, bags, and more."
        filterType="category"
        filterValue="accessories" // Matches "mobile-accessories", "home-accessories" etc.
        heroGradient="bg-gradient-to-r from-amber-50 via-orange-50 to-white"
    />
  );
}