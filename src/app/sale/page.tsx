import CategoryTemplate from "../components/CategoryTemplate";

export default function SalePage() {
  return (
    <CategoryTemplate 
        title="Sale" 
        subtitle="Exclusive pieces at unbeatable prices. Limited time offers."
        filterType="sale"
        filterValue=""
        heroGradient="bg-gradient-to-r from-red-50 via-orange-50 to-white"
    />
  );
}