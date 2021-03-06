/*
@license
dhtmlxScheduler.Net v.3.3.0 Professional Evaluation

This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){if("undefined"!=typeof dataProcessor){var t=dataProcessor.prototype.init;dataProcessor.prototype.init=function(){t.apply(this,arguments);var e=this;this.attachEvent("onAfterUpdate",function(t,a,n,i){var r;r=e.obj.exists(n)?e.obj.item(n):{},"undefined"!=typeof r.$selected&&delete r.$selected,"undefined"!=typeof r.$template&&delete r.$template,e.callEvent("onLocalUpdate",[{sid:t,tid:n,status:a,data:r}])})},dataProcessor.prototype.applyChanges=function(e){var t=this,a=e.sid,n=e.tid,i=e.status,r=e.data;

switch(t.obj.isSelected(a)&&(r.$selected=!0),i){case"updated":case"update":case"inserted":case"insert":t.obj.exists(a)?(t.obj.isLUEdit(r)===a&&t.obj.stopEditBefore(),t.ignore(function(){t.obj.update(a,r),a!==n&&t.obj.changeId(a,n)})):(r.id=n,t.ignore(function(){t.obj.add(r)}));break;case"deleted":case"delete":t.ignore(function(){t.obj.exists(a)&&(t.obj.setUserData(a,"!nativeeditor_status","true_deleted"),t.obj.stopEditBefore(),t.obj.remove(a),t.obj.isLUEdit(r)===a&&(t.obj.preventLUCollision(r),t.obj.callEvent("onLiveUpdateCollision",[a,n,i,r])===!1&&t.obj.stopEditAfter()));

})}}}"undefined"!=typeof e&&(e.item=function(t){var a=this.getEvent(t);if(!a)return{};var n={};for(var i in a)n[i]=a[i];return n.start_date=e.date.date_to_str(e.config.api_date)(a.start_date),n.end_date=e.date.date_to_str(e.config.api_date)(a.end_date),n},e.update=function(t,a){var n=this.getEvent(t);for(var i in a)"start_date"!=i&&"end_date"!=i&&(n[i]=a[i]);var r=e.date.str_to_date(e.config.api_date);e.setEventStartDate(t,r(a.start_date)),e.setEventEndDate(t,r(a.end_date)),this.updateEvent(t)},e.remove=function(e){
this.exists(e)&&this.deleteEvent(e,!0)},e.exists=function(e){var t=this.getEvent(e);return t?!0:!1},e.add=function(e){var t=this.addEvent(e.start_date,e.end_date,e.text,e.id,e);return this._is_modified_occurence(e)&&this.setCurrentView(),t},e.changeId=function(e,t){return this.changeEventId(e,t)},e.stopEditBefore=function(){},e.stopEditAfter=function(){this.endLightbox(!1,this._lightbox)},e.preventLUCollision=function(e){this._new_event=this._lightbox_id,e.id=this._lightbox_id,this._events[this._lightbox_id]=e;

},e.isLUEdit=function(e){return this._lightbox_id?this._lightbox_id:null},e.isSelected=function(e){return!1})});