const url = 'https://671a0554acf9aa94f6a8c48f.mockapi.io/T_room';

function getRooms(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            callback(null, data);
        } else {
            callback(new Error('Failed to load data'));
        }
    };
    xhr.onerror = function() {
        callback(new Error('Request error'));
    };
    xhr.send();
}

function displayRooms() {   
    getRooms(function(error, rooms) {
        if (error) {
            console.error("Error fetching rooms:", error);
            return;
        }

        const roomGrid = document.querySelector('.room-grid');
        roomGrid.innerHTML = '';

        rooms.forEach(room => {
            const card = `
            <div class="room-card" data-id="${room.id}">
                <img src="${room.image}" alt="${room.name}">
                <div class="room-details">
                    <h3>${room.name}</h3>
                    <p class="price">${room.price}$/Per Night</p>
                    <p class="description">${room.description}</p>
                    <button class="book-now" onclick="openBookingModal()">Book Now</button>
                </div>
            </div>
            `;
            roomGrid.innerHTML += card;
        });

        const roomCards = document.querySelectorAll('.room-card');
        roomCards.forEach(card => {
            card.onclick = function(event) {
                if (event.target.classList.contains('book-now')) {
                    return;
                }
                const roomId = card.getAttribute('data-id');
                window.location.href = `detail.html?id=${roomId}`;
            };
        });
    });
}

document.addEventListener('DOMContentLoaded', displayRooms);
