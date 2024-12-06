import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedWiFiPrinter: [],
  selectedNodePrinter: null,
  defaultPrinter: null,
  printStatus: '',
  autoPrint: true,
  selectedOptions: {
    paperFormat: null,
    orientation: 'portrait',
    dpi: 600,
    color: true,
    duplex: 'none',
    copies: 1,
  },
};

// Actions asynchrones
export const selectNodePrinterAsync = createAsyncThunk(
  'printers/selectNodePrinterAsync',
  async (printer, {dispatch}) => {
    // Simuler un délai asynchrone
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dispatch de l'action synchrone
    dispatch(selectNodePrinter(printer));
  },
);

export const deselectNodePrinterAsync = createAsyncThunk(
  'printers/deselectNodePrinterAsync',
  async (_, {dispatch}) => {
    // Simuler un délai asynchrone
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dispatch de l'action synchrone
    dispatch(deselectNodePrinter());
  },
);

const printerSlice = createSlice({
  name: 'printers',
  initialState,
  reducers: {
    selectWiFiPrinter: (state, action) => {
      state.selectedWiFiPrinter.push(action.payload);
    },
    deselectWiFiPrinter: (state, action) => {
      state.selectedWiFiPrinter = state.selectedWiFiPrinter.filter(
        printer => printer.name !== action.payload.name,
      );
    },
    setDefaultWiFiPrinter: (state, action) => {
      state.defaultPrinter = action.payload;
      state.selectedOptions = {
        paperFormat: null,
        orientation: 'portrait',
        dpi: 600,
        color: action.payload.capabilities.color || false,
        duplex: action.payload.capabilities.duplex ? 'none' : 'unsupported',
        copies: 1,
      };
    },

    //printerNode Printer actions
    selectNodePrinter: (state, action) => {
      const printer = action.payload;
      state.selectedNodePrinter = printer;

      // Determine the default paper format based on printer capabilities
      const defaultPaperFormat =
        printer.capabilities?.paperFormats?.[0] || 'A4';

      // Réinitialiser les options lors de la sélection d'une nouvelle imprimante
      state.selectedOptions = {
        paperFormat: defaultPaperFormat,
        orientation: 'portrait',
        dpi: 600,
        color: action.payload.capabilities.color || false,
        duplex: action.payload.capabilities.duplex ? 'none' : 'unsupported',
        copies: 1,
      };
    },
    deselectNodePrinter: state => {
      state.selectedNodePrinter = null;
    },

    setDefaultNodePrinter: (state, action) => {
      state.defaultPrinter = action.payload;
    },

    // Statut d'impression
    setPrintStatus: (state, action) => {
      state.printStatus = action.payload;
    },

    //auto print

    setAutoPrint: (state, action) => {
      state.autoPrint = action.payload;
    },

    //les options

    setOption: (state, action) => {
      const {optionName, value} = action.payload;
      if (optionName in state.selectedOptions) {
        state.selectedOptions[optionName] = value;
      }
    },
    resetStore: () => initialState,
  },
});

export const {
  selectWiFiPrinter,
  deselectWiFiPrinter,
  setDefaultWiFiPrinter,
  selectNodePrinter,
  deselectNodePrinter,
  setDefaultNodePrinter,
  setPrintStatus,
  setAutoPrint,
  setOption,
  resetStore,
} = printerSlice.actions;
export default printerSlice.reducer;
