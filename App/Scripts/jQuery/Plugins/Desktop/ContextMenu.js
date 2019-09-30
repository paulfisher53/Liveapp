﻿/*! jQuery UI context menu plugin - v1.8.2 - 2015-02-08 |  https://github.com/mar10/jquery-ui-contextmenu |  Copyright (c) 2015 Martin Wendt; Licensed MIT */!function (a) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery-ui/menu"], a) : a(jQuery)
} (function (a) {
    "use strict";
    var b = "onselectstart" in document.createElement("div"),
        c = a.ui.menu.version.match(/^(\d)\.(\d+)/),
        d = {
            major: parseInt(c[1], 10),
            minor: parseInt(c[2], 10)
        },
        e = d.major < 2 && d.minor < 11;
    a.widget("moogle.contextmenu", {
        version: "@VERSION",
        options: {
            addClass: "ui-contextmenu",
            autoTrigger: !0,
            delegate: null,
            hide: {
                effect: "fadeOut",
                duration: "fast"
            },
            ignoreParentSelect: !0,
            menu: null,
            position: null,
            preventContextMenuForPopup: !1,
            preventSelect: !1,
            show: {
                effect: "slideDown",
                duration: "fast"
            },
            taphold: !1,
            uiMenuOptions: {},
            beforeOpen: a.noop,
            blur: a.noop,
            close: a.noop,
            create: a.noop,
            createMenu: a.noop,
            focus: a.noop,
            open: a.noop,
            select: a.noop
        },
        _create: function () {
            var c, d, e, f = this.options;
            if (this.$headStyle = null, this.$menu = null, this.menuIsTemp = !1, this.currentTarget = null, f.preventSelect) {
                e = (a(this.element)
                        .is(document) ? a("body") : this.element)
                    .uniqueId()
                    .attr("id"), c = "#" + e + " " + f.delegate + " { -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }", this.$headStyle = a("<style class='moogle-contextmenu-style' />")
                    .prop("type", "text/css")
                    .appendTo("head");
                try {
                    this.$headStyle.html(c)
                } catch (g) {
                    this.$headStyle[0].styleSheet.cssText = c
                }
                b && this.element.delegate(f.delegate, "selectstart" + this.eventNamespace, function (a) {
                    a.preventDefault()
                })
            }
            this._createUiMenu(f.menu), d = "contextmenu" + this.eventNamespace, f.taphold && (d += " taphold" + this.eventNamespace), this.element.delegate(f.delegate, d, a.proxy(this._openMenu, this))
        },
        _destroy: function () {
            this.element.undelegate(this.eventNamespace), this._createUiMenu(null), this.$headStyle && (this.$headStyle.remove(), this.$headStyle = null)
        },
        _createUiMenu: function (b) {
            var c, d = this.options;
            this.isOpen() && (c = this.currentTarget, this._closeMenu(!0), this.currentTarget = c), this.menuIsTemp ? this.$menu.remove() : this.$menu && this.$menu.menu("destroy")
                .removeClass(this.options.addClass)
                .hide(), this.$menu = null, this.menuIsTemp = !1, b && (a.isArray(b) ? (this.$menu = a.moogle.contextmenu.createMenuMarkup(b), this.menuIsTemp = !0) : this.$menu = "string" == typeof b ? a(b) : b, this.$menu.hide()
                    .addClass(d.addClass)
                    .menu(a.extend(!0, {}, d.uiMenuOptions, {
                        blur: a.proxy(d.blur, this),
                        create: a.proxy(d.createMenu, this),
                        focus: a.proxy(d.focus, this),
                        select: a.proxy(function (b, c) {
                            var e, f = a.moogle.contextmenu.isMenu(c.item),
                                g = c.item.data("actionHandler");
                            c.cmd = c.item.attr("data-command"), c.target = a(this.currentTarget), f && d.ignoreParentSelect || (e = this._trigger.call(this, "select", b, c), g && (e = g.call(this, b, c)), e !== !1 && this._closeMenu.call(this), b.preventDefault())
                        }, this)
                    })))
        },
        _openMenu: function (b, c) {
            var d, e, f = this.options,
                g = f.position,
                h = this,
                i = !!b.isTrigger,
                j = {
                    menu: this.$menu,
                    target: a(b.target),
                    extraData: b.extraData,
                    originalEvent: b,
                    result: null
                };
            if (f.autoTrigger || i) {
                if (b.preventDefault(), this.currentTarget = b.target, !c) {
                    if (d = this._trigger("beforeOpen", b, j), e = j.result && a.isFunction(j.result.promise) ? j.result : null, j.result = null, d === !1) return this.currentTarget = null, !1;
                    if (e) return e.done(function () {
                        h._openMenu(b, !0)
                    }), this.currentTarget = null, !1;
                    j.menu = this.$menu
                }
                a(document)
                    .bind("keydown" + this.eventNamespace, function (b) {
                        b.which === a.ui.keyCode.ESCAPE && h._closeMenu()
                    })
                    .bind("mousedown" + this.eventNamespace + " touchstart" + this.eventNamespace, function (b) {
                        a(b.target)
                            .closest(".ui-menu-item")
                            .length || h._closeMenu()
                    }), a.isFunction(g) && (g = g(b, j)), g = a.extend({
                        my: "left top",
                        at: "left bottom",
                        of: void 0 === b.pageX ? b.target : b,
                        collision: "fit"
                    }, g); 
                    if(this.$menu)
                    this.$menu.show()
                    .css({
                        position: "absolute",
                        left: 0,
                        top: 0,
                        'z-index': 40001
                    })
                    .position(g)
                    .hide(), f.preventContextMenuForPopup && this.$menu.bind("contextmenu" + this.eventNamespace, function (a) {
                        a.preventDefault()
                    }), this._show(this.$menu, this.options.show, function () {
                        h._trigger.call(h, "open", b, j)
                    })
            }
        },
        _closeMenu: function (b) {
            var c = this,
                d = b ? !1 : this.options.hide;
            a(document)
                .unbind("mousedown" + this.eventNamespace)
                .unbind("touchstart" + this.eventNamespace)
                .unbind("keydown" + this.eventNamespace), c.currentTarget = null, this.$menu ? (this.$menu.unbind("contextmenu" + this.eventNamespace), this._hide(this.$menu, d, function () {
                    c._trigger("close")
                })) : c._trigger("close")
            this._destroy();
        },
        _setOption: function (b, c) {
            switch (b) {
                case "menu":
                    this.replaceMenu(c)
            }
            a.Widget.prototype._setOption.apply(this, arguments)
        },
        _getMenuEntry: function (a) {
            return this.$menu.find("li[data-command=" + a + "]")
        },
        close: function () {
            this.isOpen() && this._closeMenu()
        },
        enableEntry: function (a, b) {
            this._getMenuEntry(a)
                .toggleClass("ui-state-disabled", b === !1)
        },
        getMenu: function () {
            return this.$menu
        },
        isOpen: function () {
            return !!this.$menu && !!this.currentTarget
        },
        open: function (a, b) {
            b = b || {};
            var c = jQuery.Event("contextmenu", {
                target: a.get(0),
                extraData: b
            });
            return this.element.trigger(c)
        },
        replaceMenu: function (a) {
            this._createUiMenu(a)
        },
        setEntry: function (b, c) {
            var d, e = this._getMenuEntry(b);
            "string" == typeof c ? a.moogle.contextmenu.updateTitle(e, c) : (e.empty(), c.cmd = c.cmd || b, a.moogle.contextmenu.createEntryMarkup(c, e), a.isArray(c.children) && (d = a("<ul/>")
                    .appendTo(e), a.moogle.contextmenu.createMenuMarkup(c.children, d)), this.getMenu()
                .menu("refresh"))
        },
        showEntry: function (a, b) {
            this._getMenuEntry(a)
                .toggle(b !== !1)
        }
    }), a.extend(a.moogle.contextmenu, {
        createEntryMarkup: function (b, c) {
            var d = null;
            /[^\-\u2014\u2013\s]/.test(b.title) ? (e ? (c.attr("data-command", b.cmd), d = a("<a/>", {
                html: "" + b.title,
                href: "#"
            })
                .appendTo(c), b.uiIcon && d.append(a("<span class='ui-icon' />")
                    .addClass(b.uiIcon))) : (c.attr("data-command", b.cmd)
                .html("" + b.title), a.isFunction(b.action) && c.data("actionHandler", b.action), b.uiIcon && c.append(a("<span class='ui-icon' />")
                    .addClass(b.uiIcon))), a.isFunction(b.action) && c.data("actionHandler", b.action), b.disabled && c.addClass("ui-state-disabled"), b.addClass && c.addClass(b.addClass), a.isPlainObject(b.data) && c.data(b.data)) : c.text(b.title)
        },
        createMenuMarkup: function (b, c) {
            var d, e, f, g;
            for (null == c && (c = a("<ul class='ui-helper-hidden' />")
                    .appendTo("body")), d = 0; d < b.length; d++) e = b[d], g = a("<li style='width: 220px' />")
                .appendTo(c), a.moogle.contextmenu.createEntryMarkup(e, g), a.isArray(e.children) && (f = a("<ul/>")
                    .appendTo(g), a.moogle.contextmenu.createMenuMarkup(e.children, f));
            return c
        },
        isMenu: function (a) {
            return e ? a.has(">a[aria-haspopup='true']")
                .length > 0 : a.is("[aria-haspopup='true']")
        },
        replaceFirstTextNodeChild: function (a, b) {
            a.contents()
                .filter(function () {
                    return 3 === this.nodeType
                })
                .first()
                .replaceWith(b)
        },
        updateTitle: function (b, c) {
            e ? a.moogle.contextmenu.replaceFirstTextNodeChild(a("a", b), c) : a.moogle.contextmenu.replaceFirstTextNodeChild(b, c)
        }
    })
});
//# sourceMappingURL=jquery.ui-contextmenu.min.js.map
