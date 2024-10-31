document.querySelector('.search-btn').addEventListener('click', function () {
    const checkInDate = document.querySelector('.booking-form input[type="date"]').value;
    const checkOutDate = document.querySelectorAll('.booking-form input[type="date"]')[1].value;
    const adults = document.querySelector('.booking-form input[placeholder="Number of Adults"]').value;
    const kids = document.querySelector('.booking-form input[placeholder="Number of Kids"]').value;
    const roomType = document.querySelector('.booking-form select').value;

    // Kiểm tra dữ liệu đầu vào
    if (!checkInDate || !checkOutDate || adults === '' || kids === '' || roomType === 'Select Room Type') {
        alert("Please fill in all fields.");
        return;
    }

    fetch('https://671a0554acf9aa94f6a8c48f.mockapi.io/T_room')
        .then(response => response.json())
        .then(rooms => {
            const filteredRooms = rooms.filter(room => {
                // Kiểm tra loại phòng
                if (roomType && room.name !== roomType) return false;

                // Có thể bổ sung điều kiện khác nếu cần
                return true;
            });

            const divResult = document.getElementById('div_result');
            divResult.innerHTML = ''; // Xóa nội dung cũ
            if (filteredRooms.length === 0) {
                divResult.innerHTML = '<p>No rooms found matching your criteria.</p>';
            } else {
                filteredRooms.forEach(room => {
                    const roomCard = `
                        <div class="room-card" data-id="${room.id}">
                            <img src="${room.image}" alt="${room.name}">
                            <div class="room-details">
                                <h3>${room.name}</h3>
                                <p>${room.price}$/Per Night</p>
                                <p>${room.description}</p>
                            </div>
                        </div>
                    `;
                    divResult.innerHTML += roomCard;
                });
            }
            document.querySelector('.search-results').style.display = 'block';
        })
        .catch(error => {
            console.error("Error fetching search results:", error);
        });
});
