// angular.module('datePickerApp', ['ui.bootstrap'])
// .controller('DateController', function ($scope) {
//     $scope.startDate = null;
//     $scope.endDate = null;
//     $scope.startOpened = false;
//     $scope.endOpened = false;

//     $scope.openStartDate = function ($event) {
//         $event.preventDefault();
//         $event.stopPropagation();
//         $scope.startOpened = true;
//     };

//     $scope.openEndDate = function ($event) {
//         $event.preventDefault();
//         $event.stopPropagation();
//         $scope.endOpened = true;
//     };
// });
//  const deleteButtons = document.querySelectorAll('.delete-btn');

//  deleteButtons.forEach(button => {
//      button.addEventListener('click', function () {
//          const recordingItem = this.closest('.recording-item');
//          recordingItem.remove();
//      });

//  });
 

//  $(document).ready(function() {
//     function loadMeetings() {
//         $.ajax({
//             url: 'http://46.250.234.244:5008/get_all_data', // Thay bằng URL endpoint chính xác
//             method: 'GET',
//             dataType: 'json',
//             success: function(response) {
//                 // Xóa nội dung cũ trước khi load dữ liệu mới
//                 $('#meetingList').empty();

//                 // Duyệt qua từng cuộc họp và thêm vào danh sách
//                 response.data.forEach(function(meeting) {
//                     let meetingHtml = `
//                         <div class="recording-item justify-content-between align-items-center p-3 mb-3" style="background-color: #e0e6ff; border-radius: 12px;">
//                             <div>
//                                 <h5 class="mb-1 fw-bold">Cuộc họp ID: ${meeting.meeting_id}</h5>
//                                 <small class="text-muted">${meeting.meeting_content.content.split('\n')[0]}</small>
//                             </div>
//                             <div class="button-group d-flex align-items-center mt-1">
//                                 <a href="RecordDetail.html?id=${meeting.meeting_id}" target="_blank">
//                                     <button class="btn btn-secondary btn-sm m-2">
//                                         <i class="fas fa-eye"></i> Xem
//                                     </button>
//                                 </a>
//                                 <button class="btn btn-outline-secondary btn-sm m-1">
//                                     <i class="fas fa-share-alt"></i> Chia sẻ
//                                 </button>
//                                 <button class="btn btn-outline-danger btn-sm m-1 delete-btn">
//                                     <i class="fas fa-trash-alt"></i> Xóa
//                                 </button>
//                             </div>
//                         </div>
//                     `;
//                     $('#meetingList').append(meetingHtml);
//                 });
//             },
//             error: function(xhr, status, error) {
//                 console.error('Lỗi khi lấy dữ liệu từ API:', error);
//                 $('#meetingList').html('<p class="text-danger">Không thể tải dữ liệu cuộc họp.</p>');
//             }
//         });
//     }

//     // Gọi hàm loadMeetings khi trang được tải
//     loadMeetings();
// });
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

$(document).ready(function() {
    function loadMeetings() {
        // Check if data exists in local storage
        let storedMeetings = localStorage.getItem('meetings');
        if (storedMeetings) {
            // If data is in local storage, parse it and render the meetings
            storedMeetings = JSON.parse(storedMeetings);
            renderMeetings(storedMeetings);
        } else {
            // If no data in local storage, fetch it from the API
            $.ajax({
                url: 'http://46.250.234.244:5008/get_all_data',
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    // Store response data in local storage
                    localStorage.setItem('meetings', JSON.stringify(response.data));
                    renderMeetings(response.data);
                },
                error: function(xhr, status, error) {
                    console.error('Lỗi khi lấy dữ liệu từ API:', error);
                    $('#meetingList').html('<p class="text-danger">Không thể tải dữ liệu cuộc họp.</p>');
                }
            });
        }
    }

    function renderMeetings(meetings) {
        // Clear the meeting list before rendering
        $('#meetingList').empty();

        meetings.forEach(function(meeting) {
            let meetingHtml = `
                <div class="recording-item justify-content-between align-items-center p-3 mb-3" style="background-color: #e0e6ff; border-radius: 12px;">
                    <div>
                        <h5 class="mb-1 fw-bold">Cuộc họp ID: ${meeting.meeting_id}</h5>
                        <small class="text-muted">${meeting.meeting_content.content.split('\n')[0]}</small>
                    </div>
                    <div class="button-group d-flex align-items-center mt-1">
                        <a href="RecordDetail.html?id=${meeting.meeting_id}" target="_blank">
                            <button class="btn btn-secondary btn-sm m-2">
                                <i class="fas fa-eye"></i> Xem
                            </button>
                        </a>
                        <button class="btn btn-outline-secondary btn-sm m-1">
                            <i class="fas fa-share-alt"></i> Chia sẻ
                        </button>
                        <button class="btn btn-outline-danger btn-sm m-1 delete-btn" data-id="${meeting.meeting_id}">
                            <i class="fas fa-trash-alt"></i> Xóa
                        </button>
                    </div>
                </div>
            `;
            $('#meetingList').append(meetingHtml);
        });

        // Re-attach delete button functionality after rendering
        attachDeleteEvent();
    }

    function attachDeleteEvent() {
        $('.delete-btn').on('click', function() {
            const meetingId = $(this).data('id');
            deleteMeeting(meetingId);
        });
    }

    function deleteMeeting(meetingId) {
        // Get data from local storage
        let meetings = JSON.parse(localStorage.getItem('meetings')) || [];

        // Filter out the meeting to be deleted
        meetings = meetings.filter(meeting => meeting.meeting_id !== meetingId);

        // Update local storage with the new data
        localStorage.setItem('meetings', JSON.stringify(meetings));

        // Re-render meetings from updated local storage
        renderMeetings(meetings);
    }

    // Load meetings when the page is ready
    loadMeetings();
});
// localStorage.clear();
