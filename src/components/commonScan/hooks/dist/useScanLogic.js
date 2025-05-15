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
exports.useScanLogic = void 0;
var react_1 = require("react");
var handleScan_1 = require("../utils/handleScan");
var react_native_toast_message_1 = require("react-native-toast-message");
var react_redux_1 = require("react-redux");
var useAddComment_1 = require("../../../hooks/edit/useAddComment");
var useFetchAttendeeCounts_1 = require("../../../hooks/attendee/useFetchAttendeeCounts");
var useSessionRegistrationSData_1 = require("../../../hooks/registration/useSessionRegistrationSData");
var scan_1 = require("../types/scan");
var useActiveEvent_1 = require("../../../utils/event/useActiveEvent");
var usePrintDocument_1 = require("../../../hooks/print/usePrintDocument");
var PrintStatusContext_1 = require("../../../printing/context/PrintStatusContext");
var useAttendeeDetails_1 = require("../../../hooks/attendee/useAttendeeDetails");
var getAttendeesListService_1 = require("../../../services/getAttendeesListService");
exports.useScanLogic = function (scanType, userId) {
    var hasScanned = react_1.useRef(false);
    var _a = react_1.useState(''), attendeeName = _a[0], setAttendeeName = _a[1];
    var _b = react_1.useState(null), attendeeData = _b[0], setAttendeeData = _b[1];
    var _c = react_1.useState(''), scanStatus = _c[0], setScanStatus = _c[1];
    var _d = react_1.useState(0), refreshTrigger = _d[0], setRefreshTrigger = _d[1];
    var _e = react_1.useState(false), modalVisible = _e[0], setModalVisible = _e[1];
    var _f = react_1.useState(''), comment = _f[0], setComment = _f[1];
    var _g = react_1.useState(false), showSuccess = _g[0], setShowSuccess = _g[1];
    var _h = react_1.useState(false), isButtonActive = _h[0], setIsButtonActive = _h[1];
    var eventId = useActiveEvent_1.useActiveEvent().eventId;
    var _j = useSessionRegistrationSData_1["default"]({ refreshTrigger1: refreshTrigger }), capacity = _j.capacity, totalCheckedIn = _j.totalCheckedIn, statsLoading = _j.loading;
    var _k = useFetchAttendeeCounts_1.useFetchAttendeeCounts(), partnerCount = _k.partnerCount, childSessionCount = _k.childSessionCount, loading = _k.loading, fetchCounts = _k.fetchCounts;
    var _l = react_1.useState(null), attendeeId = _l[0], setAttendeeId = _l[1];
    var attendeeDetails = useAttendeeDetails_1["default"](refreshTrigger, attendeeId || '').attendeeDetails;
    var selectedNodePrinter = react_redux_1.useSelector(function (state) { return state.printers.selectedNodePrinter; });
    var nodePrinterId = selectedNodePrinter === null || selectedNodePrinter === void 0 ? void 0 : selectedNodePrinter.id;
    var setStatus = PrintStatusContext_1.usePrintStatus().setStatus;
    var _m = useAddComment_1.useAddComment(), submitComment = _m.submitComment, addingComment = _m.loading, addCommentError = _m.error, resetAddError = _m.resetError;
    var printDocument = usePrintDocument_1["default"]().printDocument;
    var getBadgeUrl = function (userId, eventId, attendeeId) { return __awaiter(void 0, void 0, void 0, function () {
        var details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAttendeesListService_1.fetchAttendeesList(userId, eventId, attendeeId)];
                case 1:
                    details = (_a.sent())[0];
                    return [2 /*return*/, (details === null || details === void 0 ? void 0 : details.badge_pdf_url) || ''];
            }
        });
    }); };
    var resetScanner = function () {
        setAttendeeName('');
        setAttendeeData(null);
        setScanStatus('idle');
        setModalVisible(false);
        setComment('');
        hasScanned.current = false;
    };
    var onBarCodeRead = function (_a) {
        var data = _a.data;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (hasScanned.current)
                            return [2 /*return*/];
                        hasScanned.current = true;
                        return [4 /*yield*/, handleScan_1.handleScan({
                                data: data,
                                scanType: scanType,
                                userId: userId,
                                eventId: eventId,
                                setAttendeeData: setAttendeeData,
                                setAttendeeName: setAttendeeName,
                                setScanStatus: setScanStatus,
                                afterSuccess: function (attendee) { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a, badgeUrl;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                setScanStatus('found');
                                                setAttendeeId(attendee.id);
                                                _a = scanType;
                                                switch (_a) {
                                                    case scan_1.ScanType.Partner: return [3 /*break*/, 1];
                                                    case scan_1.ScanType.Session: return [3 /*break*/, 5];
                                                    case scan_1.ScanType.Main: return [3 /*break*/, 7];
                                                }
                                                return [3 /*break*/, 14];
                                            case 1: return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 1000); })];
                                            case 2:
                                                _b.sent();
                                                return [4 /*yield*/, fetchCounts(attendee.attendee_id)];
                                            case 3:
                                                _b.sent();
                                                return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 1000); })];
                                            case 4:
                                                _b.sent();
                                                setModalVisible(true);
                                                return [3 /*break*/, 14];
                                            case 5: return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 500); })];
                                            case 6:
                                                _b.sent();
                                                react_native_toast_message_1["default"].show({
                                                    type: 'customSuccess',
                                                    text1: attendee.attendee_name,
                                                    text2: 'a bien été enregistré'
                                                });
                                                setRefreshTrigger(function (prev) { return prev + 1; });
                                                setTimeout(function () {
                                                    resetScanner();
                                                }, 1000);
                                                return [3 /*break*/, 14];
                                            case 7:
                                                if (!isButtonActive) return [3 /*break*/, 9];
                                                return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 1000); })];
                                            case 8:
                                                _b.sent();
                                                setModalVisible(true);
                                                return [3 /*break*/, 13];
                                            case 9:
                                                setStatus('checkin_success');
                                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                            case 10:
                                                _b.sent();
                                                return [4 /*yield*/, getBadgeUrl(userId, eventId, attendee.id)];
                                            case 11:
                                                badgeUrl = _b.sent();
                                                return [4 /*yield*/, printDocument(badgeUrl, nodePrinterId)];
                                            case 12:
                                                _b.sent();
                                                setRefreshTrigger(function (prev) { return prev + 1; });
                                                setTimeout(function () {
                                                    resetScanner();
                                                }, 1500);
                                                _b.label = 13;
                                            case 13: return [3 /*break*/, 14];
                                            case 14: return [2 /*return*/];
                                        }
                                    });
                                }); },
                                afterFailure: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        setScanStatus('not_found');
                                        setTimeout(function () {
                                            hasScanned.current = false;
                                            resetScanner();
                                        }, 2000);
                                        return [2 /*return*/];
                                    });
                                }); }
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return {
        attendeeName: attendeeName,
        attendeeData: attendeeData,
        scanStatus: scanStatus,
        modalVisible: modalVisible,
        comment: comment,
        setComment: setComment,
        showSuccess: showSuccess,
        setShowSuccess: setShowSuccess,
        isButtonActive: isButtonActive,
        setIsButtonActive: setIsButtonActive,
        setModalVisible: setModalVisible,
        onBarCodeRead: onBarCodeRead,
        resetScanner: resetScanner,
        capacity: capacity,
        totalCheckedIn: totalCheckedIn,
        partnerCount: partnerCount,
        childSessionCount: childSessionCount,
        loading: loading,
        addingComment: addingComment,
        addCommentError: addCommentError,
        resetAddError: resetAddError,
        submitComment: submitComment
    };
};
