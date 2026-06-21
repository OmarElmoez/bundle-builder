import { BUILDER_STEPS } from "@/constants";
import ProductList from "./ProductList";
import getStatusText from "@/utils/getStatusText";
import useBuilderStore from "@/store/useBuilderStore";

const totalSteps = BUILDER_STEPS.length;

const AccordionItem = ({
  step,
  isOpen,
  onToggle,
  onAdvance,
  nextStepTitle,
}) => {

    const selections = useBuilderStore((state) => state.selections);

  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? "bg-[#EDF4FF] pt-3.75" : "bg-white"
      } ${isOpen && "rounded-[10px]"}`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left flex flex-col gap-1.25 focus:outline-none cursor-pointer"
      >
        <span className="text-[10px] lg:text-[12px] tracking-widest px-3.75 text-gray-500 uppercase font-bold">
          {`STEP ${step?.id} OF ${totalSteps}`}
        </span>

        <div
          className={`flex items-center justify-between py-5 px-3.75 border-[0.5px] border-[#1F1F1F] border-r-0 border-l-0
          ${isOpen && "border-b-0"}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center text-gray-600 transition-all duration-300 ease-in-out w-5 h-5 md:w-6.5 md:h-6.5 lg:w-7.5 lg:h-7.5`}
            >
              <img src={step.icon} alt="" />
            </div>

            <h2
              className={`font-semibold text-gray-900 transition-all duration-300 ease-in-out text-[18px] md:text-[22px] lg:text-[28px]`}
            >
              {step.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[#4E2FD2] text-sm">
            <span className="text-sm font-bold">{getStatusText(selections, step.selectionKey)}</span>
            <img
              src="/assets/icons/carrotArrow.svg"
              className={`transition-all duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
              alt=""
            />
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-200 opacity-100 pb-6 px-3.75" : "max-h-0 opacity-0"
        }`}
      >
        <ProductList category={step.selectionKey} />
        {nextStepTitle && (
          <div className="flex justify-center mt-3.75">
            <button
              onClick={onAdvance}
              className="w-66.5 py-1.25 cursor-pointer text-[#4E2FD2] text-[18px] border border-[#4E2FD2] rounded-[7px] font-semibold"
            >
              Next: {nextStepTitle}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionItem;
