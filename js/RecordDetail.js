// function showTab(tabId, element) {
//     document.querySelectorAll('.tab-content').forEach(content => {
//         content.classList.remove('active');
//     });
//     document.querySelectorAll('.tabs-container button').forEach(button => {
//         button.classList.remove('active');
//     });
//     document.getElementById(tabId).classList.add('active');
//     element.classList.add('active');
// }
// function addTask() {
//     const todoList = document.getElementById('todoList');
//     const newTask = document.createElement('li');
//     newTask.innerHTML = `
//         <div class="d-flex align-items-center">
//             <div class="todo-checkbox" onclick="toggleComplete(this)">
//                 <i class="fas fa-check"></i>
//             </div>
//             <input type="text" value="Nhập việc cần làm" />
//         </div>
//         <i class="fas fa-trash-alt remove-task" onclick="removeTask(this)"></i>
//     `;


//     todoList.appendChild(newTask);


//     newTask.querySelector('input').focus();
// }

// function removeTask(element) {
//     element.parentElement.remove();
// }

// function toggleComplete(checkbox) {
//     checkbox.classList.toggle('checked');
//     const taskItem = checkbox.closest('li');
//     taskItem.classList.toggle('completed');
// }
// function getMeetingIdFromUrl() {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get('id');
// }$(document).ready(function() {
//     const meetingId = getMeetingIdFromUrl();

//     if (meetingId) {
//         $.ajax({
//             url: `http://46.250.234.244:5008/get_all_data`, // URL để lấy toàn bộ danh sách
//             method: 'GET',
//             dataType: 'json',
//             success: function(response) {
//                 // Tìm cuộc họp có meeting_id phù hợp trong mảng `data`
//                 const meetingData = response.data.find(meeting => meeting.meeting_id === meetingId);

//                 if (meetingData) {
//                     const meetingContent = meetingData.meeting_content;

//                     // Điền dữ liệu vào các phần tử HTML
//                     $('h3').text(`Cuộc họp: ${meetingData.meeting_id}`);
//                     $('small').text(`${meetingContent.date}, ${meetingContent.meeting_duration}`);

//                     // Phần "Tóm tắt" nội dung cuộc họp
//                     $('.summary-section').html(`
//                         <h5>Tóm tắt</h5>
//                         <p>${meetingContent.summary}</p>
//                         <p><strong>Chủ đề chính:</strong> ${meetingContent.main_topic}</p>
//                         <p><strong>Các điểm chính:</strong></p>
//                         <ul>
//                             ${meetingContent.key_points.map(point => `<li>${point}</li>`).join('')}
//                         </ul>
//                     `);

//                     // Phần "Danh sách việc cần làm" trong "Tóm tắt"
//                     $('#todoList').empty();
//                     meetingContent.todolist.forEach(task => {
//                         $('#todoList').append(`
//                             <li>
//                                 <div class="d-flex align-items-center">
//                                     <div class="todo-checkbox" onclick="toggleComplete(this)">
//                                         <i class="fas fa-check"></i>
//                                     </div>
//                                     <input type="text" value="${task}" readonly />
//                                 </div>
//                                 <i class="fas fa-trash-alt remove-task" onclick="removeTask(this)"></i>
//                             </li>
//                         `);
//                     });

//                     // Phần "Bản dịch" nội dung cuộc họp
//                     $('.translation-section').html(`
//                         <p class="translation-text">${meetingContent.content}</p>
//                     `);
//                 } else {
//                     $('.summary-section').text('Không tìm thấy dữ liệu chi tiết cho ID cuộc họp này.');
//                 }
//             },
//             error: function(xhr, status, error) {
//                 console.error('Lỗi khi lấy dữ liệu từ API:', error);
//                 $('.summary-section').text('Không thể tải dữ liệu cuộc họp.');
//             }
//         });
//     } else {
//         $('.summary-section').text('Không tìm thấy ID cuộc họp.');
//     }
// });
function showTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tabs-container button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
}

function addTask() {
    const todoList = document.getElementById('todoList');
    const newTask = document.createElement('li');
    newTask.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="todo-checkbox" onclick="toggleComplete(this)">
                <i class="fas fa-check"></i>
            </div>
            <input type="text" value="Nhập việc cần làm" />
        </div>
        <i class="fas fa-trash-alt remove-task" onclick="removeTask(this)"></i>
    `;

    todoList.appendChild(newTask);
    newTask.querySelector('input').focus();

    // Listen for changes in the input and save to local storage
    newTask.querySelector('input').addEventListener('change', saveToLocalStorage);

    // Update local storage immediately after adding the task
    saveToLocalStorage();
}

function removeTask(element) {
    element.parentElement.remove();
    saveToLocalStorage(); // Save changes to local storage
}

function toggleComplete(checkbox) {
    checkbox.classList.toggle('checked');
    const taskItem = checkbox.closest('li');
    taskItem.classList.toggle('completed');
    saveToLocalStorage(); // Save changes to local storage
}

function getMeetingIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function saveToLocalStorage() {
    const meetingId = getMeetingIdFromUrl();
    const tasks = Array.from(document.querySelectorAll('#todoList li input')).map(input => input.value);

    // Retrieve all meetings from local storage
    const meetings = JSON.parse(localStorage.getItem('meetings')) || [];
    const meetingIndex = meetings.findIndex(meeting => meeting.meeting_id === meetingId);

    if (meetingIndex !== -1) {
        meetings[meetingIndex].meeting_content.todolist = tasks;
    } else {
        // If meeting not found, create a new entry for it
        meetings.push({
            meeting_id: meetingId,
            meeting_content: { todolist: tasks }
        });
    }

    localStorage.setItem('meetings', JSON.stringify(meetings));
}

function formatTranslationContent(content) {
    const parts = content.split(/(Bản trình bày của bạn \(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} [APM]{2}\))/);

    return parts.map((part, index) => {
        if (part.trim()) {
            if (index % 2 !== 0) {
                // Nếu là tiêu đề, bọc trong một div với lớp `translation-block`
                return `<div class="translation-block">
                            <p class="translation-header">${part.trim()}</p>`;
            } else {
                // Nếu là nội dung, thêm vào bên trong `translation-block` đã mở
                return `<p class="translation-text">${part.trim()}</p></div>`;
            }
        }
        return '';
    }).join('');
}


function loadMeetingFromLocalStorage() {
    const meetingId = getMeetingIdFromUrl();
    const meetings = JSON.parse(localStorage.getItem('meetings')) || [];
    const meetingData = meetings.find(meeting => meeting.meeting_id === meetingId);

    if (meetingData) {
        const meetingContent = meetingData.meeting_content;

        // Populate the HTML with meeting details
        $('h3').text(`Cuộc họp: ${meetingData.meeting_id}`);
        $('small').text(`${meetingContent.date || ''}, ${meetingContent.meeting_duration || ''}`);

        // "Summary" section
        $('.summary-section').html(`
            <h5>Tóm tắt</h5>
            <p>${meetingContent.summary || ''}</p>
            <p><strong>Chủ đề chính:</strong> ${meetingContent.main_topic || ''}</p>
            <p><strong>Các điểm chính:</strong></p>
            <ul>
                ${(meetingContent.key_points || []).map(point => `<li>${point}</li>`).join('')}
            </ul>
        `);

        // "To-Do List" section
        $('#todoList').empty();
        (meetingContent.todolist || []).forEach(task => {
            $('#todoList').append(`
                <li>
                    <div class="d-flex align-items-center">
                        <div class="todo-checkbox" onclick="toggleComplete(this)">
                            <i class="fas fa-check"></i>
                        </div>
                        <input type="text" value="${task}" />
                    </div>
                    <i class="fas fa-trash-alt remove-task" onclick="removeTask(this)"></i>
                </li>
            `);
        });

        document.querySelectorAll('#todoList li input').forEach(input => {
            input.addEventListener('change', saveToLocalStorage);
        });

        // "Translation" section - sử dụng hàm formatTranslationContent để định dạng
        $('.translation-section').html(formatTranslationContent(meetingContent.content || ''));
    } else {
        $('.summary-section').text('Không tìm thấy dữ liệu chi tiết cho ID cuộc họp này.');
    }
}


function deleteMeetingFromLocalStorage(meetingId) {
    const meetings = JSON.parse(localStorage.getItem('meetings')) || [];
    const updatedMeetings = meetings.filter(meeting => meeting.meeting_id !== meetingId);
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
}

function fetchAndStoreMeetings() {
    $.ajax({
        url: `http://46.250.234.244:5008/get_all_data`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            // Save response data to local storage
            localStorage.setItem('meetings', JSON.stringify(response.data));
            loadMeetingFromLocalStorage(); // Load data from local storage
        },
        error: function(xhr, status, error) {
            console.error('Lỗi khi lấy dữ liệu từ API:', error);
            $('.summary-section').text('Không thể tải dữ liệu cuộc họp.');
        }
    });
}

$(document).ready(function() {
    const meetingId = getMeetingIdFromUrl();
    if (meetingId) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        if (meetings) {
            loadMeetingFromLocalStorage();
        } else {
            fetchAndStoreMeetings();
        }
    } else {
        $('.summary-section').text('Không tìm thấy ID cuộc họp.');
    }
});

