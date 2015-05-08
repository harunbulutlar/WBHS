var physicianId = window.app.getQueryString().physicianId;
window.app.checkEventOwner = function (event) {
    if (event.CreatorId && event.CreatorId != physicianId) {
        dhtmlx.message(app.othersEventMessage);
        return false;
    }
    return true;
};

window.app.decideClass = function (start, end, event) {
    if (event.EventType == "blocker") {
        return "blocker_event";
    }
    if (event.EventType == "appointment") {
        if (event.CreatorId == physicianId) {
            return "blocker_event";
        } else {
            return "employee_event";
        }
    }

    return "blocker_event";
};

window.app.checkEventOwner = function (event) {
    var user = physicianId;
    if (event.CreatorId && event.CreatorId != user) {
        dhtmlx.message(app.othersEventMessage);
        return false;
    }
    return true;
};

window.app.onCreatedCb = function (id) {
    var eventObj = scheduler.getEvent(id);
    eventObj.text = "Blocker";
}
window.app.initFinishedCb = function () {
    scheduler.config.drag_resize = true;
            scheduler.config.edit_on_create = false;
}