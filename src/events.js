// @flow
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
 
        if ($("#mySidepanel").width() === 0) {
            document.getElementById("mySidepanel").style.width = "350px";
            document.getElementById("sideBt").style.left = "350px";

        } else {
            document.getElementById("mySidepanel").style.width = "0px";
            document.getElementById("sideBt").style.left = "0px";

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
        openSidePanel:openSidePanel
    };
})();
