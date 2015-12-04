"use strict";function commentUpdate(a){"complete"===a.status&&/vk.com\/feed\?section=comments/.test(a.url)&&chrome.storage.local.set({lastOpenComment:parseInt((new Date).getTime()/1e3)})}var Informer={badge:0,load:function(a){var b=$.Deferred();return chrome.storage.local.get(a,function(a){b.resolve(a)}),b.promise()},getLangCode:function(a){switch(a){case 0:case 97:case 100:case 777:return 0;case 1:return 1;case 2:case 114:return 2;case 6:return 6;case 15:return 15;case 54:case 66:return 54;case 61:return 61;default:return 3}},deamonStart:function(){return this.delay>0?(console.info("Daemon already running"),!1):(this.delay=2e3,console.info("Daemon running"),this.mainRequest(),!0)},deamonStop:function(){return this.delay<1?(console.info("Daemon already stoped"),!1):(this.delay=0,chrome.browserAction.setIcon({path:"img/icon38-off.png"}),console.info("Daemon stopped"),!0)},mainRequest:function(){var a=this;$.when(a.load({options:"friends,photos,videos,messages,groups,notifications",isLoadComment:0,lastOpenComment:0,lastLoadAlert:0}),(new Vk).load()).then(function(b,c){c.api("execute.getdata_beta",{options:b.options,isLoadComment:b.isLoadComment,lastOpenComment:b.lastOpenComment,user_id:c.user_id}).done(function(d){a.delay>0&&(d.lang=a.getLangCode(d.lang),d.system&&d.system.lastAlertId>b.lastLoadAlert&&c.api("execute.getAlerts",{lang:d.lang,lastAlert:b.lastLoadAlert}).done(function(b){$.isEmptyObject(b.alert)||(chrome.storage.local.set({lastLoadAlert:b.id}),a.saveAlert(b.alert))}),delete d.system,chrome.storage.local.set(d),chrome.browserAction.setIcon({path:"img/icon38.png"}),a.setCounters(d.counter,d.dialogs).saveAlert(!1,"error"),a.isStatPosted||(new App).addVisitor().done(function(){a.isStatPosted=!0}))}).fail(function(b,c){a.generateError(b,c),chrome.browserAction.setIcon({path:"img/icon38-off.png"})}).always(function(){a.delay>0&&setTimeout($.proxy(a,"mainRequest"),a.delay)})},function(b){a.generateError(b).deamonStop(),chrome.browserAction.setIcon({path:"img/icon38-off.png"})})},setCounters:function(a,b){if(void 0===a.comments)return this;if($.isEmptyObject(a))chrome.browserAction.setBadgeText({text:""}),this.badge=0;else{var c=this;c.load({showMessage:!0}).done(function(d){var e=0,f=!1;$.each(a,function(a,c){"messages"===a&&d.showMessage&&b?e=b.reduce(function(a,b){return b.unread?(f||void 0===b.push_settings||1!==b.push_settings.sound||(f=!0),a+b.unread):a},e):(e+=c-0,f=!0)}),e>c.badge&&f&&c.playSound(),e>999?chrome.browserAction.setBadgeText({text:"999+"}):e>0?chrome.browserAction.setBadgeText({text:e+""}):(e=0,chrome.browserAction.setBadgeText({text:""})),c.badge=e})}return this},playSound:function(){return this.load({audio:!0}).done(function(a){a.audio===!0&&chrome.tabs.query({url:"*://vk.com/*"},function(a){a.every(function(a){return/vk.com\/(?:login.*)?$/i.test(a.url)})&&$("#audio")[0].play()})}),this},saveAlert:function(a,b){if(a){b||(b="message");var c={};c["alert_"+b]=a,chrome.storage.local.set(c)}else chrome.storage.local.remove(["alert_"+b]);return this},generateError:function(a,b){var c={header:"Unknown error occurred",body:{text:"Please inform the developers.",ancor:"Login",url:(new Vk).authUrl}};switch(a){case 0:c={body:{ancor:"Login",url:(new Vk).authUrl}};break;case 1:c={body:{text:"Check your Internet connection"}};break;case 2:c={header:"Access error",body:{text:a+"/ "+b.error_code+". "+b.error_msg,ancor:"Login",url:(new Vk).authUrl}},-1!==$.inArray(b.error_code,[5,7,15,17,113])?(c.body.text="",c.header=""):-1!==$.inArray(b.error_code,[6,9])&&(this.deamonStop()&&setTimeout($.proxy(this,"deamonStart"),1e4),c=!1)}return c.code=a,this.saveAlert(c,"error")}};Informer.deamonStart(),chrome.tabs.onUpdated.addListener(function(a,b,c){"complete"===b.status&&commentUpdate(c)}),chrome.tabs.onActivated.addListener(function(a){chrome.tabs.get(a.tabId,commentUpdate)}),chrome.runtime.onInstalled.addListener(function(a){"install"===a.reason&&(chrome.alarms.create("say_thanks",{when:$.now()+6048e5}),chrome.alarms.create("get_review",{when:$.now()+36e5}),chrome.storage.local.set({lastOpenComment:parseInt($.now()/1e3)})),"update"===a.reason&&Informer.load(["options","isLoadComment","lastOpenComment","showMessage","audio","alert_error"]).done(function(a){chrome.storage.local.clear(),chrome.storage.local.set(a)})}),chrome.alarms.onAlarm.addListener(function(a){var b=new App;"get_review"===a.name?Informer.saveAlert({header:"Try for you",footer:"Close",body:{img:"https://vk.com/images/stickers/644/128.png",text:"Help us to become better",ancor:"Leave a review",url:b.comment}}):"say_thanks"===a.name&&Informer.saveAlert({header:"Try for you",footer:"Close",body:{img:"https://vk.com/images/stickers/630/128.png",ancor:"To thank the author",url:b.share}})});