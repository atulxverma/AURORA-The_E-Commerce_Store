import CategoryTemplate from "../components/CategoryTemplate";

export default function MenPage() {
  return (
    <CategoryTemplate 
        title="Men" 
        subtitle="Refined aesthetics for the modern gentleman. Suits, shirts, and sneakers."
        filterType="category"
        filterValue="men"
        heroGradient="bg-gradient-to-r from-slate-50 via-gray-100 to-white"
    />
  );
}