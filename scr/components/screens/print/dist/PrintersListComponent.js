"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_redux_1 = require("react-redux");
var printerSlice_1 = require("../../../redux/slices/printerSlice");
var colors_1 = require("../../../assets/colors/colors");
var react_native_loading_spinner_overlay_1 = require("react-native-loading-spinner-overlay");
var printNodeService_1 = require("../../../services/printNodeService");
var refresh_png_1 = require("../../../assets/images/icons/refresh.png");
var ErrorView_1 = require("../../elements/view/ErrorView");
var PrintersList = function () {
    var _a = react_1.useState([]), wifiPrinters = _a[0], setWifiPrinters = _a[1];
    var _b = react_1.useState([]), nodePrinters = _b[0], setNodePrinters = _b[1];
    var dispatch = react_redux_1.useDispatch();
    var _c = react_1.useState(true), loadingWifiPrinters = _c[0], setLoadingWifiPrinters = _c[1];
    var _d = react_1.useState(true), loadingNodePrinters = _d[0], setLoadingNodePrinters = _d[1];
    var _e = react_1.useState(false), loadingPrinter = _e[0], setLoadingPrinter = _e[1];
    var _f = react_1.useState(false), refreshing = _f[0], setRefreshing = _f[1];
    var _g = react_1.useState(false), error = _g[0], setError = _g[1];
    var selectedNodePrinter = react_redux_1.useSelector(function (state) { return state.printers.selectedNodePrinter; });
    var fetchPrinters = react_1.useCallback(function (withSpinner) { return __awaiter(void 0, void 0, void 0, function () {
        var timeout, printersList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (withSpinner)
                        setLoadingNodePrinters(true);
                    setError(false);
                    timeout = setTimeout(function () {
                        setLoadingNodePrinters(false);
                        setError(true);
                    }, 10000);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, printNodeService_1.getNodePrinters()];
                case 2:
                    printersList = _a.sent();
                    clearTimeout(timeout);
                    setNodePrinters(printersList);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    clearTimeout(timeout);
                    setError(true);
                    react_native_1.Alert.alert('Erreur', 'Impossible de récupérer les imprimantes.');
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingNodePrinters(false);
                    setRefreshing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    /* initial load */
    react_1.useEffect(function () {
        fetchPrinters(true);
        console.log('log', selectedNodePrinter.id);
    }, [fetchPrinters]);
    var triggerRefresh = function () {
        setRefreshing(true);
        fetchPrinters(false); // pas de spinner plein-écran
    };
    var onlinePrinters = nodePrinters.filter(function (printer) { return printer.state === 'online'; });
    var offlinePrinters = nodePrinters.filter(function (printer) { return printer.state === 'offline'; });
    var handleSelectNodePrinter = function (printer) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingPrinter(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!(selectedNodePrinter && selectedNodePrinter.name === printer.name)) return [3 /*break*/, 3];
                    return [4 /*yield*/, dispatch(printerSlice_1.deselectNodePrinterAsync()).unwrap()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, dispatch(printerSlice_1.selectNodePrinterAsync(printer)).unwrap()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    react_native_1.Alert.alert('Error', 'Operation failed. Try again.');
                    return [3 /*break*/, 8];
                case 7:
                    setLoadingPrinter(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        if (selectedNodePrinter) {
            console.log('[PrintersList] nouveau printer sélectionné :', selectedNodePrinter.id);
        }
    }, [selectedNodePrinter]);
    if (error) {
        return (react_1["default"].createElement(react_native_1.View, { style: { flex: 1 } },
            react_1["default"].createElement(ErrorView_1["default"], { handleRetry: function () { return fetchPrinters(true); } })));
    }
    return (react_1["default"].createElement(react_native_1.View, null,
        react_1["default"].createElement(react_native_loading_spinner_overlay_1["default"], { visible: loadingNodePrinters || loadingPrinter, textContent: "Loading..." }),
        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.imageContainee, onPress: triggerRefresh },
            react_1["default"].createElement(react_native_1.Image, { style: styles.reloadImage, source: refresh_png_1["default"] })),
        react_1["default"].createElement(react_native_1.View, { style: styles.container },
            react_1["default"].createElement(react_native_1.View, { style: styles.titleContainer },
                react_1["default"].createElement(react_native_1.View, { style: styles.onlineIndicator }),
                react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "Online Printers")),
            loadingNodePrinters ? (react_1["default"].createElement(react_native_1.Text, { style: styles.status }, "Loading printers...")) : onlinePrinters.length > 0 ? (react_1["default"].createElement(react_native_1.FlatList, { data: onlinePrinters, keyExtractor: function (item) { return item.id.toString(); }, refreshing: refreshing, onRefresh: triggerRefresh, style: { height: 230 }, renderItem: function (_a) {
                    var item = _a.item;
                    return (react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return handleSelectNodePrinter(item); }, style: [
                            styles.printerList,
                            {
                                backgroundColor: selectedNodePrinter && selectedNodePrinter.id === item.id
                                    ? colors_1["default"].detailsGreen
                                    : colors_1["default"].greyCream
                            },
                        ] },
                        react_1["default"].createElement(react_native_1.Text, { style: [
                                styles.name,
                                {
                                    color: selectedNodePrinter &&
                                        selectedNodePrinter.id === item.id
                                        ? 'white'
                                        : colors_1["default"].darkGrey,
                                    fontWeight: selectedNodePrinter &&
                                        selectedNodePrinter.id === item.id
                                        ? '800'
                                        : '400'
                                },
                            ] }, item.name || 'Unknown Printer'),
                        react_1["default"].createElement(react_native_1.Text, { style: [
                                styles.state,
                                {
                                    color: selectedNodePrinter &&
                                        selectedNodePrinter.id === item.id
                                        ? 'white'
                                        : colors_1["default"].darkGrey,
                                    fontWeight: selectedNodePrinter &&
                                        selectedNodePrinter.id === item.id
                                        ? '800'
                                        : '400'
                                },
                            ] }, "(" + item.state + ")")));
                } })) : (react_1["default"].createElement(react_native_1.Text, { style: styles.emptyMessage }, "No online printers available"))),
        react_1["default"].createElement(react_native_1.View, { style: styles.container },
            react_1["default"].createElement(react_native_1.View, { style: styles.titleContainer },
                react_1["default"].createElement(react_native_1.View, { style: styles.offlineIndicator }),
                react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "Offline Printers")),
            loadingNodePrinters ? (react_1["default"].createElement(react_native_1.Text, { style: styles.status }, "Loading printers...")) : offlinePrinters.length > 0 ? (react_1["default"].createElement(react_native_1.FlatList, { data: offlinePrinters, keyExtractor: function (item) { return item.id.toString(); }, style: { height: 230 }, renderItem: function (_a) {
                    var item = _a.item;
                    return (react_1["default"].createElement(react_native_1.View, { style: [
                            styles.printerList,
                            {
                                backgroundColor: colors_1["default"].greyCream
                            },
                        ] },
                        react_1["default"].createElement(react_native_1.Text, { style: [styles.name, { color: colors_1["default"].grey }] }, item.name || 'Unknown Printer')));
                } })) : (react_1["default"].createElement(react_native_1.Text, { style: styles.emptyMessage }, "No offline printers available")))));
};
var styles = react_native_1.StyleSheet.create({
    container: {
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 350
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    onlineIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'green',
        marginRight: 8
    },
    offlineIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'red',
        marginRight: 8
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors_1["default"].darkGrey
    },
    printerList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors_1["default"].greyCream,
        marginBottom: 10,
        padding: 10,
        borderRadius: 12
    },
    name: {
        fontSize: 16,
        fontWeight: '600'
    },
    state: {
        fontSize: 12,
        fontWeight: '200'
    },
    status: {
        color: colors_1["default"].darkGrey
    },
    emptyMessage: {
        fontSize: 16,
        color: colors_1["default"].darkGrey,
        textAlign: 'center',
        marginVertical: 10
    },
    reloadImage: {
        height: 30,
        width: 30,
        tintColor: colors_1["default"].green
    },
    imageContainee: {
        height: 30,
        width: 30,
        position: 'absolute',
        right: 25,
        top: -15,
        zIndex: 20
    }
});
exports["default"] = PrintersList;
