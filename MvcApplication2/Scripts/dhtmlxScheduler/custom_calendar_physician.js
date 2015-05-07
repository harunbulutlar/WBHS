window.app = {

    //Add a helper that we’ll need later:
    //returns room name by id
    getAppointments: function (id) {
        var appointments = app.appointments;
        for (var i in appointments) {
            if (appointments[i].key == id)
                return appointments[i].label;
        }
        return "";
    },
    //check if event belongs to the user and is it not started yet
    isEditable: function (event_id) {
        var event_obj = scheduler.getEvent(event_id);
        if (!app.checkEventOwner(event_obj))
            return false;
        if (!event_obj)
            return false;
        return app.checkValidDate(event_obj.start_date);
    },

    checkEventOwner: function (event) {
        var user = app.getQueryString().physicianId;
        if (event.CreatorId &&event.CreatorId != user) {
            dhtmlx.message(app.othersEventMessage);
            return false;
        }
        return true;
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

    getQueryString: function () {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], pair[1]];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        }
        return query_string;
    },
    //error messages
    needLoginMessage: "You need to login first",
    pastEventMessage: "You can't add or edit events in the past",
    othersEventMessage: "You can't edit other's event;",
    initialize: function () {
        var format = scheduler.date.date_to_str("%H:%i");
        var step = 30;
        scheduler.config.first_hour = 8;
        scheduler.config.last_hour = 19;
        scheduler.config.edit_on_create = false;
        scheduler.config.event_duration = 30;
        scheduler.config.cascade_event_count = 1;
        scheduler.config.time_step = 30;
        scheduler.templates.hour_scale = function (date) {
            html = "";
            for (var i = 0; i < 60 / step; i++) {
                html += "<div style='height:21px;line-height:21px;'>" + format(date) + "</div>";
                date = scheduler.date.add(date, step, "minute");
            }
            return html;
        }
        scheduler.attachEvent("onBeforeLightbox", app.isEditable);

        scheduler.attachEvent("onClick", app.isEditable);
        scheduler.attachEvent("onDblClick", app.isEditable);
        scheduler.attachEvent("onBeforeEventChanged", function (event) {
            return app.isEditable(event.id);
        });
        scheduler.attachEvent("onBeforeDrag", function (event_id, mode, native_event_object) {
            if (event_id)
                return app.isEditable(event_id);
            var date = scheduler.getActionData(native_event_object).date;
            return app.checkValidDate(date);

        });
        scheduler.attachEvent("onEmptyClick", function (date) {
            app.checkValidDate(date);
        });

        scheduler.templates.event_class = function (start, end, event) {
            if (event.EventType == "blocker") {
                return "blocker_event";
            }
            if (event.EventType == "appointment") {
                if (event.CreatorId == app.getQueryString().patientId) {
                    return "blocker_event";
                } else {
                    return "employee_event";
                }
            }
               
            return "blocker_event";
        };

        //set minimal available date and update it each minute
        scheduler.config.limit_start = new Date();
        setInterval(function () {
            scheduler.config.limit_start = new Date();
        }, 1000 * 60);

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
        scheduler.attachEvent("onEventCreated", function (id) {
            //any custom logic here
            var eventObj = scheduler.getEvent(id);
            /* var startMinutes = eventObj.start_date.getMinutes();
            var startHours = eventObj.start_date.getHours();
            var endMinutes = eventObj.end_date.getMinutes();
            var endHours = eventObj.end_date.getHours();
            if (startMinutes < 30) {
                startMinutes = 0;
                endMinutes = 30;
            } else {
                startMinutes = 30;
                endMinutes = 0;
                endHours = endHours - 1;
            }
            eventObj.start_date.setMinutes(startMinutes);
            eventObj.start_date.setHours(startHours);
            eventObj.start_date.setSeconds(0);

            eventObj.end_date.setMinutes(endMinutes);
            eventObj.end_date.setHours(endHours);
            eventObj.end_date.setSeconds(0);*/
            eventObj.text = "Blocker";


        });
    }
};
