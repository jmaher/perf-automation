if (self.CavalryLogger) { CavalryLogger.start_js(["53OuP"]); }

__d("NavigationMetricsEnumJS",[],(function(a,b,c,d,e,f){e.exports=Object.freeze({NAVIGATION_START:"navigationStart",UNLOAD_EVENT_START:"unloadEventStart",UNLOAD_EVENT_END:"unloadEventEnd",REDIRECT_START:"redirectStart",REDIRECT_END:"redirectEnd",FETCH_START:"fetchStart",DOMAIN_LOOKUP_START:"domainLookupStart",DOMAIN_LOOKUP_END:"domainLookupEnd",CONNECT_START:"connectStart",CONNECT_END:"connectEnd",SECURE_CONNECTION_START:"secureConnectionStart",REQUEST_START:"requestStart",RESPONSE_START:"responseStart",RESPONSE_END:"responseEnd",DOM_LOADING:"domLoading",DOM_INTERACTIVE:"domInteractive",DOM_CONTENT_LOADED_EVENT_START:"domContentLoadedEventStart",DOM_CONTENT_LOADED_EVENT_END:"domContentLoadedEventEnd",DOM_COMPLETE:"domComplete",LOAD_EVENT_START:"loadEventStart",LOAD_EVENT_END:"loadEventEnd"})}),null);
__d("NavigationTimingHelper",["NavigationMetricsEnumJS","forEachObject","performance"],(function(a,b,c,d,e,f){__p&&__p();function g(a,c){var d={};b("forEachObject")(b("NavigationMetricsEnumJS"),function(b){var e=c[b];e&&(d[b]=e+a)});return d}var h={getAsyncRequestTimings:function(a){if(!a||!b("performance").timing||!b("performance").getEntriesByName)return undefined;a=b("performance").getEntriesByName(a);return a.length===0?undefined:g(b("performance").timing.navigationStart,a[0])},getPerformanceNavigationTiming:function(){if(!b("performance").timing||!b("performance").getEntriesByType)return{};var a=b("performance").getEntriesByType("navigation");return!a.length?{}:g(b("performance").timing.navigationStart,a[0])},getNavTimings:function(){if(!b("performance").timing)return undefined;var a=babelHelpers["extends"]({},g(0,b("performance").timing),h.getPerformanceNavigationTiming());return g(0,a)}};e.exports=h}),null);
__d("PerfXFlusher",["invariant","Banzai"],(function(a,b,c,d,e,f,g){var h="perfx_custom_logger_endpoint",i=["perfx_page","perfx_page_type","lid"];function j(a){i.forEach(function(b){return g(b in a,'PerfXFlusher: Field "%s" missing in the PerfX payload',b)})}a={flush:function(a){j(a),b("Banzai").post(h,a,{signal:!0})},registerToSendWithBeacon:function(a){b("Banzai").registerToSendWithBeacon(h,a)}};e.exports=a}),null);
__d("PerfXSharedFields",[],(function(a,b,c,d,e,f){var g={addCommonValues:function(a){navigator&&navigator.hardwareConcurrency!==undefined&&(a.num_cores=navigator.hardwareConcurrency);navigator&&navigator.deviceMemory&&(a.ram_gb=navigator.deviceMemory);navigator&&navigator.connection&&(typeof navigator.connection.downlink==="number"&&(a.downlink_megabits=navigator.connection.downlink),typeof navigator.connection.effectiveType==="string"&&(a.effective_connection_type=navigator.connection.effectiveType),typeof navigator.connection.rtt==="number"&&(a.rtt_ms=navigator.connection.rtt));return a},getCommonData:function(){var a={};g.addCommonValues(a);return a}};e.exports=g}),null);
__d("QuicklingRefreshOverheadUtil",["QuicklingConfig","WebStorage","performanceAbsoluteNow"],(function(a,b,c,d,e,f){"use strict";__p&&__p();var g=null,h=1e4;a={onQuicklingStart:function(){g=b("performanceAbsoluteNow")()},onQuicklingVersionMatch:function(){g=null},onQuicklingRefreshStart:function(){if(!b("QuicklingConfig").logRefreshOverhead||g===null)return;var a=b("WebStorage").getSessionStorage();if(!a)return;a.setItem("quickling_refresh_overhead",(b("performanceAbsoluteNow")()-g).toString());a.setItem("quickling_refresh_start",Date.now().toString())},getOverhead:function(a){__p&&__p();if(!b("QuicklingConfig").logRefreshOverhead)return null;var c=b("WebStorage").getSessionStorageForRead();if(!c)return null;var d=c.getItem("quickling_refresh_start");if(d==null)return null;if(a-parseInt(d,10)>h)return null;a=c.getItem("quickling_refresh_overhead");return a!=null?parseFloat(a):null}};e.exports=a}),null);
__d("pageLoadedViaSWCache",[],(function(a,b,c,d,e,f){function a(){return self.__SW_CACHE__===1}e.exports=a}),null);
__d("PerfXLogger",["ArtilleryOnUntilOffLogging","BanzaiODS","DataAttributeUtils","NavigationMetrics","NavigationTimingHelper","PerfXFlusher","PerfXSharedFields","QuicklingRefreshOverheadUtil","VisibilityListener","forEachObject","pageLoadedViaSWCache","performanceAbsoluteNow","setTimeoutAcrossTransitions"],(function(a,b,c,d,e,f){__p&&__p();var g={},h={},i=65*1e3,j=["e2e","tti","all_pagelets_displayed","all_pagelets_loaded","artillery_disable_time"],k={},l={_listenersSetUp:!1,_uploadEarly:!1,_alreadyUploadedEarly:!1,_setupListeners:function(){__p&&__p();if(this._listenersSetUp)return;this._subscribeToNavigationMetrics();b("PerfXFlusher").registerToSendWithBeacon(function(){var a=[];b("forEachObject")(g,function(b,c){if(!g[c].sent){b=this.getPayload(c,"unload fired");b!=null&&a.push(b)}}.bind(this));g={};return a}.bind(this));this._listenersSetUp=!0},_init:function(a){__p&&__p();var b=a.lid;if(b==null)return;this._alreadyUploadedEarly=!1;this._uploadEarly=!!a.upload_perfx_early;delete a.upload_perfx_early;var c=h[b]||[];delete h[b];if(a.sw_controlled_tags){if(navigator.serviceWorker&&navigator.serviceWorker.controller)for(var d=0;d<a.sw_controlled_tags.length;d++)c.push(a.sw_controlled_tags[d]);delete a.sw_controlled_tags}g[b]=babelHelpers["extends"]({tags:new Set(c),sent:!1},a);this._registerTimeoutSendback(b);this._setupListeners()},initWithNavigationMetricsLID:function(a,c){__p&&__p();var d=b("NavigationMetrics").getFullPageLoadLid();if(!d)return;this._init(babelHelpers["extends"]({},c,{lid:d}));if(a&&a.always)for(var c=0;c<a.always.length;c++)l.addTag(d,a.always[c]);if(a&&a.swCache&&b("pageLoadedViaSWCache")())for(var c=0;c<a.swCache.length;c++)l.addTag(d,a.swCache[c])},init:function(a,b){b!=null&&a.lid!=null&&(k[a.lid]=b),this._init(a)},addTag:function(a,c){this._alreadyUploadedEarly&&b("BanzaiODS").bumpEntityKey("PerfXLateTag",c);var d=g[a];if(d){d.tags.add(c);return}h[a]||(h[a]=[]);h[a].push(c)},addTagWithNavigationMetricsLID:function(a){this._alreadyUploadedEarly&&b("BanzaiODS").bumpEntityKey("PerfXLateTag",a);var c=b("NavigationMetrics").getFullPageLoadLid();if(!c)return;l.addTag(c,a)},_registerTimeoutSendback:function(a){var c=this._getFetchStart(a),d=i;c!=null&&(d-=b("performanceAbsoluteNow")()-c);b("setTimeoutAcrossTransitions")(function(){return this._uploadPayload(a,"sendback time out")}.bind(this),d)},_subscribeToNavigationMetrics:function(){__p&&__p();b("NavigationMetrics").addRetroactiveListener(b("NavigationMetrics").Events.EVENT_OCCURRED,function(a,b){if(!(a in g))return;j.includes(b.event)&&Object.prototype.hasOwnProperty.call(b,"timestamp")&&b.timestamp!=null&&(g[a][b.event]=b.timestamp);b.event==="all_pagelets_displayed"&&this._uploadEarly&&(j.forEach(function(event){Object.prototype.hasOwnProperty.call(b,event)&&b[event]!=null&&(g[a][event]=b[event])}),this._uploadPayload(a),this._alreadyUploadedEarly=!0)}.bind(this)),b("NavigationMetrics").addRetroactiveListener(b("NavigationMetrics").Events.NAVIGATION_DONE,function(a,b){var c=b.serverLID;if(!(c in g))return;j.forEach(function(event){Object.prototype.hasOwnProperty.call(b,event)&&b[event]!=null&&(g[c][event]=b[event])});this._uploadPayload(c)}.bind(this))},_getPayloadWithOffset:function(a,c,d){__p&&__p();a=g[a];if(a==null)return null;var e=Object.assign({},a),f=document.querySelector('[id^="hyperfeed_story_id"]');if(f){f=JSON.parse(b("DataAttributeUtils").getDataFt(f));f&&(e.mf_query_id=f.qid)}e.tags=Array.from(a.tags);e.art_id||(e.artillery_disable_time=b("ArtilleryOnUntilOffLogging").lastDisableTime());this._adjustValues(e,c);e.fetch_start=c;if(e.perfx_page_type==="normal"){f=b("NavigationTimingHelper").getNavTimings();f!=null&&f.navigationStart!=null&&(e.nav_to_fetch=c-f.navigationStart);a=b("QuicklingRefreshOverheadUtil").getOverhead(c);a!==null&&(e.quickling_refresh_overhead=a)}d!=null&&(e.sendback_reason=d);b("PerfXSharedFields").addCommonValues(e);b("VisibilityListener").supported()&&e.fetch_start&&e.all_pagelets_displayed&&e.tti&&e.e2e&&(e.tab_hidden_time_dd=b("VisibilityListener").getHiddenTime(e.fetch_start,e.fetch_start+e.all_pagelets_displayed),e.tab_hidden_time_tti=b("VisibilityListener").getHiddenTime(e.fetch_start,e.fetch_start+e.tti),e.tab_hidden_time_e2e=b("VisibilityListener").getHiddenTime(e.fetch_start,e.fetch_start+e.e2e));window&&window.location&&window.location.pathname&&(e.request_uri=window.location.pathname);delete e.sent;return e},_uploadPayload:function(a,c){if(g[a]!=null&&!g[a].sent){c=this.getPayload(a,c);c!=null&&(b("PerfXFlusher").flush(c),g[a].sent=!0)}},getPayload:function(a,b){return this._getPayloadWithOffset(a,this._getFetchStart(a),b)},_getFetchStart:function(a){if(!(a in g))return null;var c=g[a].perfx_page_type;if(c=="quickling")if(!(a in k))return null;else c=b("NavigationTimingHelper").getAsyncRequestTimings(k[a]);else c=b("NavigationTimingHelper").getNavTimings();return!c||!c.fetchStart?null:c.fetchStart},_adjustValues:function(a,b){j.forEach(function(c){Object.prototype.hasOwnProperty.call(a,c)&&(a[c]-=b)})}};e.exports=l}),null);