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
var buffer_1 = require("buffer");
var react_native_fs_1 = require("react-native-fs");
var useNodePrint_1 = require("./useNodePrint");
var PrintStatusContext_1 = require("../../printing/context/PrintStatusContext");
var usePrintDocument = function () {
    var sendPrintJob = useNodePrint_1.useNodePrint().sendPrintJob;
    var _a = react_1.useState(false), loading = _a[0], setLoading = _a[1];
    var _b = react_1.useState(null), error = _b[0], setError = _b[1];
    var _c = react_1.useState(''), message = _c[0], setMessage = _c[1];
    var _d = react_1.useState(false), success = _d[0], setSuccess = _d[1];
    var _e = PrintStatusContext_1.usePrintStatus(), printStatus = _e.status, setStatus = _e.setStatus, clearStatus = _e.clearStatus;
    var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
    var arrayBufferToBase64 = function (buffer) {
        return buffer_1.Buffer.from(buffer).toString('base64');
    };
    var fetchDocumentAsBase64 = function (url) { return __awaiter(void 0, void 0, Promise, function () {
        var localPath, response, buffer, fetchErr_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!url.startsWith('file://')) return [3 /*break*/, 2];
                    localPath = url.replace('file://', '');
                    return [4 /*yield*/, react_native_fs_1["default"].readFile(localPath, 'base64')];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch(url)];
                case 3:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("\u00C9chec de r\u00E9cup\u00E9ration du document: " + response.statusText);
                    return [4 /*yield*/, response.arrayBuffer()];
                case 4:
                    buffer = _a.sent();
                    return [2 /*return*/, arrayBufferToBase64(buffer)];
                case 5:
                    fetchErr_1 = _a.sent();
                    setStatus('fetch_failed');
                    throw new Error((fetchErr_1 === null || fetchErr_1 === void 0 ? void 0 : fetchErr_1.message) || 'Erreur réseau lors de la récupération du PDF.');
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var printDocument = react_1.useCallback(function (documentUrl, printerId) { return __awaiter(void 0, void 0, void 0, function () {
        var base64, cleanedBase64, err_1, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    setMessage('');
                    setSuccess(false);
                    setStatus('printing');
                    console.log('selected printer', printerId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 7, 8]);
                    if (!printerId) {
                        setStatus('no_printer');
                        throw new Error('Aucune imprimante sélectionnée.');
                    }
                    console.log('[printDocument] documentUrl:', documentUrl);
                    return [4 /*yield*/, fetchDocumentAsBase64(documentUrl)];
                case 2:
                    base64 = _a.sent();
                    cleanedBase64 = buffer_1.Buffer.from(buffer_1.Buffer.from(base64, 'base64')).toString('base64');
                    return [4 /*yield*/, sendPrintJob(cleanedBase64, printerId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, delay(1000)];
                case 4:
                    _a.sent();
                    setSuccess(true);
                    setStatus('success');
                    setMessage('Document imprimé avec succès.');
                    return [3 /*break*/, 8];
                case 5:
                    err_1 = _a.sent();
                    return [4 /*yield*/, delay(1000)];
                case 6:
                    _a.sent();
                    msg = (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || 'Erreur inconnue lors de l’impression.';
                    console.error('[printDocument] error:', msg);
                    setError(msg);
                    setMessage(msg);
                    setTimeout(function () {
                        setStatus(function (prev) {
                            var knownErrors = [
                                'no_printer',
                                'file_not_found',
                                'fetch_failed',
                                'printing',
                                'success',
                            ];
                            return knownErrors.includes(prev) ? prev : 'unknown_error';
                        });
                    }, 100);
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    setTimeout(function () { return clearStatus(); }, 3000); // Allow some time for user feedback
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [sendPrintJob, setStatus, clearStatus]);
    return {
        printDocument: printDocument,
        loading: loading,
        error: error,
        message: message,
        success: success,
        printStatus: printStatus
    };
};
exports["default"] = usePrintDocument;
