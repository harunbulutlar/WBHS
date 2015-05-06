/*
@license
dhtmlxScheduler.Net v.3.3.0 Professional Evaluation

This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){e.templates.calendar_month=e.date.date_to_str("%F %Y"),e.templates.calendar_scale_date=e.date.date_to_str("%D"),e.templates.calendar_date=e.date.date_to_str("%d"),e.config.minicalendar={mark_events:!0},e._synced_minicalendars=[],e.renderCalendar=function(t,a,n){var i=null,r=t.date||e._currentDate();if("string"==typeof r&&(r=this.templates.api_date(r)),a)i=this._render_calendar(a.parentNode,r,t,a),e.unmarkCalendar(i);else{var d=t.container,l=t.position;if("string"==typeof d&&(d=document.getElementById(d)),
"string"==typeof l&&(l=document.getElementById(l)),l&&"undefined"==typeof l.left){var o=getOffset(l);l={top:o.top+l.offsetHeight,left:o.left}}d||(d=e._get_def_cont(l)),i=this._render_calendar(d,r,t),i.onclick=function(t){t=t||event;var a=t.target||t.srcElement;if(-1!=a.className.indexOf("dhx_month_head")){var n=a.parentNode.className;if(-1==n.indexOf("dhx_after")&&-1==n.indexOf("dhx_before")){var i=e.templates.xml_date(this.getAttribute("date"));i.setDate(parseInt(a.innerHTML,10)),e.unmarkCalendar(this),
e.markCalendar(this,i,"dhx_calendar_click"),this._last_date=i,this.conf.handler&&this.conf.handler.call(e,i,this)}}}}if(e.config.minicalendar.mark_events)for(var s=e.date.month_start(r),_=e.date.add(s,1,"month"),c=this.getEvents(s,_),u=this["filter_"+this._mode],h=0;h<c.length;h++){var p=c[h];if(!u||u(p.id,p)){var v=p.start_date;for(v.valueOf()<s.valueOf()&&(v=s),v=e.date.date_part(new Date(v.valueOf()));v<p.end_date&&(this.markCalendar(i,v,"dhx_year_event"),v=this.date.add(v,1,"day"),!(v.valueOf()>=_.valueOf())););
}}return this._markCalendarCurrentDate(i),i.conf=t,t.sync&&!n&&this._synced_minicalendars.push(i),i.conf._on_xle_handler||(i.conf._on_xle_handler=e.attachEvent("onXLE",function(){e.updateCalendar(i,i.conf.date)})),i},e._get_def_cont=function(e){return this._def_count||(this._def_count=document.createElement("DIV"),this._def_count.className="dhx_minical_popup",this._def_count.onclick=function(e){(e||event).cancelBubble=!0},document.body.appendChild(this._def_count)),this._def_count.style.left=e.left+"px",
this._def_count.style.top=e.top+"px",this._def_count._created=new Date,this._def_count},e._locateCalendar=function(t,a){if("string"==typeof a&&(a=e.templates.api_date(a)),+a>+t._max_date||+a<+t._min_date)return null;for(var n=t.childNodes[2].childNodes[0],i=0,r=new Date(t._min_date);+this.date.add(r,1,"week")<=+a;)r=this.date.add(r,1,"week"),i++;var d=e.config.start_on_monday,l=(a.getDay()||(d?7:0))-(d?1:0);return n.rows[i].cells[l].firstChild},e.markCalendar=function(e,t,a){var n=this._locateCalendar(e,t);

n&&(n.className+=" "+a)},e.unmarkCalendar=function(e,t,a){if(t=t||e._last_date,a=a||"dhx_calendar_click",t){var n=this._locateCalendar(e,t);n&&(n.className=(n.className||"").replace(RegExp(a,"g")))}},e._week_template=function(t){for(var a=t||250,n=0,i=document.createElement("div"),r=this.date.week_start(e._currentDate()),d=0;7>d;d++)this._cols[d]=Math.floor(a/(7-d)),this._render_x_header(d,n,r,i),r=this.date.add(r,1,"day"),a-=this._cols[d],n+=this._cols[d];return i.lastChild.className+=" dhx_scale_bar_last",
i},e.updateCalendar=function(e,t){e.conf.date=t,this.renderCalendar(e.conf,e,!0)},e._mini_cal_arrows=["&nbsp","&nbsp"],e._render_calendar=function(t,a,n,i){var r=e.templates,d=this._cols;this._cols=[];var l=this._mode;this._mode="calendar";var o=this._colsS;this._colsS={height:0};var s=new Date(this._min_date),_=new Date(this._max_date),c=new Date(e._date),u=r.month_day,h=this._ignores_detected;this._ignores_detected=0,r.month_day=r.calendar_date,a=this.date.month_start(a);var p,v=this._week_template(t.offsetWidth-1-this.config.minicalendar.padding);

if(i?p=i:(p=document.createElement("DIV"),p.className="dhx_cal_container dhx_mini_calendar"),p.setAttribute("date",this.templates.xml_format(a)),p.innerHTML="<div class='dhx_year_month'></div><div class='dhx_year_week'>"+v.innerHTML+"</div><div class='dhx_year_body'></div>",p.childNodes[0].innerHTML=this.templates.calendar_month(a),n.navigation)for(var m=function(t,a){var n=e.date.add(t._date,a,"month");e.updateCalendar(t,n),e._date.getMonth()==t._date.getMonth()&&e._date.getFullYear()==t._date.getFullYear()&&e._markCalendarCurrentDate(t);

},g=["dhx_cal_prev_button","dhx_cal_next_button"],b=["left:1px;top:2px;position:absolute;","left:auto; right:1px;top:2px;position:absolute;"],f=[-1,1],y=function(t){return function(){if(n.sync)for(var a=e._synced_minicalendars,i=0;i<a.length;i++)m(a[i],t);else m(p,t)}},x=0;2>x;x++){var k=document.createElement("DIV");k.className=g[x],k.style.cssText=b[x],k.innerHTML=this._mini_cal_arrows[x],p.firstChild.appendChild(k),k.onclick=y(f[x])}p._date=new Date(a),p.week_start=(a.getDay()-(this.config.start_on_monday?1:0)+7)%7;

var w=p._min_date=this.date.week_start(a);p._max_date=this.date.add(p._min_date,6,"week"),this._reset_month_scale(p.childNodes[2],a,w);for(var D=p.childNodes[2].firstChild.rows,E=D.length;6>E;E++){var M=D[D.length-1];D[0].parentNode.appendChild(M.cloneNode(!0));var S=parseInt(M.childNodes[M.childNodes.length-1].childNodes[0].innerHTML);S=10>S?S:0;for(var O=0;O<D[E].childNodes.length;O++)D[E].childNodes[O].className="dhx_after",D[E].childNodes[O].childNodes[0].innerHTML=e.date.to_fixed(++S)}return i||t.appendChild(p),
p.childNodes[1].style.height=p.childNodes[1].childNodes[0].offsetHeight-1+"px",this._cols=d,this._mode=l,this._colsS=o,this._min_date=s,this._max_date=_,e._date=c,r.month_day=u,this._ignores_detected=h,p},e.destroyCalendar=function(t,a){!t&&this._def_count&&this._def_count.firstChild&&(a||(new Date).valueOf()-this._def_count._created.valueOf()>500)&&(t=this._def_count.firstChild),t&&(t.onclick=null,t.innerHTML="",t.parentNode&&t.parentNode.removeChild(t),this._def_count&&(this._def_count.style.top="-1000px"),
t.conf&&t.conf._on_xle_handler&&e.detachEvent(t.conf._on_xle_handler))},e.isCalendarVisible=function(){return this._def_count&&parseInt(this._def_count.style.top,10)>0?this._def_count:!1},e._attach_minical_events=function(){dhtmlxEvent(document.body,"click",function(){e.destroyCalendar()}),e._attach_minical_events=function(){}},e.attachEvent("onTemplatesReady",function(){e._attach_minical_events()}),e.templates.calendar_time=e.date.date_to_str("%d-%m-%Y"),e.form_blocks.calendar_time={render:function(){
var t="<input class='dhx_readonly' type='text' readonly='true'>",a=e.config,n=this.date.date_part(e._currentDate()),i=1440,r=0;a.limit_time_select&&(r=60*a.first_hour,i=60*a.last_hour+1),n.setHours(r/60),t+=" <select>";for(var d=r;i>d;d+=1*this.config.time_step){var l=this.templates.time_picker(n);t+="<option value='"+d+"'>"+l+"</option>",n=this.date.add(n,this.config.time_step,"minute")}t+="</select>";e.config.full_day;return"<div style='height:30px;padding-top:0; font-size:inherit;' class='dhx_section_time'>"+t+"<span style='font-weight:normal; font-size:10pt;'> &nbsp;&ndash;&nbsp; </span>"+t+"</div>";

},set_value:function(t,a,n){function i(t,a,n){s(t,a,n),t.value=e.templates.calendar_time(a),t._date=e.date.date_part(new Date(a))}var r,d,l=t.getElementsByTagName("input"),o=t.getElementsByTagName("select"),s=function(t,a,n){t.onclick=function(){e.destroyCalendar(null,!0),e.renderCalendar({position:t,date:new Date(this._date),navigation:!0,handler:function(a){t.value=e.templates.calendar_time(a),t._date=new Date(a),e.destroyCalendar(),e.config.event_duration&&e.config.auto_end_date&&0===n&&h()}});

}};if(e.config.full_day){if(!t._full_day){var _="<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> "+e.locale.labels.full_day+"&nbsp;</label></input>";e.config.wide_form||(_=t.previousSibling.innerHTML+_),t.previousSibling.innerHTML=_,t._full_day=!0}var c=t.previousSibling.getElementsByTagName("input")[0],u=0===e.date.time_part(n.start_date)&&0===e.date.time_part(n.end_date);c.checked=u,o[0].disabled=c.checked,o[1].disabled=c.checked,c.onclick=function(){if(c.checked===!0){
var a={};e.form_blocks.calendar_time.get_value(t,a),r=e.date.date_part(a.start_date),d=e.date.date_part(a.end_date),(+d==+r||+d>=+r&&(0!==n.end_date.getHours()||0!==n.end_date.getMinutes()))&&(d=e.date.add(d,1,"day"))}var s=r||n.start_date,_=d||n.end_date;i(l[0],s),i(l[1],_),o[0].value=60*s.getHours()+s.getMinutes(),o[1].value=60*_.getHours()+_.getMinutes(),o[0].disabled=c.checked,o[1].disabled=c.checked}}if(e.config.event_duration&&e.config.auto_end_date){var h=function(){r=e.date.add(l[0]._date,o[0].value,"minute"),
d=new Date(r.getTime()+60*e.config.event_duration*1e3),l[1].value=e.templates.calendar_time(d),l[1]._date=e.date.date_part(new Date(d)),o[1].value=60*d.getHours()+d.getMinutes()};o[0].onchange=h}i(l[0],n.start_date,0),i(l[1],n.end_date,1),s=function(){},o[0].value=60*n.start_date.getHours()+n.start_date.getMinutes(),o[1].value=60*n.end_date.getHours()+n.end_date.getMinutes()},get_value:function(t,a){var n=t.getElementsByTagName("input"),i=t.getElementsByTagName("select");return a.start_date=e.date.add(n[0]._date,i[0].value,"minute"),
a.end_date=e.date.add(n[1]._date,i[1].value,"minute"),a.end_date<=a.start_date&&(a.end_date=e.date.add(a.start_date,e.config.time_step,"minute")),{start_date:new Date(a.start_date),end_date:new Date(a.end_date)}},focus:function(e){}},e.linkCalendar=function(t,a){var n=function(){var n=e._date,i=new Date(n.valueOf());return a&&(i=a(i)),i.setDate(1),e.updateCalendar(t,i),!0};e.attachEvent("onViewChange",n),e.attachEvent("onXLE",n),e.attachEvent("onEventAdded",n),e.attachEvent("onEventChanged",n),e.attachEvent("onAfterEventDelete",n),
n()},e._markCalendarCurrentDate=function(t){var a=e._date,n=e._mode,i=e.date.month_start(new Date(t._date)),r=e.date.add(i,1,"month");if("day"==n||this._props&&this._props[n])i.valueOf()<=a.valueOf()&&r>a&&e.markCalendar(t,a,"dhx_calendar_click");else if("week"==n)for(var d=e.date.week_start(new Date(a.valueOf())),l=0;7>l;l++)i.valueOf()<=d.valueOf()&&r>d&&e.markCalendar(t,d,"dhx_calendar_click"),d=e.date.add(d,1,"day")},e.attachEvent("onEventCancel",function(){e.destroyCalendar(null,!0)})});