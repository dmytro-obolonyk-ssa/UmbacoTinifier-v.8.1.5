angular.module("umbraco").controller("Tinifier.Section1.Controller",
    function ($scope, $http, $injector, notificationsService, editorService) {
        $scope.report = {};
        $scope.report.Name = "";
        $scope.report.Email = "";
        $scope.report.Descroption = "";
        $scope.report.Type = "Bug";

        let spinner = "<i class=\"fas fa-spinner\"></i>";


        $scope.submit = function () {

            let formIsValid = ValidateForm();
            if (!formIsValid)
                return;

            let model = $scope.report;

            let submitBtn = $("#submit-btn");

            submitBtn.empty();
            submitBtn.append("<i class=\"icon-timer\"></i>");
            submitBtn.prop('disabled', true);


            let timerId = setTimeout(() => {

                $("#submit-btn").empty();
                $("#submit-btn").append("<i class=\"icon-wrong\"></i>");
                $("#submit-btn").css('background-color', "#ff8000");
                $("#submit-btn").prop('disabled', false);
                notificationsService.success("Report sent");

            }, 2000);

            //$http.post(`/umbraco/backoffice/api/ContactUs/Report`, JSON.stringify(model)).then(postSuccessCallback, postErrorCallback);
            //
            //function postSuccessCallback(response) {
            //   submitBtn.empty();
            //   submitBtn.append("<i class=\"icon-check\"></i>");
            //    submitBtn.prop('disabled', false);
            //    notificationsService.success("Report sent");
            //}
            //
            //function postErrorCallback(error) {
            //    submitBtn.empty();
            //    submitBtn.append("<i class=\"icon-wrong\"></i>");
            //    submitBtn.css('background-color', "#ff8000");
            //    submitBtn.prop('disabled', false);
            //    notificationsService.error("Error. Server is unavaliable.");
            //}
        };


        function ValidateForm() {
            let result = true;
            let defaultBorder = "1px solid #d8d7d9";
            let invalidBorder = "2px solid red";
            let nameInput = $("#nameInput");
            let emailInput = $("#emailInput");
            let descriptionText = $("#descriptionText");

            if (nameInput.val() === "") {
                nameInput.css("border", invalidBorder);
                result = false;
            } else 
                nameInput.css("border", defaultBorder);

            if (emailInput.val() === "") {
                emailInput.css("border", invalidBorder);
                result = false;
            } else 
                emailInput.css("border", defaultBorder);

            if (descriptionText.val() === "") {
                descriptionText.css("border", invalidBorder);
                result = false;
            } else 
                descriptionText.css("border", defaultBorder);

            return result;
        }
    });