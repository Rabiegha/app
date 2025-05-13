"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var MainAttendeeList_1 = require("../../components/screens/attendees/mainAttendeeList/MainAttendeeList");
var ProgressBar_1 = require("../../components/elements/progress/ProgressBar");
var ProgressionText_1 = require("../../components/elements/progress/ProgressionText");
var MainHeader_1 = require("../../components/elements/header/MainHeader");
var EventContext_1 = require("../../context/EventContext");
var Search_1 = require("../../components/elements/Search");
var FiltreComponent_1 = require("../../components/filtre/FiltreComponent");
var react_redux_1 = require("react-redux");
var CheckinPrintModal_1 = require("../../components/elements/modals/CheckinPrintModal");
var useRegistrationData_1 = require("../../hooks/registration/useRegistrationData");
var refresh_png_1 = require("../../assets/images/icons/refresh.png");
var colors_1 = require("../../assets/colors/colors");
var Filtre_png_1 = require("../../assets/images/icons/Filtre.png");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var PrintStatusContext_1 = require("../../printing/context/PrintStatusContext");
var native_1 = require("@react-navigation/native");
var defaultFilterCriteria = {
    status: 'all',
    company: null
};
var AttendeeListScreen = function () {
    var listRef = react_1.useRef(null);
    var triggerChildRefresh = function () {
        var _a;
        (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.handleRefresh(); // 🟢 Appel direct de la méthode enfant
    };
    native_1.useFocusEffect(react_1.useCallback(function () {
        // 1) on déclenche la remise à jour des stats (useRegistrationData)
        setRefreshTrigger(function (p) { return p + 1; });
    }, []));
    var eventName = EventContext_1.useEvent().eventName;
    var _a = react_1.useState(0), refreshTrigger = _a[0], setRefreshTrigger = _a[1];
    var _b = react_1.useState(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = react_1.useState(false), modalVisible = _c[0], setModalVisible = _c[1];
    var modalAnimation = react_1.useState(new react_native_1.Animated.Value(-300))[0];
    var _d = react_1.useState(false), success = _d[0], setSuccess = _d[1];
    var _e = react_1.useState(defaultFilterCriteria), filterCriteria = _e[0], setFilterCriteria = _e[1];
    var _f = useRegistrationData_1["default"]({ refreshTrigger1: refreshTrigger }), totalAttendees = _f.totalAttendees, totalCheckedIn = _f.totalCheckedIn, totalNotCheckedIn = _f.totalNotCheckedIn, ratio = _f.ratio, summary = _f.summary;
    var dispatch = react_redux_1.useDispatch();
    var navigation = native_1.useNavigation();
    var _g = PrintStatusContext_1.usePrintStatus(), printStatus = _g.status, clearStatus = _g.clearStatus;
    var insets = react_native_safe_area_context_1.useSafeAreaInsets();
    var openModal = function () {
        setModalVisible(true);
        react_native_1.Animated.timing(modalAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };
    var closeModal = function () {
        react_native_1.Animated.timing(modalAnimation, {
            toValue: -300,
            duration: 300,
            useNativeDriver: true
        }).start(function () { return setModalVisible(false); });
    };
    var clearSearch = function () {
        if (searchQuery !== '') {
            setSearchQuery('');
        }
        else {
            navigation.goBack();
        }
    };
    var handleTriggerRefresh = function () {
        setRefreshTrigger(function (p) { return p + 1; });
    };
    var handleLeftPress = function () {
        if (filterCriteria.status === 'all' && !filterCriteria.company) {
            clearSearch();
        }
        else {
            setFilterCriteria(defaultFilterCriteria);
        }
    };
    return (react_1["default"].createElement(react_native_1.SafeAreaView, { style: { flex: 1, backgroundColor: 'white' } },
        react_1["default"].createElement(react_native_1.View, { style: { flex: 1 } },
            react_1["default"].createElement(MainHeader_1["default"], { onLeftPress: handleLeftPress, onRightPress: openModal, RightIcon: Filtre_png_1["default"], title: eventName }),
            react_1["default"].createElement(react_native_1.View, { style: [styles.mainContent, {
                        paddingTop: insets.top + 5
                    },] },
                react_1["default"].createElement(Search_1["default"], { style: styles.search, onChange: setSearchQuery, value: searchQuery }),
                react_1["default"].createElement(ProgressionText_1["default"], { totalCheckedAttendees: totalCheckedIn, totalAttendees: totalAttendees }),
                react_1["default"].createElement(ProgressBar_1["default"], { progress: ratio }),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.imageContainee, onPress: triggerChildRefresh },
                    react_1["default"].createElement(react_native_1.Image, { style: styles.reloadImage, source: refresh_png_1["default"] })),
                react_1["default"].createElement(MainAttendeeList_1["default"], { ref: listRef, searchQuery: searchQuery, onShowNotification: function () { return setSuccess(true); }, filterCriteria: filterCriteria, onTriggerRefresh: handleTriggerRefresh, summary: summary }),
                react_1["default"].createElement(react_native_1.Modal, { animationType: "none", transparent: true, visible: modalVisible, onRequestClose: closeModal },
                    react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.modalOverlay, activeOpacity: 1, onPressOut: closeModal },
                        react_1["default"].createElement(react_native_1.TouchableWithoutFeedback, null,
                            react_1["default"].createElement(react_native_1.Animated.View, { style: [styles.modalView, { transform: [{ translateX: modalAnimation }] }] },
                                react_1["default"].createElement(FiltreComponent_1["default"], { initialFilter: filterCriteria, defaultFilter: defaultFilterCriteria, onApply: function (newFilter) {
                                        setFilterCriteria(newFilter);
                                        closeModal();
                                    }, onCancel: function () {
                                        setFilterCriteria(defaultFilterCriteria);
                                        closeModal();
                                    }, tout: totalAttendees, checkedIn: totalCheckedIn, notChechkedIn: totalNotCheckedIn }))))),
                printStatus && (react_1["default"].createElement(CheckinPrintModal_1["default"], { visible: true, status: printStatus, onClose: clearStatus }))))));
};
var styles = react_native_1.StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    printModal: {
        flex: 1,
        position: 'absolute'
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0
    },
    notification: {
        zIndex: 50
    },
    reloadImage: {
        height: 30,
        width: 30,
        tintColor: colors_1["default"].green
    },
    imageContainee: {
        height: 40,
        width: 40,
        zIndex: 20,
        marginBottom: 10,
        marginLeft: 'auto'
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        position: 'relative'
    }
});
exports["default"] = AttendeeListScreen;
