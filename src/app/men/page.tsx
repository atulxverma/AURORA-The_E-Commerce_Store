import CategoryTemplate from "../components/CategoryTemplate";

export default function MenPage() {
  return (
    <CategoryTemplate 
        title="Men" 
        subtitle="Refined aesthetics for the modern gentleman. Discover suits, streetwear, and essentials."
        filterType="category"
        filterValue="men"
        heroGradient="bg-gradient-to-r from-blue-50 via-gray-50 to-white"
    />
  );
}