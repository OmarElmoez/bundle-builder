import ProductCard from "@/components/ProductCard";
import data from "@/db.json";
import SELECTION_KEYS from "@/utils/selection-keys";
import ReviewSection from "./components/ReviewSection";

const App = () => {
  return (
    <div className="max-w-303.25 mx-auto py-8">
    <div className="p-4 bg-[#EDF4FF] flex gap-4 ">
      {data.cameras.map((camera) => (
        <ProductCard
          key={camera.id}
          product={camera}
          categoryKey={SELECTION_KEYS.cameras} 
        />
      ))}
    </div>
      <ReviewSection />
    </div>
  );
};

export default App;
