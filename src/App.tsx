import BuilderAccordion from "@/components/BuilderAccordion";
import ReviewSection from "@/components/ReviewSection";

const App = () => {
  return (
    <div className="max-w-310 mx-auto lg:flex lg:px-4 lg:gap-7.25 xl:flex-col md:pt-5">
      <h2 className="font-bold text-[#1F1F1F] text-[32px] text-center md:hidden mt-7.5">Let’s get started!</h2>
      <BuilderAccordion />
      <ReviewSection />
    </div>
  );
};

export default App;
