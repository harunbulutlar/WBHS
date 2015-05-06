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
        var user = app.getQueryString().patientId;
        if (event.EventCreator && event.EventCreator.UserId && event.EventCreator.UserId != user) {
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
            if (event.EventCreator && event.EventCreator.UserId && event.EventCreator.UserId == app.getQueryString().patientId) {
                return "manager_event";
            }
            return "employee_event";
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
        scheduler.attachEvent("onClick", function (id, e) {
            //window.location.href = '/Home/Index/';
            return true;
        });
        scheduler.attachEvent("onEventCreated", function (id, e) {
            //any custom logic here
            var event_obj = scheduler.getEvent(id);
            var start_minutes = event_obj.start_date.getMinutes();
            var start_hours = event_obj.start_date.getHours();
            var end_minutes = event_obj.end_date.getMinutes();
            var end_hours = event_obj.end_date.getHours();
            if (start_minutes < 30) {
                start_minutes = 0;
                end_minutes = 30;
            } else {
                start_minutes = 30;
                end_minutes = 0;
                end_hours = end_hours - 1;
            }
            event_obj.start_date.setMinutes(start_minutes);
            event_obj.start_date.setHours(start_hours);
            event_obj.start_date.setSeconds(0);

            event_obj.end_date.setMinutes(end_minutes);
            event_obj.end_date.setHours(end_hours);
            event_obj.end_date.setSeconds(0);
            event_obj.text = app.currentUserLastName + ", " + app.currentUserName;


        });
    }
};
