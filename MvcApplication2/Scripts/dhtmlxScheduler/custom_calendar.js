window.app = {

    //Add a helper that we’ll need later:
    //returns room name by id
    initFinishedCb: function() {
        return true;
    },
    getAppointments: function (id) {
        var appointments = app.appointments;
        for (var i in appointments) {
            if (appointments[i].key == id)
                return appointments[i].label;
        }
        return "";
    },
    //check if event belongs to the user and is it not started yet
    isEditable: function (eventId) {
        var eventObj = scheduler.getEvent(eventId);
        if (!app.checkEventOwner(eventObj))
            return false;
        if (!eventObj)
            return false;
        return app.checkValidDate(eventObj.start_date);
    },

    checkEventOwner: function (event) {
        var user = app.getQueryString().patientId;
        if ((event.CreatorId && event.CreatorId != user) || event.EventType == "blocker") {
            if (event.EventType == "blocker") {
                dhtmlx.message(app.physicianBlockMessage);
                return false;
            }
            dhtmlx.message(app.othersEventMessage);
            return false;
        }
        return true;
    },
    decideClass: function (start, end, event) {
        if (event.EventType == "blocker") {
            return "blocker_event";
        }
        if (event.EventType == "appointment") {
            if (event.CreatorId == app.getQueryString().patientId) {
                return "own_event";
            } else {
                return "employee_event";
            }
        }

        return "own_event";
    },
    //show message and return 'false' if provided date has passed
    checkValidDate: function (date) {
        if (date.valueOf() < new Date().valueOf()) {
            dhtmlx.message(app.pastEventMessage);
            return false;
        } else {
            return true;
        }
    },
    onCreatedCb: function (id) {
        var eventObj = scheduler.getEvent(id);
        eventObj.text = app.currentUserLastName + ", " + app.currentUserName;
    },

    getQueryString: function () {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var queryString = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof queryString[pair[0]] == "undefined") {
                queryString[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof queryString[pair[0]] == "string") {
                var arr = [queryString[pair[0]], pair[1]];
                queryString[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                queryString[pair[0]].push(pair[1]);
            }
        }
        return queryString;
    },
    //error messages
    needLoginMessage: "You need to login first",
    pastEventMessage: "You can't add or edit events in the past",
    othersEventMessage: "You can't edit other's event;",
    physicianBlockMessage: "Physician blocked this time frame",
    initialize: function () {
        var format = scheduler.date.date_to_str("%H:%i");
        var step = 30;
        scheduler.config.first_hour = 8;
        scheduler.config.last_hour = 19;
        scheduler.config.edit_on_create = false;
        scheduler.config.event_duration = 30;
        scheduler.config.cascade_event_count = 1;
        scheduler.config.time_step = 30;
        scheduler.config.drag_resize = false;
        scheduler.config.limit_start = new Date();
        scheduler.xy.min_event_height = 18;
        scheduler.renderEvent = function (container, ev) {
            var containerWidth = container.style.width; // e.g. "105px"

            // move section
            var html = "<div class='dhx_event_move my_event_move' style='width: " +
            containerWidth + "'></div>";

            // container for event's content
            html += "<div class='my_event_body'>";
            html += "<span class='event_date'>";
            //two options here:show only start date for short events or start+end for long
            if ((ev.end_date - ev.start_date) / 60000 > 40) {//if event is longer than 40 minutes
                html += scheduler.templates.event_header(ev.start_date, ev.end_date, ev);
                html += "</span><br/>";
            } else {
                html += scheduler.templates.event_date(ev.start_date) + "</span>";
            }
            // displaying event's text
            html += "<span>" + scheduler.templates.event_text(ev.start_date, ev.end_date, ev) +
            "</span>" + "</div>";

            // resize section
            html += "<div class='dhx_event_resize my_event_resize' style='width: " +
            containerWidth + "'></div>";

            container.innerHTML = html;
            return true; //required, true - display a custom form, false - the default form
        };
        scheduler.templates.event_class = app.decideClass;
        scheduler.templates.hour_scale = function (date) {
            html = "";
            for (var i = 0; i < 60 / step; i++) {
                html += "<div style='height:21px;line-height:21px;'>" + format(date) + "</div>";
                date = scheduler.date.add(date, step, "minute");
            }
            return html;
        }

        setInterval(function () {
            scheduler.config.limit_start = new Date();
        }, 1000 * 60);
        window.app.initFinishedCb();
        scheduler.attachEvent("onBeforeLightbox", app.isEditable);
        scheduler.attachEvent("onClick", app.isEditable);
        scheduler.attachEvent("onDblClick", app.isEditable);
        scheduler.attachEvent("onBeforeEventChanged", function (event) {
            return app.isEditable(event.id);
        });
        scheduler.attachEvent("onEventCreated", app.onCreatedCb);
        scheduler.attachEvent("onBeforeDrag", function (eventId, mode, nativeEventObject) {
            if (eventId)
                return app.isEditable(eventId);
            var date = scheduler.getActionData(nativeEventObject).date;
            return app.checkValidDate(date);

        });
        scheduler.attachEvent("onEmptyClick", function (date) {
            app.checkValidDate(date);
        });

        scheduler.attachEvent("onLimitViolation", function () {
            dhtmlx.message(app.pastEventMessage);
        });

        scheduler.attachEvent("onEventCollision", function (ev, evs) {
            for (var i = 0; i < evs.length; i++) {
                if (ev.user_id == evs[i].user_id) {
                    dhtmlx.message("There is already an event for <b>" + app.getRoom(ev.room_id) + "</b>");
                }
            }
            return true;
        });
        scheduler.attachEvent("onClick", function () {
            //window.location.href = '/Home/Index/';
            return true;
        });

    }
};
