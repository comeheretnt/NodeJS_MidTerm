const url = 'https://671a0554acf9aa94f6a8c48f.mockapi.io/T_room';

// Function to get the hotel ID from the URL
function getHotelIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function fetchHotelDetails(hotelId, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${url}/${hotelId}`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            callback(null, data);
        } else {
            callback(new Error('Error fetching hotel details'));
        }
    };
    xhr.onerror = function() {
        callback(new Error('Request error'));
    };
    xhr.send();
}

function displayHotelDetails() {
    const hotelId = getHotelIdFromUrl();
    fetchHotelDetails(hotelId, function(error, data) {
        if (error) {
            console.error("Error:", error);
            document.getElementById('div_details').innerHTML = "<p>Error loading hotel details.</p>";
            return;
        }

        const details = `
            <h1>${data.name}</h1>
            <img src="${data.image}" alt="Hotel Image">
            <p>Price: $${data.price}/night</p>
            <p>Description: ${data.description}</p>
        `;
        document.getElementById('div_details').innerHTML = details;
    });
}

// Gọi hàm để hiển thị chi tiết khách sạn khi trang được tải
document.addEventListener('DOMContentLoaded', displayHotelDetails);
