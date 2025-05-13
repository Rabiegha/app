"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var colors_1 = require("../../../../assets/colors/colors");
var EventContext_1 = require("../../../../context/EventContext");
var Swipeable_1 = require("react-native-gesture-handler/Swipeable");
var Accepted_png_1 = require("../../../../assets/images/icons/Accepted.png");
var react_redux_1 = require("react-redux");
var usePrintDocument_1 = require("../../../../hooks/print/usePrintDocument");
var useAttendeeDetails_1 = require("../../../../hooks/attendee/useAttendeeDetails");
var PrintStatusContext_1 = require("../../../../printing/context/PrintStatusContext");
var width = react_native_1.Dimensions.get('window').width;
var openSwipeableRef = null;
var isTypeModeActive = true;
var ListItem = react_1["default"].memo(function (_a) {
    var item = _a.item, _b = _a.searchQuery, searchQuery = _b === void 0 ? '' : _b, onUpdateAttendee = _a.onUpdateAttendee, onSwipeableOpen = _a.onSwipeableOpen;
    var navigation = native_1.useNavigation();
    var triggerListRefresh = EventContext_1.useEvent().triggerListRefresh;
    var swipeableRef = react_1.useRef(null);
    var dispatch = react_redux_1.useDispatch();
    var isSwipeOpen = react_1.useRef(false);
    var _c = react_1.useState(0), refreshTrigger = _c[0], setRefreshTrigger = _c[1];
    var selectedNodePrinter = react_redux_1.useSelector(function (state) { return state.printers.selectedNodePrinter; });
    var nodePrinterId = selectedNodePrinter === null || selectedNodePrinter === void 0 ? void 0 : selectedNodePrinter.id;
    var setStatus = PrintStatusContext_1.usePrintStatus().setStatus;
    // Redux: whether to show the company name in search
    var isSearchByCompanyMode = true;
    // Local "checked in" state
    var initialSwitchState = item.attendee_status == 1;
    var _d = react_1.useState(initialSwitchState), isCheckedIn = _d[0], setIsCheckedIn = _d[1];
    var attendeeDetails = useAttendeeDetails_1["default"](refreshTrigger, item.id).attendeeDetails;
    // Toggle attendee_status
    var handleSwitchToggle = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newAttendeeStatus, updatedAttendee, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    newAttendeeStatus = item.attendee_status == 1 ? 0 : 1;
                    setIsCheckedIn(newAttendeeStatus == 1);
                    updatedAttendee = __assign(__assign({}, item), { attendee_status: newAttendeeStatus });
                    return [4 /*yield*/, onUpdateAttendee(updatedAttendee)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error updating attendee status:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Print & Check-In
    var printDocument = usePrintDocument_1["default"]().printDocument;
    var handlePrintAndCheckIn = function () { return __awaiter(void 0, void 0, void 0, function () {
        var updatedAttendee, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    updatedAttendee = __assign(__assign({}, item), { attendee_status: 1 });
                    setIsCheckedIn(true);
                    return [4 /*yield*/, onUpdateAttendee(updatedAttendee)];
                case 1:
                    _a.sent();
                    setStatus('checkin_success');
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    _a.sent();
                    printDocument(item.badge_pdf_url, nodePrinterId);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error while printing and checking in:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Navigate to "More" screen on item press
    var handleItemPress = function () {
        navigation.navigate('More', {
            attendeeId: item.id,
            eventId: item.event_id,
            firstName: item.first_name,
            lastName: item.last_name,
            email: item.email,
            phone: item.phone,
            attendeeStatus: item.attendee_status,
            jobTitle: item.designation,
            organization: item.organization,
            type: item.attendee_type_name,
            typeId: item.attendee_type_id,
            badgePdfUrl: item.badge_pdf_url,
            badgeImageUrl: item.badge_image_url,
            attendeeTypeBackgroundColor: item.attendee_type_background_color,
            attendeeStatusChangeDatetime: item.attendee_status_change_datetime
        });
    };
    /**
     * Highlights search matches in green + bold.
     * If `searchQuery` is empty, just return the original text.
     * Otherwise, split out the matched parts and wrap them in <Text> with a highlight style.
     */
    var highlightSearch = function (text, query) {
        // If no query, just return text as a single array item
        var safeQuery = (query || '').trim();
        if (!safeQuery) {
            return [text];
        }
        // Build regex for the query
        var regex = new RegExp("(" + safeQuery + ")", 'gi');
        // Split the text by the matched portions
        var parts = text.split(regex);
        // Map each part to either a highlighted <Text> or a normal <Text>
        return parts.filter(Boolean).map(function (part, index) {
            var isMatch = regex.test(part);
            if (isMatch) {
                return (react_1["default"].createElement(react_native_1.Text, { key: index, style: styles.highlight }, part));
            }
            return react_1["default"].createElement(react_native_1.Text, { key: index }, part);
        });
    };
    /**
     * Render the attendee's name and (optionally) their company in *separate* Text elements,
     * so you can style them differently.
     */
    var renderNameWithOptionalCompany = function () {
        // Build up the highlighted name
        var nameHighlighted = highlightSearch(item.first_name + " " + item.last_name, searchQuery);
        // Decide if we should show company, highlight it if we do
        var shouldShowCompany = isSearchByCompanyMode && item.organization && searchQuery.trim() !== '';
        if (shouldShowCompany) {
            var companyHighlighted = highlightSearch(item.organization, searchQuery);
            return (react_1["default"].createElement(react_native_1.View, { style: styles.nameRow },
                react_1["default"].createElement(react_native_1.Text, { style: styles.nameText }, nameHighlighted),
                react_1["default"].createElement(react_native_1.Text, { style: [styles.companyParen] }, " ("),
                react_1["default"].createElement(react_native_1.Text, { style: styles.companyText }, companyHighlighted),
                react_1["default"].createElement(react_native_1.Text, { style: styles.companyParen }, ")")));
        }
        else {
            // If not showing the company, just render the name
            return (react_1["default"].createElement(react_native_1.View, { style: styles.nameRow },
                react_1["default"].createElement(react_native_1.Text, { style: styles.nameText }, nameHighlighted)));
        }
    };
    // Swipe actions (Print + Check)
    var renderRightActions = react_1.useCallback(function (progress, dragX) {
        var action1TranslateX = dragX.interpolate({
            inputRange: [-145, -80, 0],
            outputRange: [0, 50, 100],
            extrapolate: 'clamp'
        });
        var action2TranslateX = dragX.interpolate({
            inputRange: [-145, -80, 0],
            outputRange: [0, 0, 50],
            extrapolate: 'clamp'
        });
        return (react_1["default"].createElement(react_native_1.View, { style: styles.actionsContainer },
            react_1["default"].createElement(react_native_1.Animated.View, { style: [
                    styles.rightAction,
                    { transform: [{ translateX: action1TranslateX }] },
                ] },
                react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: handlePrintAndCheckIn, style: [
                        styles.rightActionButton,
                        { backgroundColor: colors_1["default"].darkGrey, zIndex: 10 },
                    ] },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionText }, "Print"))),
            react_1["default"].createElement(react_native_1.Animated.View, { style: [
                    styles.rightAction,
                    { transform: [{ translateX: action2TranslateX }] },
                ] },
                react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: handleSwitchToggle, style: [
                        styles.rightActionButton,
                        { backgroundColor: isCheckedIn ? colors_1["default"].red : colors_1["default"].green },
                    ] },
                    react_1["default"].createElement(react_native_1.Text, { style: [styles.actionText, { zIndex: 5 }] }, isCheckedIn ? 'Uncheck' : 'Check')))));
    }, [isCheckedIn]);
    return (react_1["default"].createElement(Swipeable_1["default"], { ref: swipeableRef, renderRightActions: renderRightActions, friction: 1, enableTrackpadTwoFingerGesture: true, overshootRight: false, onSwipeableWillOpen: function () {
            isSwipeOpen.current = true;
            // Close any previously opened Swipeable
            if (openSwipeableRef && openSwipeableRef !== swipeableRef.current) {
                openSwipeableRef.close();
            }
            openSwipeableRef = swipeableRef.current;
            onSwipeableOpen === null || onSwipeableOpen === void 0 ? void 0 : onSwipeableOpen(swipeableRef);
        } },
        react_1["default"].createElement(react_native_1.TouchableWithoutFeedback, { onPress: handleItemPress, accessible: false },
            react_1["default"].createElement(react_native_1.View, { style: styles.listItemContainer },
                react_1["default"].createElement(react_native_1.View, { style: styles.contentContainer }, renderNameWithOptionalCompany()),
                isCheckedIn && !isTypeModeActive ? (react_1["default"].createElement(react_native_1.Image, { source: Accepted_png_1["default"], resizeMode: "contain", style: styles.checkedIcon })) : (react_1["default"].createElement(react_native_1.View, { style: styles.emptyIconSpace })),
                isTypeModeActive && (react_1["default"].createElement(react_native_1.View, { style: [
                        styles.attendeeTypeIndicator,
                        { backgroundColor: item.attendee_type_background_color || colors_1["default"].grey }
                    ] }, isCheckedIn ? (react_1["default"].createElement(react_native_1.Image, { source: Accepted_png_1["default"], resizeMode: "contain", style: styles.checkedIconInsideIndicator })) : (react_1["default"].createElement(react_native_1.View, { style: styles.emptyIconSpace }))))))));
});
exports["default"] = ListItem;
var styles = react_native_1.StyleSheet.create({
    listItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors_1["default"].greyCream,
        borderRadius: 10,
        marginBottom: 10,
        height: 70,
        overflow: 'hidden'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    // Base text style for the attendee's name
    nameText: {
        fontSize: 16,
        color: colors_1["default"].darkGrey
    },
    // Parentheses around company
    companyParen: {
        fontSize: 12,
        color: colors_1["default"].grey,
        fontStyle: 'italic'
    },
    // Text style specifically for the company name
    companyText: {
        fontSize: 12,
        color: colors_1["default"].grey,
        fontStyle: 'italic'
    },
    // Style for highlighted portions of the text
    highlight: {
        color: colors_1["default"].green,
        fontWeight: 'bold'
    },
    checkedIcon: {
        width: 20,
        height: 20,
        margin: 20
    },
    emptyIconSpace: {
        width: 20,
        height: 20
    },
    actionsContainer: {
        width: 160,
        flexDirection: 'row'
    },
    rightAction: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    rightActionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderRadius: 10,
        marginBottom: 10,
        marginLeft: 10,
        width: 70
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12
    },
    attendeeTypeIndicator: {
        width: 50,
        height: '150%',
        marginLeft: 10,
        marginRight: -8,
        transform: [{ rotate: '20deg' }],
        /*     opacity: 0.5, */
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkedIconInsideIndicator: {
        width: 15,
        height: 15,
        tintColor: 'white'
    }
});
