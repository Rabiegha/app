"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var colors_1 = require("../../../assets/colors/colors");
var LargeButton_1 = require("../../elements/buttons/LargeButton");
var Acceder_png_1 = require("../../../assets/images/icons/Acceder.png");
var Switch_1 = require("../../elements/Switch");
var slider_1 = require("@react-native-community/slider");
var Paysage_png_1 = require("../../../assets/images/icons/Paysage.png");
var Portrait_png_1 = require("../../../assets/images/icons/Portrait.png");
var native_1 = require("@react-navigation/native");
var react_redux_1 = require("react-redux");
var printerSlice_1 = require("../../../redux/slices/printerSlice");
var printerSelectors_1 = require("../../../redux/selectors/print/printerSelectors");
var PrintComponent = function (_a) {
    var navigateBack = _a.navigateBack;
    var navigation = native_1.useNavigation();
    var dispatch = react_redux_1.useDispatch();
    //navigation
    var navigateToPrinters = function () {
        navigation.navigate('Printers');
    };
    var navigateToPaperFormat = function () {
        navigation.navigate('PaperFormat');
    };
    var selectedNodePrinter = react_redux_1.useSelector(function (state) { return state.printers.selectedNodePrinter; });
    // Sélecteurs Redux
    var orientation = react_redux_1.useSelector(printerSelectors_1.selectOrientation);
    var dpi = react_redux_1.useSelector(printerSelectors_1.selectDpi);
    var autoPrint = react_redux_1.useSelector(printerSelectors_1.selectAutoPrint);
    var dpiPercentage = Math.round((dpi * 100) / 600);
    // Fonction pour gérer le toggle du switch Auto Print
    var handleSwitchToggle = function () {
        dispatch(printerSlice_1.setAutoPrint(!autoPrint));
    };
    //options
    // Fonction pour sélectionner l'orientation
    var handleSelectOrientation = function (value) {
        dispatch(printerSlice_1.setOption({ optionName: 'orientation', value: value }));
        console.log('Orientation sélectionnée:', value);
    };
    // Fonction pour sélectionner le DPI
    var dpiValues = [0, 150, 300, 450, 600];
    var handleSelectDpi = function (valueIndex) {
        if (valueIndex < 1) {
            // Prevent selecting values below 25%
            valueIndex = 1;
        }
        var selectedDpi = dpiValues[valueIndex]; // Map index to DPI value
        dispatch(printerSlice_1.setOption({ optionName: 'dpi', value: selectedDpi }));
    };
    var getResolutionText = function (dpiPercentage) {
        if (dpiPercentage === 0) {
            return 'Très basse résolution';
        }
        else if (dpiPercentage <= 25) {
            return 'Basse résolution';
        }
        else if (dpiPercentage <= 50) {
            return 'Résolution moyenne';
        }
        else if (dpiPercentage <= 75) {
            return 'Haute résolution';
        }
        else {
            return 'Très haute résolution';
        }
    };
    return (react_1["default"].createElement(react_native_1.View, { style: styles.container },
        react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: navigateToPrinters, style: [
                styles.listItemContainer,
                { flexDirection: 'row', height: 50, alignItems: 'center' },
            ] },
            react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "Imprimantes"),
            react_1["default"].createElement(react_native_1.View, { style: styles.backButton },
                react_1["default"].createElement(react_native_1.Image, { source: Acceder_png_1["default"], resizeMode: "contain", style: {
                        width: 16,
                        height: 16,
                        tintColor: colors_1["default"].darkGrey
                    } }))),
        react_1["default"].createElement(react_native_1.View, { style: [
                styles.listItemContainer,
                { flexDirection: 'row', paddingTop: 17 },
            ] },
            react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "Orientation"),
            react_1["default"].createElement(react_native_1.View, { style: styles.orientationButtons },
                react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return handleSelectOrientation('portrait'); }, style: [
                        styles.buttonWrapper,
                        orientation === 'portrait'
                            ? {
                                backgroundColor: colors_1["default"].lighterGreen,
                                borderColor: colors_1["default"].green
                            }
                            : { backgroundColor: colors_1["default"].grey, borderColor: colors_1["default"].darkGrey },
                    ] },
                    react_1["default"].createElement(react_native_1.Text, { style: {
                            color: orientation === 'portrait' ? colors_1["default"].green : colors_1["default"].darkGrey,
                            fontWeight: '200',
                            textAlign: 'center'
                        } }, "Portrait"),
                    react_1["default"].createElement(react_native_1.View, { style: styles.backButton },
                        react_1["default"].createElement(react_native_1.Image, { source: Portrait_png_1["default"], style: [
                                styles.buttonImage,
                                {
                                    tintColor: orientation === 'portrait'
                                        ? colors_1["default"].green
                                        : colors_1["default"].darkGrey
                                },
                            ] }))),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return handleSelectOrientation('landscape'); }, style: [
                        styles.buttonWrapper,
                        orientation === 'landscape'
                            ? {
                                backgroundColor: colors_1["default"].lighterGreen,
                                borderColor: colors_1["default"].green
                            }
                            : { backgroundColor: colors_1["default"].grey, borderColor: colors_1["default"].darkGrey },
                    ] },
                    react_1["default"].createElement(react_native_1.Text, { style: {
                            color: orientation === 'landscape' ? colors_1["default"].green : colors_1["default"].darkGrey,
                            fontWeight: '200',
                            textAlign: 'center'
                        } }, "Paysage"),
                    react_1["default"].createElement(react_native_1.View, { style: styles.backButton },
                        react_1["default"].createElement(react_native_1.Image, { source: Paysage_png_1["default"], style: [
                                styles.buttonImage,
                                {
                                    tintColor: orientation === 'landscape'
                                        ? colors_1["default"].green
                                        : colors_1["default"].darkGrey
                                },
                            ] }))))),
        react_1["default"].createElement(react_native_1.View, { style: [
                styles.listItemContainer,
                { flexDirection: 'row', height: 50, alignItems: 'center' },
            ] },
            react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "Auto Print"),
            react_1["default"].createElement(Switch_1["default"], { value: autoPrint, onValueChange: handleSwitchToggle })),
        react_1["default"].createElement(react_native_1.View, { style: [
                styles.listItemContainer,
                { flexDirection: 'column', paddingTop: 17, marginBottom: 25 },
            ] },
            react_1["default"].createElement(react_native_1.View, { style: styles.ResolutionWrapper },
                react_1["default"].createElement(react_native_1.Text, { style: styles.title },
                    "Qualit\u00E9 d'impression: ",
                    dpiPercentage,
                    "%"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.textResolution }, getResolutionText(dpiPercentage))),
            react_1["default"].createElement(slider_1["default"], { style: { width: '100%', marginBottom: 0 }, minimumValue: 0, maximumValue: dpiValues.length - 1, minimumTrackTintColor: colors_1["default"].green, maximumTrackTintColor: colors_1["default"].darkGrey, step: 1, value: dpiValues.indexOf(dpi), onValueChange: function (valueIndex) { return handleSelectDpi(valueIndex); } })),
        react_1["default"].createElement(LargeButton_1["default"], { title: 'Appliquer', onPress: navigateBack, backgroundColor: colors_1["default"].green, loading: undefined })));
};
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    listItemContainer: {
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: colors_1["default"].greyCream,
        borderRadius: 10,
        padding: 10,
        marginBottom: 12
    },
    ResolutionWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    title: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors_1["default"].darkGrey
    },
    textResolution: {
        fontWeight: '200',
        fontSize: 11
    },
    itemName: {
        fontSize: 18,
        top: 50
    },
    orientationButtons: {
        flexDirection: 'row'
    },
    buttonWrapper: {
        justifyContent: 'center',
        borderRadius: 5,
        marginLeft: 10,
        padding: 15,
        borderWidth: 1
    },
    buttonImage: {
        height: 60,
        width: 60,
        marginTop: 10,
        marginBottom: 10
    }
});
exports["default"] = PrintComponent;
