"use strict";
// src/components/ScannerComponent.js
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
var native_1 = require("@react-navigation/native");
var react_native_camera_1 = require("react-native-camera");
var colors_1 = require("../../assets/colors/colors");
var EventContext_1 = require("../../context/EventContext");
var CustomMarker_1 = require("../elements/CustomMarker");
var ScanModal_1 = require("../elements/modals/ScanModal");
var scanAttendeeService_1 = require("../../services/scanAttendeeService");
var usePrintDocument_1 = require("../../hooks/print/usePrintDocument");
var react_redux_1 = require("react-redux");
var printerSelectors_1 = require("../../redux/selectors/print/printerSelectors");
var authSelectors_1 = require("../../redux/selectors/auth/authSelectors");
var useActiveEvent_1 = require("../../utils/event/useActiveEvent");
var MainHeader_1 = require("../elements/header/MainHeader");
var ScanComponent = function () {
    var navigation = native_1.useNavigation();
    var triggerListRefresh = EventContext_1.useEvent().triggerListRefresh;
    var eventId = useActiveEvent_1.useActiveEvent().eventId;
    var cameraRef = react_1.useRef(null);
    var scanAnimation = react_1.useRef(new react_native_1.Animated.Value(0)).current;
    var markerColor = react_1.useState('white')[0];
    var _a = react_1.useState(false), modalVisible = _a[0], setModalVisible = _a[1];
    var _b = react_1.useState(null), attendeeData = _b[0], setAttendeeData = _b[1];
    var _c = react_1.useState('idle'), scanStatus = _c[0], setScanStatus = _c[1];
    var sessionDetails = EventContext_1.useEvent().sessionDetails;
    var isSession = sessionDetails !== null;
    var userId = react_redux_1.useSelector(authSelectors_1.selectCurrentUserId);
    var selectedNodePrinter = react_redux_1.useSelector(function (state) { return state.printers.selectedNodePrinter; });
    var nodePrinterId = selectedNodePrinter === null || selectedNodePrinter === void 0 ? void 0 : selectedNodePrinter.id;
    var printDocument = usePrintDocument_1["default"]().printDocument;
    var printStatus = react_redux_1.useSelector(printerSelectors_1.selectPrintStatus);
    var autoPrint = react_redux_1.useSelector(printerSelectors_1.selectAutoPrint);
    react_1.useEffect(function () {
        var nodePrinterId = selectedNodePrinter === null || selectedNodePrinter === void 0 ? void 0 : selectedNodePrinter.id;
        console.log('Updated selectedNodePrinter in ScannerComponent:', nodePrinterId);
    }, [selectedNodePrinter]);
    //Remplacer ça:
    react_1.useEffect(function () {
        var unsubscribe = navigation.addListener('focus', function () {
            resetScanner();
        });
        console.log('isSession', isSession);
        return unsubscribe;
    }, [navigation]);
    //Par ça:
    /*   import { useFocusEffect } from '@react-navigation/native';
    
          useFocusEffect(
            React.useCallback(() => {
              resetScanner();
            }, [])
          ); */
    var resetScanner = function () {
        setAttendeeData(null);
        setModalVisible(false);
        setScanStatus('idle');
    };
    var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
    var hasScanned = react_1.useRef(false);
    var onBarCodeRead = function (_a) {
        var data = _a.data;
        return __awaiter(void 0, void 0, void 0, function () {
            var response, attendee, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (hasScanned.current)
                            return [2 /*return*/]; // Évite les scans multiples
                        hasScanned.current = true;
                        console.log("🔍 Scanned Data:", data);
                        if (scanStatus !== 'idle' || modalVisible) {
                            return [2 /*return*/];
                        }
                        setScanStatus('scanning');
                        return [4 /*yield*/, delay(500)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 13, , 15]);
                        return [4 /*yield*/, scanAttendeeService_1.scanAttendee(userId, eventId, data)];
                    case 3:
                        response = _b.sent();
                        console.log('API Response:', response);
                        if (!(response.status === true)) return [3 /*break*/, 10];
                        attendee = response.attendee_details;
                        setAttendeeData({
                            id: (attendee === null || attendee === void 0 ? void 0 : attendee.attendee_id) || 'N/A',
                            name: (attendee === null || attendee === void 0 ? void 0 : attendee.attendee_name) || 'Unknown Attendee'
                        });
                        setScanStatus('found');
                        return [4 /*yield*/, delay(500)];
                    case 4:
                        _b.sent();
                        setModalVisible(true);
                        setScanStatus('approved');
                        triggerListRefresh();
                        return [4 /*yield*/, delay(2000)];
                    case 5:
                        _b.sent();
                        if (!autoPrint) return [3 /*break*/, 8];
                        setScanStatus('printing');
                        return [4 /*yield*/, delay(3000)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, printDocument(attendee.attendee_id)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        resetScanner();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        setScanStatus('not_found');
                        return [4 /*yield*/, delay(3000)];
                    case 11:
                        _b.sent();
                        resetScanner();
                        _b.label = 12;
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        error_1 = _b.sent();
                        console.error('Error during scanning:', error_1);
                        setModalVisible(true);
                        setScanStatus('error');
                        return [4 /*yield*/, delay(3000)];
                    case 14:
                        _b.sent();
                        resetScanner();
                        return [3 /*break*/, 15];
                    case 15:
                        // Autorise un nouveau scan après 3 secondes
                        setTimeout(function () {
                            hasScanned.current = false;
                        }, 2000);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Réagir aux changements de printStatus et scanStatus
    react_1.useEffect(function () {
        if (scanStatus === 'printing') {
            console.log("Current printStatus: " + printStatus);
            if (printStatus === 'Print successful') {
                console.log('Print was successful.');
                setScanStatus('Print successful');
                // Garder le modal ouvert pour afficher le succès
                setTimeout(function () {
                    resetScanner();
                    navigation.navigate('AttendeesList');
                }, 2000); // 2 secondes pour afficher le message
            }
            else if (printStatus === 'Error printing') {
                console.log('Print encountered an error.');
                setScanStatus('Error printing');
                console.error('Printing failed, staying on the screen.');
                // Garder le modal ouvert pour afficher l'erreur
                setTimeout(function () {
                    resetScanner();
                }, 2000); // 2 secondes pour afficher le message d'erreur
            }
        }
    }, [printStatus, scanStatus, navigation]);
    // Gestion de la fermeture du modal
    var handleModalClose = function () {
        resetScanner();
        triggerListRefresh();
    };
    // Définition correcte de handleBackPress à l'intérieur du composant
    var handleBackPress = function () {
        navigation.goBack();
    };
    var headerStyles = isSession
        ? {
            backgroundColor: colors_1["default"].cyan,
            color: colors_1["default"].greyCream,
            leftButtonTintColor: colors_1["default"].greyCream
        }
        : {
            backgroundColor: 'white',
            color: colors_1["default"].darkGrey,
            leftButtonTintColor: colors_1["default"].green
        };
    return (react_1["default"].createElement(react_native_1.View, { style: styles.container },
        react_1["default"].createElement(MainHeader_1["default"], { title: "Scan QR Code", onLeftPress: handleBackPress, backgroundColor: headerStyles.backgroundColor, color: headerStyles.color, leftButtonTintColor: headerStyles.leftButtonTintColor }),
        react_1["default"].createElement(react_native_camera_1.RNCamera, { ref: cameraRef, style: styles.camera, onBarCodeRead: onBarCodeRead, captureAudio: false, type: react_native_camera_1.RNCamera.Constants.Type.back, flashMode: react_native_camera_1.RNCamera.Constants.FlashMode.off, androidCameraPermissionOptions: {
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel'
            } },
            react_1["default"].createElement(react_native_1.View, { style: styles.overlay },
                react_1["default"].createElement(CustomMarker_1["default"], { markerColor: markerColor, isScanning: scanStatus !== 'idle', scanAnimation: scanAnimation }),
                (scanStatus === 'not_found' || scanStatus === 'found') && (react_1["default"].createElement(react_native_1.View, { style: [
                        styles.popupContainer,
                        {
                            backgroundColor: scanStatus === 'not_found' ? colors_1["default"].red : colors_1["default"].green
                        },
                    ] },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.popupText }, scanStatus === 'not_found' ? 'Not found' : attendeeData === null || attendeeData === void 0 ? void 0 : attendeeData.name))))),
        react_1["default"].createElement(ScanModal_1["default"], { visible: modalVisible, onClose: handleModalClose, status: scanStatus })));
};
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    camera: {
        flex: 1
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    popupContainer: {
        backgroundColor: 'red',
        padding: 10,
        paddingHorizontal: 50,
        zIndex: 100,
        position: 'absolute',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    popupText: {
        color: 'white'
    }
});
exports["default"] = ScanComponent;
