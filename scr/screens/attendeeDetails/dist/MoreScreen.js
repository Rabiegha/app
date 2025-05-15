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
// MoreScreen.tsx
var react_1 = require("react");
var react_native_1 = require("react-native");
var axios_1 = require("axios");
var react_native_share_1 = require("react-native-share");
var react_redux_1 = require("react-redux");
var MoreComponent_1 = require("../../components/screens/MoreComponent");
var MainHeader_1 = require("../../components/elements/header/MainHeader");
var LoadingView_1 = require("../../components/elements/view/LoadingView");
var ErrorView_1 = require("../../components/elements/view/ErrorView");
var globalStyle_1 = require("../../assets/styles/globalStyle");
var colors_1 = require("../../assets/colors/colors");
var config_1 = require("../../config/config");
var usePrintDocument_1 = require("../../hooks/print/usePrintDocument");
var useAttendeeDetails_1 = require("../../hooks/attendee/useAttendeeDetails");
var EventContext_1 = require("../../context/EventContext");
var authSelectors_1 = require("../../redux/selectors/auth/authSelectors");
var CheckinPrintModal_1 = require("../../components/elements/modals/CheckinPrintModal");
var PrintStatusContext_1 = require("../../printing/context/PrintStatusContext");
var MoreScreen = function (_a) {
    var route = _a.route, navigation = _a.navigation;
    /* ---------------------------------------------------------------- */
    /* Context & Redux                                                 */
    /* ---------------------------------------------------------------- */
    var _b = EventContext_1.useEvent(), triggerListRefresh = _b.triggerListRefresh, updateAttendee = _b.updateAttendee;
    var _c = PrintStatusContext_1.usePrintStatus(), printStatus = _c.status, clearStatus = _c.clearStatus;
    var userId = react_redux_1.useSelector(authSelectors_1.selectCurrentUserId);
    var eventId = EventContext_1.useEvent().eventId;
    /* ---------------------------------------------------------------- */
    /* Navigation params                                                */
    /* ---------------------------------------------------------------- */
    var _d = route.params, attendeeId = _d.attendeeId, initialStatus = _d.attendeeStatus, badgePdfUrl = _d.badgePdfUrl, badgeImageUrl = _d.badgeImageUrl, type = _d.type;
    /* ---------------------------------------------------------------- */
    /* Local state                                                      */
    /* ---------------------------------------------------------------- */
    var _e = react_1.useState(0), refreshTrigger = _e[0], setRefreshTrigger = _e[1];
    var _f = react_1.useState(false), loadingButton = _f[0], setLoadingButton = _f[1];
    var _g = react_1.useState(initialStatus), localAttendeeStatus = _g[0], setLocalAttendeeStatus = _g[1];
    /* ---------------------------------------------------------------- */
    /* Data fetching                                                    */
    /* ---------------------------------------------------------------- */
    var _h = useAttendeeDetails_1["default"](refreshTrigger, attendeeId), attendeeDetails = _h.attendeeDetails, loading = _h.loading, error = _h.error;
    /* refresh helper */
    var triggerRefresh = react_1.useCallback(function () { return setRefreshTrigger(function (prev) { return prev + 1; }); }, []);
    /* ---------------------------------------------------------------- */
    /* Handlers                                                         */
    /* ---------------------------------------------------------------- */
    var handleBackPress = function () { return navigation.goBack(); };
    var handleBadgePress = function () {
        return navigation.navigate('Badge', { attendeeId: attendeeId, eventId: eventId, badgePdfUrl: badgePdfUrl, badgeImageUrl: badgeImageUrl });
    };
    var selectedNodePrinter = react_redux_1.useSelector(function (state) { return state.printers.selectedNodePrinter; });
    var nodePrinterId = selectedNodePrinter === null || selectedNodePrinter === void 0 ? void 0 : selectedNodePrinter.id;
    var printDocument = usePrintDocument_1["default"]().printDocument;
    var handlePrintDocument = function () { return printDocument(badgePdfUrl, nodePrinterId); };
    var sendPdf = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, react_native_share_1["default"].open({ url: badgePdfUrl, type: 'application/pdf' })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleButton = function (status) { return __awaiter(void 0, void 0, void 0, function () {
        var url, res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingButton(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    url = config_1.BASE_URL + "/update_event_attendee_attendee_status/?event_id=" + eventId + "&attendee_id=" + attendeeId + "&attendee_status=" + status;
                    return [4 /*yield*/, axios_1["default"].post(url)];
                case 2:
                    res = _a.sent();
                    if (res.data.status) {
                        setLocalAttendeeStatus(status);
                        triggerRefresh();
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    console.error('Error updating attendee status:', err_2);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingButton(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /* update parent lists when status changes */
    react_1.useEffect(function () {
        updateAttendee(eventId, localAttendeeStatus);
        triggerListRefresh();
    }, [localAttendeeStatus]);
    /* ---------------------------------------------------------------- */
    /* Render helpers                                                   */
    /* ---------------------------------------------------------------- */
    var renderContent = function () {
        if (loading) {
            return (react_1["default"].createElement(react_native_1.View, { style: styles.filler },
                react_1["default"].createElement(LoadingView_1["default"], null)));
        }
        if (error) {
            return (react_1["default"].createElement(react_native_1.View, { style: styles.filler },
                react_1["default"].createElement(ErrorView_1["default"], { handleRetry: triggerRefresh })));
        }
        return (react_1["default"].createElement(MoreComponent_1["default"], { See: handleBadgePress, firstName: attendeeDetails.firstName, lastName: attendeeDetails.lastName, email: attendeeDetails.email, phone: attendeeDetails.phone, JobTitle: attendeeDetails.jobTitle, attendeeStatus: localAttendeeStatus, organization: attendeeDetails.organization, commentaire: attendeeDetails.commentaire, attendeeId: attendeeId, attendeeStatusChangeDatetime: attendeeDetails.attendeeStatusChangeDatetime, handleButton: handleButton, share: sendPdf, Print: handlePrintDocument, loading: loadingButton, modify: function () { return navigation.navigate('Edit', { attendeeId: attendeeId, eventId: eventId }); }, type: type, onFieldUpdateSuccess: triggerRefresh }));
    };
    /* ---------------------------------------------------------------- */
    /* JSX                                                              */
    /* ---------------------------------------------------------------- */
    return (react_1["default"].createElement(react_native_1.View, { style: globalStyle_1["default"].backgroundWhite },
        react_1["default"].createElement(MainHeader_1["default"], { title: "Profil", color: colors_1["default"].darkGrey, onLeftPress: handleBackPress }),
        react_1["default"].createElement(react_native_1.View, { style: [globalStyle_1["default"].container, styles.profil] },
            printStatus && (react_1["default"].createElement(CheckinPrintModal_1["default"], { visible: true, status: printStatus, onClose: clearStatus })),
            renderContent())));
};
var styles = react_native_1.StyleSheet.create({
    profil: {
        height: 1700
    },
    filler: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
exports["default"] = MoreScreen;
