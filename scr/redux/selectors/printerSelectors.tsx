export const selectPaperFormat = state =>
  state.printers.selectedOptions.paperFormat;

export const selectOrientation = state =>
  state.printers.selectedOptions.orientation;

export const selectDpi = state => state.printers.selectedOptions.dpi;

export const selectAutoPrint = state =>
  state.printers.selectedOptions.autoPrint;
