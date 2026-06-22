import { BUILDER_STEPS } from "@/constants";
import { useState } from "react";
import AccordionItem from "./AccordionItem";

const BuilderAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const handleToggle = (id: number) => {
    setOpenIndex((prevIndex) => (prevIndex === id ? null : id));
  };

  const handleAdvanceToNextStep = (nextStep) => {
    if (nextStep) {
      setOpenIndex(nextStep.id);
    } else {
      setOpenIndex(null);
    }
  };

  return (
    <div className="mt-10 overflow-hidden bg-white space-y-3.25">
      {BUILDER_STEPS.map((step, index) => {
        const nextStep = BUILDER_STEPS[index + 1];

        return (
          <AccordionItem
            key={step.id}
            step={step}
            isOpen={openIndex === step.id}
            onAdvance={() => handleAdvanceToNextStep(nextStep)}
            onToggle={() => handleToggle(step.id)}
            nextStepTitle={nextStep?.title}
          />
        );
      })}
    </div>
  );
};

export default BuilderAccordion;
