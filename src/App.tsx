import BuilderAccordion from "@/components/BuilderAccordion";
import ReviewSection from "@/components/ReviewSection";

const App = () => {
  return (
    <div className="max-w-303.75 mx-auto lg:flex lg:px-4 lg:gap-7.25 xl:flex-col">
      <BuilderAccordion />
      <ReviewSection />
    </div>
  );
};

export default App;
