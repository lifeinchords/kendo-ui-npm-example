import angular from "angular";

import "@progress/kendo-ui/js/kendo.multiselect.js";
import "@progress/kendo-ui/js/kendo.angular.js";

import './scss/app.scss';
/*
angular.module("KendoDemos", ["kendo.directives"])
    .controller("MyCtrl", function ($scope) {
        $scope.selectOptions = {
            placeholder: "select",
            dataTextField: "name",
            dataValueField: "id",
            dataSource: {
                transport: {
                    read: {
                        url: "https://population.un.org/workprogramme/api/sections",
                        dataType: "json"
                    }
                }
            }
        };
        $scope.selectedItems = [{ name: "Office of the Directdor", id: 1 }];
    });

*/

angular.module("KendoDemos", ["kendo.directives"])
    .controller("MyCtrl", function ($scope) {
        $scope.selectOptions = {
            placeholder: "Select products...",
            dataTextField: "ProductName",
            dataValueField: "ProductID",
            dataSource: {
                transport: {
                    read: {
                        url: "http://demos.telerik.com/kendo-ui/service/products",
                        dataType: "jsonp"
                    }
                }
            }
        };
        $scope.selectedItems = [{ ProductName: "Chai", ProductID: 1 }];
    });

