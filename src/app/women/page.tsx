import CategoryTemplate from "../components/CategoryTemplate";

export default function WomenPage() {
  return (
    <CategoryTemplate 
        title="Women" 
        subtitle="Elegance redefined. Explore the latest trends in dresses, footwear, and accessories."
        filterType="category"
        filterValue="women"
        heroGradient="bg-gradient-to-r from-pink-50 via-rose-50 to-white"
    />
  );
}