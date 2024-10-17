angular.module('datePickerApp', ['ui.bootstrap'])
.controller('DateController', function ($scope) {
    $scope.startDate = null;
    $scope.endDate = null;
    $scope.startOpened = false;
    $scope.endOpened = false;

    $scope.openStartDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = true;
    };

    $scope.openEndDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endOpened = true;
    };
});
 const deleteButtons = document.querySelectorAll('.delete-btn');

 deleteButtons.forEach(button => {
     button.addEventListener('click', function () {
         const recordingItem = this.closest('.recording-item');
         recordingItem.remove();
     });
 });

 