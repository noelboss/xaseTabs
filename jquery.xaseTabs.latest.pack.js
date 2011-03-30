/**
 * xaseTabs Plugin - Xtensible And Simple Evented Tabs
 * **************************************************************************************************************  
 * © 2010 by Noël Bossart 
 *                         
 * Documentation:   http://noelboss.ch/xasetabs 
 * Download:        http://code.google.com/p/xasetabs
 * Source:          svn checkout http://xasetabs.googlecode.com/svn/trunk/ xasetabs-read-only
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * @author              Noel Bossart
 * @copyright           2010 by Noël Bossart
 * @namespace           $.fn
 * @class               xaseTabs
 * @extends             $.fn 
 * @version             0.2.4 Beta
 * @updated             29. July 2010 
 * @param {object}      options             Default: '{}' Options Object, see available options: http://www.noelboss.ch/xasetabs/#xaseTabstabs-3
 */
;(function($){$.fn.xaseTabs=function(a){var b=$(this);var a=a||{};var c=j;if(typeof(a.extend)==='function'){var d=$.extend(true,{},j);c=a.extend(d)||c}var e=$.extend({},$.fn.xaseTabs.defaults,a);b.unbind('.'+e.namespace);for(customEvent in c){var f=b;if(c[customEvent]instanceof Array){for(var i=0;i<c[customEvent].length;i++){c[customEvent][i].call(f,e)}}else{c[customEvent].call(f,e)}}if(e.autoInitialize){b.trigger("initialize."+e.namespace)}};$.xaseTabs={extend:function(a){if(typeof(a)!=='function'){return}var b=$.extend(true,{},j);var c=a(b)||j;j=$.extend(j,c)}};$.fn.xaseTabs.defaults={namespace:'xaseTabs',tabTarget:'li',panelTarget:'~ div',activeAttribute:'selected',activeClass:'active',triggerEvent:'click',hashAttribute:'.',autoInitialize:true,extend:null};var j={initialize:[function(h){this.bind("initialize."+h.namespace,function(e){if(e.isDefaultPrevented()||e.isPropagationStopped()){return}var a=$(this);var b;var c;if(typeof(h.tabTarget)==='object'||typeof(h.tabTarget)==='array'){b=$(h.tabTarget)}else if(typeof(h.tabTarget)==='string'){b=$(h.tabTarget,a)}if(typeof(h.panelTarget)==='object'||typeof(h.panelTarget)==='array'){c=$(h.panelTarget)}else if(typeof(h.panelTarget)==='string'){c=$(h.panelTarget,a)}var d=b.filter('.'+h.activeClass).eq(0);a.data('$panels',c).data('$tabs',b);a.trigger("setupPanels."+h.namespace);a.trigger('setupTabs.'+h.namespace);var f=window.location.hash.split(h.namespace);if($.isArray(f)){for(var i=f.length-1;i>0;i--){var g=f[i].split('-');if(a.is(h.hashAttribute+g[0])){d=$(this).data('$tabs').removeClass(h.activeClass).eq(g[1]-1).addClass(h.activeClass)}}}d=d.length<1?b.filter("["+h.activeAttribute+"="+h.activeAttribute+"]").eq(0):d;if(d.length<1){d=b.eq(0)}if(d.length>0){a.trigger("activate."+h.namespace,d)}})}],setupPanels:[function(f){this.bind("setupPanels."+f.namespace,function(e){if(e.isDefaultPrevented()||e.isPropagationStopped()){return}var b=$(this);var c=b.data('$tabs');var d=b.data('$panels');c.each(function(i){var a=d.eq(i);if(a.length<1){a=d.eq(0)}$(this).data('$panel',a)})})}],setupTabs:[function(c){this.bind("setupTabs."+c.namespace,function(e){if(e.isDefaultPrevented()||e.isPropagationStopped()){return}var a=$(this);var b=a.data('$tabs');b.unbind('.'+c.namespace).bind(c.triggerEvent+"."+c.namespace,function(e){a.trigger("activate."+c.namespace,$(this).get(0));return false})})}],activate:[function(h){this.bind("activate."+h.namespace,function(e,a){if(e.isDefaultPrevented()||e.isPropagationStopped()){return}var b=$(a)||{};if(b.length<1){return}var c=$(this);var d=b.data('$panel');var f=c.data('$panels');var g=c.data('$tabs');f.hide();g.removeClass(h.activeClass);d.show();b.addClass(h.activeClass);return false})}]}})(jQuery);