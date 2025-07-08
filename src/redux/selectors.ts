import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export const scoresSelector = (state: RootState) =>
  state.scores.scores as Record<string, number>;

// export const filteredConfigsSelector = createSelector(
//   [savedConfigsSelector, filtersSelector],
//   (configs, filters) => {
//     let result = [...configs];
//
//     if (filters.positionX.length > 0) {
//       result = result.filter((config) =>
//         filters.positionX.some((filter) => {
//           if (config.config.interface.position === filter) return true;
//           if (config.config.button.positionX === filter) return true;
//           if (config.config.mobileButton.positionX === filter) return true;
//         }),
//       );
//     }
//     if (filters.positionY.length > 0) {
//       result = result.filter((config) =>
//         filters.positionY.some((filter) => {
//           if (config.config.button.positionY === filter) return true;
//           if (config.config.mobileButton.positionY === filter) return true;
//         }),
//       );
//     }
//     console.debug({ result, filters, configs });
//     return result;
//   },
// );
