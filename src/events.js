// @flow

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

"use strict";

export var htmlEvents = (function () {


    var dropDownBT = function () {

        $(".ui.fluid.dropdown")
            .dropdown({
                maxSelections: 3,
            })
            ;
        $(".label.ui.dropdown")
            .dropdown();

        $(".no.label.ui.dropdown")
            .dropdown({
                useLabels: false
            });

        $(".ui.button").on("click", () => {

            $(".ui.dropdown")
                .dropdown("restore defaults");

        });

        $(".ui.button.fileRequest").click(function () {

            const ruta = $(this).attr("data-gpx");
            console.log("onDownload");
            window.location = ruta;

        });

        $("#infobox").hide();


        jQuery("#menuIcon").on("click", () => {

            toggleSideBar();

            $("toggle").removeClass("disabled")
                ;

        });


        $(".headerInfo").on("click", () => {

            console.info("modal");
            $(".ui.modal.info").modal("show");
            console.info("modal entra");

        });
        $("#infoallausid").on("click", () => {

            console.info("modal");
            $(".ui.modal.allaus").modal("show");
            console.info("modal entra");

        });
        $("#infolandslidesid").on("click", () => {

            console.info("modal");
            $(".ui.modal.esllavissades").modal("show");
            console.info("modal entra");

        });

        return true;
    };

    var toggleSideBar = function () {
        $("#sideBarOptions")
            .sidebar("setting", "transition", "overlay")
            .sidebar("toggle");

    }

    var openSidePanel = function (){
 
        $("#sideBt").show();
        $("#mySidepanel").show();
        if ($("#mySidepanel").width() === 0) {
            document.getElementById("mySidepanel").style.width = "350px";
            document.getElementById("sideBt").style.left = "350px";

        } else {
            document.getElementById("mySidepanel").style.width = "0px";
            document.getElementById("sideBt").style.left = "0px";

        }

    }

    var collapseSidePanel = function (){
        document.getElementById("mySidepanel").style.width = "0px";
        document.getElementById("sideBt").style.left = "0px";

    }

    var sidePanelStatus = function (active){
 
        if (active) {
            $("#sideBt").show();

        } else {
            document.getElementById("mySidepanel").style.width = "0px";
            document.getElementById("sideBt").style.left = "0px";
            $("#sideBt").hide();

        }

    }
    var toolBarAnimation = function () {
        
        $("#sideBt").on("click", function () {       
            openSidePanel();
        });

    }

    return {
        dropDownBT: dropDownBT,
        toggleSideBar: toggleSideBar,
        toolBarAnimation: toolBarAnimation,
        openSidePanel:openSidePanel,
        collapseSidePanel:collapseSidePanel,
        sidePanelStatus:sidePanelStatus
    };
})();
