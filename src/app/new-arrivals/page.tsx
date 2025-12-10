import CategoryTemplate from "../components/CategoryTemplate";

export default function NewArrivalsPage() {
  return (
    <CategoryTemplate 
        title="New Arrivals" 
        subtitle="Fresh drops straight from the runway. Be the first to own them."
        filterType="new"
        filterValue=""
        heroGradient="bg-gradient-to-r from-green-50 via-emerald-50 to-white"
    />
  );
}