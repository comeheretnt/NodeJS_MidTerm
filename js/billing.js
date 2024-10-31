// Lấy thông tin đặt phòng từ API
async function getBookingInfo() {
    try {
        const response = await fetch('https://671a0554acf9aa94f6a8c48f.mockapi.io/T_booking');
        const bookingData = await response.json();

        console.log(bookingData); 

        if (bookingData && bookingData.length > 0) {
            const booking = bookingData[bookingData.length - 1]; // Lấy bản ghi mới nhất

            const arrivalDateString = booking.ArriveDay; 
            const departureDateString = booking.DepartDay; 
            
            if (arrivalDateString && departureDateString) {
                const arrivalDate = new Date(arrivalDateString);
                const departureDate = new Date(departureDateString);

                // Hiển thị ngày tháng ở định dạng DD/MM/YYYY
                document.getElementById("arrival").innerText = formatDate(arrivalDate);
                document.getElementById("departure").innerText = formatDate(departureDate);

                const lengthOfStay = Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24));
                document.getElementById("lengthOfStay").innerText = lengthOfStay + " Nights";
                document.getElementById("guests").innerText = `${booking.adults} Adults, ${booking.children} Children`;

                const roomType = booking.Room;
                document.getElementById("room").innerText = roomType;
                await calculateRoomFee(roomType, lengthOfStay); 
            } else {
                displayNoData(); 
            }
        } else {
            displayNoData(); 
        }
    } catch (error) {
        console.error("Error fetching booking information:", error);
        displayNoData(); 
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Hiển thị thông tin không có dữ liệu
function displayNoData() {
    document.getElementById("arrival").innerText = "No data";
    document.getElementById("departure").innerText = "No data";
    document.getElementById("lengthOfStay").innerText = "No data";
    document.getElementById("room").innerText = "No data";
    document.getElementById("guests").innerText = "0 Adults, 0 Children";
    document.getElementById("totalCost").innerText = "$0"; 
}

// Tính toán phí phòng dựa trên loại phòng và số đêm ở
async function calculateRoomFee(roomType, lengthOfStay) {
    try {
        const response = await fetch('https://671a0554acf9aa94f6a8c48f.mockapi.io/T_room');
        const rooms = await response.json();
        const room = rooms.find(r => r.name === roomType); 

        let roomPrice = 0;
        if (room) {
            roomPrice = room.price; 
        } else {
            console.warn("Room not found, using default price.");
            roomPrice = 200; 
        }

        calculateTotalCost(roomPrice, lengthOfStay); 
    } catch (error) {
        console.error("Error calculating room fee:", error);
    }
}

// Tính toán tổng chi phí
function calculateTotalCost(roomPrice, lengthOfStay) {
    const totalCost = roomPrice * lengthOfStay; // Tính tổng chi phí
    document.getElementById("totalCost").innerText = `$${totalCost}`; // Hiển thị tổng chi phí
}

// Gửi thông tin khách hàng và thanh toán lên API
async function submitGuestInfo() {
    const guestInfo = {
        Firstname: document.getElementById("firstName").value,
        Lastname: document.getElementById("lastName").value,
        phone: document.getElementById("number").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address1").value,
        request: document.getElementById("request").value,
        Arriveday: document.getElementById("arrival").innerText.split('/').reverse().join('-'), 
        Departday: document.getElementById("departure").innerText.split('/').reverse().join('-'), 
        room: document.getElementById("room").innerText,
        guest: `${document.getElementById("guests").innerText}`, // Hiển thị thông tin khách
        total: document.getElementById("totalCost").innerText
    };

    try {
        const response = await fetch('https://672211ba2108960b9cc2c893.mockapi.io/T_guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(guestInfo)
        });

        if (response.ok) {
            alert("Booking information saved successfully!");
        } else {
            alert("Failed to save booking information.");
        }
    } catch (error) {
        console.error("Error saving guest information:", error);
        alert("An error occurred while saving the information.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getBookingInfo();
});
