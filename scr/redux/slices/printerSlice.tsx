import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedWiFiPrinter: [],
  selectedNodePrinter: null,
  defaultPrinter: null,
  printStatus: '',
  selectedOptions: {
    paperFormat: null,
    orientation: 'portrait',
    dpi: 300,
    color: true,
    duplex: 'none',
    copies: 1,
    autoPrint: true,
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
        dpi: 300,
        color: action.payload.capabilities.color || false,
        duplex: action.payload.capabilities.duplex ? 'none' : 'unsupported',
        copies: 1,
        autoPrint: false,
      };
    },

    //printerNode Printer actions
    selectNodePrinter: (state, action) => {
      state.selectedNodePrinter = action.payload;
      // Réinitialiser les options lors de la sélection d'une nouvelle imprimante
      state.selectedOptions = {
        paperFormat: null,
        orientation: 'portrait',
        dpi: 300,
        color: action.payload.capabilities.color || false,
        duplex: action.payload.capabilities.duplex ? 'none' : 'unsupported',
        copies: 1,
        autoPrint: false,
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
  setOption,
  resetStore,
} = printerSlice.actions;
export default printerSlice.reducer;
