import { create } from "zustand";
import { persist } from "zustand/middleware";
import data from "@/db.json"
import SELECTION_KEYS from "@/utils/selection-keys";

const useBuilderStore = create(
  persist(
    (set) => ({
      selections: {
        [SELECTION_KEYS.cameras]: [data.cameras[0].id, data.cameras[1].id],
        [SELECTION_KEYS.plans]: [data.plans[0].id],
        [SELECTION_KEYS.sensors]: [data.sensors[0].id, data.sensors[1].id],
        [SELECTION_KEYS.accessories]: [data.accessories[0].id],
      },

      setSelection: (category, items) =>
        set((state) => ({
          selections: {
            ...state.selections,
            [category]: items,
          },
        })),

    }),
    {
      name: "wyze-builder-storage", 
    },
  ),
);

export default useBuilderStore;
