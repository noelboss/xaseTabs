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
 * @updated             24. July 2010 
 * @param {object}      options             Default: '{}' Options Object, see available options: http://www.noelboss.ch/xasetabs/#xaseTabstabs-3
 *   
 *
 * **************************************************************************************************************
 * CHANGELOG:
 * **************************************************************************************************************
 *
 * 0.2.5 Beta - 24. August 2010                                                                     
 * - New: Added Option to disable triggering of first tab
 *
 * 0.2.4 Beta - 29. July 2010                                                                     
 * - New: Added unbinding of event before binding.
 *
 * 0.2.3 Beta - 21. July 2010                                                                     
 * - New: $.xaseTabs.extend(customEvents) allows you to extend all instances of xaseTabs! 
 * - New: Check for e.isPropagationStopped() on all events
 * - New: tabSelector and panelSelector options are now capable of receiving jQuery objects and...
 * - Changed: ...therefore, tabSelector and panelSelector are renamed to tabTarget and panelTarget                                                                                
 *
 * 0.2.2 Beta - 20. July 2010  
 * - Fix: Bug that causes IE6 to crash when a link inside a tab exists and that link is clicked
 * - New: Moved code to google code: http://code.google.com/p/xasetabs 
 *
 * 0.2.1 Beta - 19. July 2010  
 * - Fix: Acitvating on a link now doesn't follow the link
 *
 * 0.2.0 Beta - 19. July 2010 
 * - New: The way the extension is extended was rewritten. No need to create
 *        a copy of the custom events anymore, they are provided to the function: 
 *        $('ul.tabs').xaseTabs({ 
 *           extend: function(customEvents){
 *              // do what you like, dont' forget to return the altered object
 *              return customEvents;
 *           }
 *        });
 * - Fix: Bug that could couse nested modules to call parent functions fixed
 * 
 * 0.1.1 Beta - 14. July 2010
 * - Fix: Small bugfix release 
 *
 * 0.1.0 Beta - 14. July 2010
 * - New: Initial Release
 *
 */
; (function($) {
    $.fn.xaseTabs = function(userOptions) {
        var $t = $(this);
        var userOptions = userOptions || {};
        // setup holds the custom events and will be applayed to "this"
        var setup = customEvents;

        if (typeof(userOptions.extend) === 'function') {
            // create copy of customEvents
            var copyCustomEvents = $.extend(true, {},
            customEvents);
            // extend base options
            setup = userOptions.extend(copyCustomEvents) || setup;
        }

        var options = $.extend({},
        $.fn.xaseTabs.defaults, userOptions);

        // unbinding of all xase Events (tabs are unbound on the setupTabs event)
        $t.unbind('.' + options.namespace);

        // iterates over all custzom event arrays and alls each function inside. This functions bind
        // the custom events on the Element and pass the arguments and options provided to the plugin
        // to all those custom events
        for (customEvent in setup) {
            var $self = $t;
            if (setup[customEvent] instanceof Array) {
                for (var i = 0; i < setup[customEvent].length; i++) {
                    setup[customEvent][i].call($self, options);
                }
            } else {
                setup[customEvent].call($self, options);
            }
        }

        // automatically initialize the plugin or not...
        if (options.autoInitialize) {
            $t.trigger("initialize." + options.namespace);
        }
    };

    /**
     * @name xaseTabs.defaults
     * Extends the $.fn.xaseTabs.defaults object with your custom events, this will be applyed to all
     * instances of the xaseTabs after extend() has been called
     *
     * @param {function}    extend                  Default: null – You can fill the “extend” key of the option object with a function, that extends the default customEvents object with your own functions.
     */
    $.xaseTabs = {
        extend: function(extend) {
            if (typeof(extend) !== 'function') {
                return;
            }
            // create copy of customEvents
            var copyCustomEvents = $.extend(true, {},
            customEvents);
            // extend base options
            var userCustomEvents = extend(copyCustomEvents) || customEvents;
            // extending the defaults
            customEvents = $.extend(customEvents, userCustomEvents);
        }
    };

    /**
     * @name xaseTabs.defaults
     * These are the plugin defaults configs with a public interface
     * you can change this values like this: $('ul', $context).xaseTabs({ tabSelector: 'li'}); 
     *
     * @param {string}              namespace               Default: 'xaseTabs' – Namespace, will be added to the all Events and the Hashes...
     * @param {string / jQuery}     tabTarget               Default: 'li' – The Selector of tabs relativ to the Element the Tabs Plugin is called on. Default is a li inside the selected tab ul. You can also pass a jQuery object containing the tabs-elements
     * @param {string / jQuery}     panelTarget              Default: '~ div' – The Selector of panels relativ to the Element the Tabs Plugin is called on. Default are Siblings of tabs ul. You can also pass a jQuery object containing the panels-elements
     * @param {string}              activeAttribute         Default: 'selected' – Attribute to check if predefined tab should be selected. 
     * @param {string}              activeClass             Default: 'active' – Class for activate Tabs and Panels
     * @param {string}              triggerEvent            Default: 'click.xaseTabs' – Event that triggers the activate Event
     * @param {function}            activateBindFunction    Default: null – If you want to bind the activate event on yourself you can use this function 
     * @param {string}              hashAttribute           Default: '.' – CSS-Selector Attribute that will be checked to match a URL hash (#xaseTabsHASHATTR-1) for activating a specific tab
     * @param {boolean}             ajax                    Default: false – If this is enabled, and the Tab contains a link, the the content is loaded with ajax
     * @param {boolean}             autoInitialize          Default: true – If you wan't to trigger the initialization phase manually, set this flag to false
     * @param {boolean}             triggerTabsOnStart      Default: true – Triggers the first tab on acitvation
     * @param {function}            extend                  Default: null – You can fill the “extend” key of the option object with a function, that extends the default customEvents object with your own functions.
     */
    $.fn.xaseTabs.defaults = {
        namespace: 'xaseTabs',
        tabTarget: 'li',
        panelTarget: '~ div',
        activeAttribute: 'selected',
        activeClass: 'active',
        triggerEvent: 'click',
        hashAttribute: '.',
        autoInitialize: true,
        triggerTabsOnStart: true,
        extend: null
    };

    // Private Variables: customEvents
    var customEvents = {
        /**
         * initialize Event
         * 
         * Initialize the Tabs and activate the Tab with the css class "active" or the 
         * attribute checked="checked" set. This also binds the activate Event onto the tabs
         * If you would like to dynamically set an active Tab – lets say Tab 2 – on startup, 
         * you can add a Hash to the URL: #xaseTabsTABID-2
         * You can have multiple tabmodules on the page with different ID's:
         * #xaseTabsTabModule1-2xaseTabsTabModule2-5xaseTabsTabModule3-1 
         * Tab2 active in TabModule1, Tab 5 in TabModule2 and Tab 1 in TabModule3
         *
         * @param {object} options  Options provided to the Plugin including Defaults
         * @param {object} e  Event Object, call e.isDefaultPrevented() to check if Default is prevented
         */
        initialize: [function(options) {
            this.bind("initialize." + options.namespace,
            function(e) {
                if (e.isDefaultPrevented() || e.isPropagationStopped()) {
                    return;
                }

                // caching an get cached elements from tabs-element
                var $t = $(this);
                var $tabs;
                var $panels;

                if (typeof(options.tabTarget) === 'object' || typeof(options.tabTarget) === 'array') {
                    $tabs = $(options.tabTarget);
                } else if (typeof(options.tabTarget) === 'string') {
                    $tabs = $(options.tabTarget, $t);
                }
                if (typeof(options.panelTarget) === 'object' || typeof(options.panelTarget) === 'array') {
                    $panels = $(options.panelTarget);
                } else if (typeof(options.panelTarget) === 'string') {
                    $panels = $(options.panelTarget, $t);
                }
                var $selected = $tabs.filter('.' + options.activeClass).eq(0);

                // We cache the Tabs and the Panels directly onto the Element so with
                // $(this).data('$tabs') you always know what your tabs and panels are...
                $t.data('$panels', $panels).data('$tabs', $tabs);

                // setting up individual tabs
                $t.trigger("setupPanels." + options.namespace);
                $t.trigger('setupTabs.' + options.namespace);

                /** 
                 * check for a hash like This: #xaseTabsTABID-2 where TABID is the Class of this Tab Module
                 * and the number behind the - the Tab to be activated
                 */
                var hash = window.location.hash.split(options.namespace);
                if ($.isArray(hash)) {
                    for (var i = hash.length - 1; i > 0; i--) {
                        // loop trough all modules
                        var module = hash[i].split('-');
                        // get Tab number and Module ID
                        if ($t.is(options.hashAttribute + module[0])) {
                            // if we are the the current module
                            // update selected Element and add class active
                            $selected = $(this).data('$tabs').removeClass(options.activeClass).eq(module[1] - 1).addClass(options.activeClass);
                        }
                    }
                }
                // search for predefined activate Elements
                $selected = $selected.length < 1 ? $tabs.filter("[" + options.activeAttribute + "=" + options.activeAttribute + "]").eq(0) : $selected;
                if ($selected.length < 1) {
                    // If no element selected, we activate Tab 1
                    $selected = $tabs.eq(0);
                }
                // trigger activate Event
                if ($selected.length > 0 && options.triggerTabsOnStart) {
                    $t.trigger("activate." + options.namespace, $selected);
                }
            });
        }],

        /**
         * setupPanels Event
         * Setup the Panels on startup, saving the panel as .data('$panel') to the according tab
         *                      
         * @param {object} options      Options provided to the Plugin including Defaults
         * @param {object} e            Event Object, call e.isDefaultPrevented() to check if Default is prevented
         */
        setupPanels: [function(options) {
            this.bind("setupPanels." + options.namespace,
            function(e) {
                if (e.isDefaultPrevented() || e.isPropagationStopped()) {
                    return;
                }

                var $t = $(this);
                var $tabs = $t.data('$tabs');
                var $panels = $t.data('$panels');

                $tabs.each(function(i) {
                    var $panel = $panels.eq(i);
                    if ($panel.length < 1) {
                        $panel = $panels.eq(0);
                    }
                    $(this).data('$panel', $panel);
                });
            });
        }],

        /**
         * setupTabs Event
         * Binds the custom activate Event to the Tabs.
         *                      
         * @param {object} options      Options provided to the Plugin including Defaults
         * @param {object} e            Event Object, call e.isDefaultPrevented() to check if Default is prevented
         */
        setupTabs: [function(options) {
            this.bind("setupTabs." + options.namespace,
            function(e) {
                if (e.isDefaultPrevented() || e.isPropagationStopped()) {
                    return;
                }

                var $t = $(this);
                var $tabs = $t.data('$tabs');

                // unbind old events first
                $tabs.unbind('.' + options.namespace)
                .bind(options.triggerEvent + "." + options.namespace,
                function(e) {
                    $t.trigger("activate." + options.namespace, $(this).get(0));
                    return false;
                });
            });
        }],

        /**
         * activate Tab Event
         * This Event deactivates all tabs and activates the selected tab
         *
         * @param {object} options      Options provided to the Plugin including Defaults
         * @param {object} e            Event Object, call e.isDefaultPrevented() to check if Default is prevented
         * @param {element} selected    Element that should be activate
         */
        activate: [function(options) {
            this.bind("activate." + options.namespace,
            function(e, selected) {
                if (e.isDefaultPrevented() || e.isPropagationStopped()) {
                    return;
                }

                var $selected = $(selected) || {};
                // check needed for ie6!
                if ($selected.length < 1) {
                    return;
                }

                var $t = $(this);
                var $panel = $selected.data('$panel');
                var $panels = $t.data('$panels');
                var $tabs = $t.data('$tabs');

                $panels.hide();
                $tabs.removeClass(options.activeClass);
                $panel.show();
                $selected.addClass(options.activeClass);

                // preventing outer events from inheriting this method
                return false;
            });
        }]
    };
})(jQuery);
/**
 * have fun! 
 */
