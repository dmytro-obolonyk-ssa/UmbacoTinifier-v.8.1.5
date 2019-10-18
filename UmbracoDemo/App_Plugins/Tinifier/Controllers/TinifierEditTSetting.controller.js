﻿angular.module("umbraco").controller("Tinifier.TinifierEditTSetting.Controller",
    function ($scope, $http, $injector, $routeParams, notificationsService, editorService, appState, eventsService) {
        // Get settings
        $scope.timage = {};
        let settingsIsLoading = true;

        // Fill select dropdown
        $scope.options = [
            { value: false, label: "False" },
            { value: true, label: "True" }
        ];

        function HideLeftPannel() {
            var contentwrapperContainer = document.getElementById("contentwrapper");
            var navigationContainer = document.getElementById("navigation");
            appState.setGlobalState("showNavigation", false);
            contentwrapperContainer.style.left = "0px";
            navigationContainer.style.width = "0px";
        }

        function SetDefaultLeftPannel() {
            var element = document.getElementById("contentwrapper");
            defaultContentwrapperStyle = window.getComputedStyle(element, null).getPropertyValue("left");
            appState.setGlobalState("showNavigation", true);
            element.removeAttribute("style");

            navigationContainer = document.getElementById("navigation");
            navigationContainer.removeAttribute("style");
        }

        //HideLeftPannel();

        var subscriber = eventsService.on('appState.sectionState.changed', function (event, args) {

            if (!args.value)
                return;
            if (args.value != "tinifier") {

                SetDefaultLeftPannel();
                eventsService.unsubscribe(subscriber);
            }
        });

        // Fill form from web api
        notificationsService.success("Loading ...");
        let loadingSettingsnotification = notificationsService.current[0];
        $http.get(`/umbraco/backoffice/api/TinifierSettings/GetTSetting`).then(
            function (response) {
                settingsIsLoading = false;
                notificationsService.remove(loadingSettingsnotification);
                $scope.timage = response.data;
                if ($scope.timage.HideLeftPanel)
                    HideLeftPannel();
                else
                    SetDefaultLeftPannel();
            },
            function (error) {
                settingsIsLoading = false;
                notificationsService.remove(loadingSettingsnotification);
                notificationsService.error("Server error!");
            });

        $scope.submit = function () {
            SubmitSettings();
        };

        $scope.stopTinifing = function () {
            var options = {
                title: "The confirmation",
                view: "/App_Plugins/Tinifier/Backoffice/Dashboards/StopTinifyingConfirmation.html"
            };

            editorService.open(options);
        };

        $scope.tinifyEverything = function () {
            var options = {
                title: "The confirmation",
                view: "/App_Plugins/Tinifier/Backoffice/Dashboards/TinifyAll.html"
            };

            editorService.open(options);
        };

        var savinfInProcessNotification = null;
        function SubmitSettings() {

            //notificationsService.add({
            //    view: "/App_Plugins/Tinifier/BackOffice/Dashboards/TestNotification.html",
            //    sticky: true,
            //    type: 'custom'
            //});
            //return true;

            timage = $scope.timage;
            timage.ApiKey = $('#apiKey').val();

            if (timage.ApiKey === "") {
                notificationsService.warning("Settings can`t be saved! Please, fill in the ApiKey form. You can get it on a TinyPNG website");
                $("#apiKey").css("border", "2px solid red");
                return;
            }
            $("#apiKey").css("border", "");
            notificationsService.success("Saving in progress ...");
            savinfInProcessNotification = notificationsService.current[0];
            settingsIsLoading = true;

            $http.post(`/umbraco/backoffice/api/TinifierSettings/PostTSetting`, JSON.stringify(timage)).then(postSuccessCallback, postErrorCallback);
            
            function postSuccessCallback(response) {

                for (var i = 0; i < notificationsService.current.length; i++) {
                    notificationsService.remove(notificationsService.current[i]);
                };

                notificationsService.remove(savinfInProcessNotification);
                notificationsService.success("✔️ Settings successfully saved!");
                settingsIsLoading = false;

                if ($scope.timage.HideLeftPanel)
                    HideLeftPannel();
                else
                    SetDefaultLeftPannel();
            }

            function postErrorCallback(error) {
                notificationsService.remove();
                settingsIsLoading = false;

                if (error.Error === 1) {
                    notificationsService.warning("Warning", error.message);
                }
                else {
                    notificationsService.error("Error", error.data.headline + " " + error.data.message);
                }
            }
        }

        $(document).ready(function () {
            var previousApiKey = "";

            $("#apiKey").focusout(function () {
                ValidateApiKey();
            });

            $("#apiKey").focus(function () {
                previousApiKey = $('#apiKey').val();
            });

            $("#apiKey").keypress(function (event) {
                if (event.charCode == 13)
                    ValidateApiKey();
            });

            $scope.hideLeftPanelSetting = function () {
                if (!settingsIsLoading) {
                    $scope.timage.HideLeftPanel = !$scope.timage.HideLeftPanel;
                    SubmitSettings();
                }
            };

            $scope.preserveMetadataSetting = function () {
                if (!settingsIsLoading) {
                    $scope.timage.PreserveMetadata = !$scope.timage.PreserveMetadata;
                    SubmitSettings();
                }
            };

            $scope.enableUndoOptimizationSetting = function () {
                if (!settingsIsLoading) {
                    $scope.timage.EnableUndoOptimization = !$scope.timage.EnableUndoOptimization;
                    SubmitSettings();
                }
            };

            $scope.enableOptimizationOnUploadSetting = function () {
                if (!settingsIsLoading) {
                    $scope.timage.EnableOptimizationOnUpload = !$scope.timage.EnableOptimizationOnUpload;
                    SubmitSettings();
                }
            };

            function ValidateApiKey() {
                var actualApiKey = $('#apiKey').val();

                if (previousApiKey == null)
                    previousApiKey = "";

                if (previousApiKey !== actualApiKey)
                    SubmitSettings();

                previousApiKey = actualApiKey;
            }
        });
    });