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
         
            window.location = ruta;

        });

        $("#infobox").hide();


        jQuery("#menuIcon").on("click", () => {

            toggleSideBar();

            $("toggle").removeClass("disabled")
                ;

        });


        $(".headerInfo").on("click", () => {

          
            $(".ui.modal.info").modal("show");
          

        });
        $("#infoallausid").on("click", () => {

        
            $(".ui.modal.allaus").modal("show");
          

        });
        $("#infolandslidesid").on("click", () => {

        
            $(".ui.modal.esllavissades").modal("show");
        ;

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
