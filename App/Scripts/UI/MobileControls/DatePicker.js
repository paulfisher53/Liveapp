﻿/// <reference path="../Application.js" />

Define("DatePicker",

    function (field_, viewer_) {
        return new Control("DatePicker", field_, viewer_);
    },

    function () {

        //#region Members

        var _self = this;
        var _base = null;

        //#endregion

        //#region Public Methods

        this.Constructor = function () {

            //Setup _base.            
            _base = Base("DatePicker");
        };

        this.Create = function (window_) {

            //Create the control.
            var container = $('<label id="lbl' + _base.ID() + '" for="ctl' + _base.ID() + '" style="font-weight: bold;"></label><div class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-a"><input type="text" id="ctl' + _base.ID() + '" value=""></div>');

            var mode = "calbox";
            if (_base.Field()) {
                mode = Default(Application.OptionValue(_base.Field().Options, "mode"), "calbox");
            }

			var years = parseInt(Default(Application.OptionValue(_base.Field().Options, "years"), 20));
			
            //Call base method.
            _base.Create(window_, container, _self.OnValueChange, function (cont) {

                cont.unbind("focus").unbind("blur");

                cont.datebox({
                    mode: mode,
                    useFocus: true,
                    useClearButton: true,
                    theme: "a",
                    calUsePickers: true,
                    popupPosition: 'window',
                    useTodayButton: true,
                    calHighToday: true,
                    themeDateToday: 'c',
					calYearPickMax: years,
					calYearPickMin: years
                });               

            });
        };

        //#endregion

        //#region Overloaded Methods

        this.Update = function (rec_) {

            Application.LogInfo("Updating mobile control: " + _base.ID() + ", Caption: " + _base.Field().Caption);

            var value = rec_[_base.Field().Name];
            if (typeof value == 'undefined') {
                _self.Loaded(true);
                return;
            }

            _base.Control().val(Application.FormatDate(value));

            _self.Loaded(true);
        };

        //#endregion

        //#region Overrideable Methods

        this.OnValueChange = function (name, value) {
            return true;
        };

        //#endregion

        //Constructor
        this.Constructor();

    });