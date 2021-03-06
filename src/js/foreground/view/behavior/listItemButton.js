﻿define(function(require) {
    'use strict';

    var Tooltipable = require('foreground/view/behavior/tooltipable');

    var ListItemButton = Marionette.Behavior.extend({
        events: {
            'click': '_onClick',
            'dblclick': '_onDblClick'
        },

        behaviors: {
            Tooltipable: {
                behaviorClass: Tooltipable
            }
        },

        initialize: function() {
            //  Debounced to defend against accidental/spam clicking. Bound in initialize because
            //  the debounce timer will be shared between all ListItemButtonViews if bound before initialize.
            this._debounceOnClickAction = _.debounce(this._doOnClickAction.bind(this), 100, true);
        },

        onRender: function() {
            //  Prefer setting these in initialize, but currently $el is not available in behaviors until render.
            this.$el.addClass('listItem-button button button--icon button--icon--secondary button--medium');
            this.$el.attr('data-ui', 'tooltipable');
        },

        //  TODO: I actually do need to have these bubble up because global events don't fire.
        _onClick: function() {
            this._debounceOnClickAction();
            //  Since returning false, need to announce the event happened here since root level won't know about it.
            Streamus.channels.element.vent.trigger('click', event);
            //  Don't allow click to bubble up since handling click at this level.
            return false;
        },

        _onDblClick: function() {
            this._debounceOnClickAction();
            //  Since returning false, need to announce the event happened here since root level won't know about it.
            Streamus.channels.element.vent.trigger('click', event);
            //  Don't allow dblClick to bubble up since handling click at this level.
            return false;
        },

        _debounceOnClickAction: null,

        _doOnClickAction: function() {
            //  TODO: Prefer not to check hasClass and leverage state of a model.
            if (!this.$el.hasClass('is-disabled')) {
                this.view.doOnClickAction();
            }
        }
    });

    return ListItemButton;
});