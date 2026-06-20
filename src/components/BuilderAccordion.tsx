import { BUILDER_STEPS } from "@/constants";
import { useState } from "react";
import AccordionItem from "./AccordionItem";

const totalSteps = BUILDER_STEPS.length;

const BuilderAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const handleToggle = (id: number) => {
    setOpenIndex((prevIndex) => (prevIndex === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 overflow-hidden bg-white space-y-3.25">
      {BUILDER_STEPS?.map((step) => (
        <AccordionItem
          key={step.id}
          step={step}
          totalSteps={totalSteps}
          isOpen={openIndex === step.id}
          onToggle={() => handleToggle(step.id)}
        />
      ))}
    </div>
  );
};

export default BuilderAccordion;
