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
exports.mapAttendeeToDetails = exports.updateAttendeeField = exports.updateAttendeeStatus = exports.fetchAttendees = void 0;
var handleApiError_1 = require("../../utils/api/handleApiError");
var cleanParams_1 = require("../../utils/api/cleanParams");
var mainApi_1 = require("../../config/mainApi");
var config_1 = require("../../config/config");
/**
 * Fetch attendees list with optional filtering
 */
exports.fetchAttendees = function (_a) {
    var userId = _a.userId, eventId = _a.eventId, attendeeId = _a.attendeeId, attendeeStatus = _a.attendeeStatus;
    return __awaiter(void 0, void 0, Promise, function () {
        var params, response, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    // Validate required parameters
                    if (!userId) {
                        console.warn('Missing userId in fetchAttendees');
                    }
                    if (!eventId) {
                        console.warn('Missing eventId in fetchAttendees');
                    }
                    if (!attendeeId) {
                        console.warn('Missing attendeeId in fetchAttendees');
                    }
                    params = cleanParams_1.cleanParams({
                        current_user_login_details_id: userId,
                        event_id: eventId,
                        attendee_id: attendeeId,
                        attendee_status: attendeeStatus
                    });
                    console.log('Params sent to API:', params);
                    console.log('Full API URL:', config_1.BASE_URL + "/ajax_get_event_attendee_details/?current_user_login_details_id=" + userId + "&event_id=" + eventId + "&attendee_id=" + attendeeId);
                    return [4 /*yield*/, mainApi_1["default"].get('/ajax_get_event_attendee_details/', {
                            params: params,
                            timeout: 10000 // 10 second timeout
                        })];
                case 1:
                    response = _b.sent();
                    if (!response.data) {
                        console.error('No data received from API');
                        return [2 /*return*/, []];
                    }
                    if (!response.data.event_attendee_details) {
                        console.error('No event_attendee_details in response');
                        return [2 /*return*/, []];
                    }
                    if (!Array.isArray(response.data.event_attendee_details)) {
                        console.error('event_attendee_details is not an array');
                        return [2 /*return*/, []];
                    }
                    if (response.data.event_attendee_details.length === 0) {
                        console.warn('Empty attendee list returned');
                    }
                    else {
                        console.log('Attendee list received from API:', response.data.event_attendee_details);
                    }
                    return [2 /*return*/, response.data.event_attendee_details];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error in fetchAttendees:', error_1);
                    handleApiError_1.handleApiError(error_1, 'Failed to fetch event attendee list');
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
};
/**
 * Update attendee status (check-in/check-out)
 */
exports.updateAttendeeStatus = function (_a) {
    var userId = _a.userId, eventId = _a.eventId, attendeeId = _a.attendeeId, status = _a.status;
    return __awaiter(void 0, void 0, Promise, function () {
        var params, response, error_2;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    params = cleanParams_1.cleanParams({
                        current_user_login_details_id: userId,
                        event_id: eventId,
                        attendee_id: attendeeId,
                        attendee_status: status
                    });
                    return [4 /*yield*/, mainApi_1["default"].post('/update_event_attendee_attendee_status/', params // Send params as the request body
                        )];
                case 1:
                    response = _c.sent();
                    if (__DEV__) {
                        console.log('Params sent to API:', params);
                    }
                    return [2 /*return*/, ((_b = response.data) === null || _b === void 0 ? void 0 : _b.status) === true];
                case 2:
                    error_2 = _c.sent();
                    handleApiError_1.handleApiError(error_2, 'Failed to update attendee status');
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
};
/**
 * Update a specific field for an attendee
 */
exports.updateAttendeeField = function (_a) {
    var userId = _a.userId, attendeeId = _a.attendeeId, field = _a.field, value = _a.value;
    return __awaiter(void 0, void 0, Promise, function () {
        var params, response, error_3;
        var _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    params = cleanParams_1.cleanParams((_b = {
                            current_user_login_details_id: userId,
                            attendee_id: attendeeId,
                            generate_badge: 1
                        },
                        _b[field] = value,
                        _b));
                    return [4 /*yield*/, mainApi_1["default"].post('/ajax_update_attendee/', null, { params: params })];
                case 1:
                    response = _d.sent();
                    if (__DEV__) {
                        console.log('Params sent to API:', params);
                    }
                    return [2 /*return*/, ((_c = response.data) === null || _c === void 0 ? void 0 : _c.status) === true];
                case 2:
                    error_3 = _d.sent();
                    handleApiError_1.handleApiError(error_3, 'Failed to update attendee field');
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
};
/**
 * Map API attendee data to frontend display format
 */
exports.mapAttendeeToDetails = function (attendee) {
    // Use the nice formatted date if available, otherwise format the raw date
    var formattedDate = '-';
    if (attendee.attendee_status === 1) {
        if (attendee.nice_attendee_status_change_datetime &&
            attendee.nice_attendee_status_change_datetime !== '-') {
            // Clean up the format from API which has escaped slashes and extra spaces
            // Example: "18\/05\/2025 02:57 AM" -> "18/05/2025 02:57 AM"
            var cleanedDate = attendee.nice_attendee_status_change_datetime;
            // Replace escaped slashes with normal slashes
            cleanedDate = cleanedDate.split('/').join('/');
            // Fix any extra spaces
            cleanedDate = cleanedDate.trim();
            // Use the cleaned date
            formattedDate = cleanedDate;
        }
        else if (attendee.attendee_status_change_datetime) {
            try {
                // Only try to parse if it's not the default "0000-00-00 00:00:00" format
                if (attendee.attendee_status_change_datetime !== '0000-00-00 00:00:00') {
                    var date = new Date(attendee.attendee_status_change_datetime);
                    if (!isNaN(date.getTime())) {
                        formattedDate = date.toLocaleString('fr-FR');
                    }
                }
            }
            catch (e) {
                console.warn('Error formatting date:', e);
            }
        }
    }
    // Use attendeeStatus as a number (0 or 1)
    var attendeeStatus = attendee.attendee_status === 1 ? 1 : 0;
    return {
        type: attendee.attendee_type_name || '',
        lastName: attendee.last_name,
        firstName: attendee.first_name,
        email: attendee.email || '',
        phone: attendee.phone || '',
        organization: attendee.organization || '',
        jobTitle: attendee.designation || '',
        theAttendeeId: String(attendee.id),
        commentaire: attendee.comment || '',
        attendeeStatusChangeDatetime: formattedDate,
        attendeeStatus: attendeeStatus,
        urlBadgePdf: attendee.badge_pdf_url || '',
        urlBadgeImage: attendee.badge_image_url || ''
    };
};
