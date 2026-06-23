import SELECTION_KEYS from "@/utils/selection-keys";
import type { BuilderStep } from "@/types/builder";

export const BUILDER_STEPS = [
  {
    id: 1,
    title: 'Choose your cameras',
    icon: "/assets/icons/livestream.svg",
    selectionKey: SELECTION_KEYS.cameras,
  },
  {
    id: 2,
    title: 'Choose your plan',
    status: '1 selected',
    icon: "/assets/icons/shield.svg",
    selectionKey: SELECTION_KEYS.plans,
  },
  {
    id: 3,
    title: 'Choose your sensors',
    status: '2 selected',
    icon: "/assets/icons/sensor.svg",
    selectionKey: SELECTION_KEYS.sensors,
  },
  {
    id: 4,
    title: 'Add extra protection',
    status: '1 selected',
    icon: "/assets/icons/protection.svg",
    selectionKey: SELECTION_KEYS.accessories,
  }
] satisfies BuilderStep[];
