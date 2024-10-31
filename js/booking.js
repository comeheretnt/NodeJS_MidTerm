async function proceedToBooking() {
    const checkInDate = document.getElementById("checkInDate").value;
    const checkOutDate = document.getElementById("checkOutDate").value;
    const numAdults = parseInt(document.getElementById("numAdults").value);
    const numChildren = parseInt(document.getElementById("numChildren").value);

    if (!checkInDate || !checkOutDate || isNaN(numAdults) || isNaN(numChildren)) {
        alert("Hãy điền đầy đủ thông tin.");
        return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Kiểm tra ngày check-out
    if (checkIn >= checkOut) {
        alert("Ngày check-out phải lớn hơn ngày check-in.");
        return;
    }

    try {
        const roomResponse = await fetch("https://671a0554acf9aa94f6a8c48f.mockapi.io/T_room");
        if (!roomResponse.ok) throw new Error("Lỗi khi lấy dữ liệu phòng.");

        const rooms = await roomResponse.json();
        const availableRooms = rooms.filter(room => {
            const roomCheckIn = new Date(room.checkin);
            const roomCheckOut = new Date(room.checkout);
            return !(checkIn >= roomCheckOut || checkOut <= roomCheckIn);
        });

        // Kiểm tra nếu có phòng phù hợp
        if (availableRooms.length === 0) {
            alert("Không có phòng nào phù hợp với tiêu chí của bạn.");
            return;
        }

        const selectedRoom = availableRooms[0];
        const bookingData = {
            ArriveDay: checkIn.toISOString(),
            DepartDay: checkOut.toISOString(),
            adults: numAdults,
            children: numChildren,
            Room: selectedRoom.name 
        };

        // Gửi yêu cầu đặt phòng
        const bookingResponse = await fetch("https://671a0554acf9aa94f6a8c48f.mockapi.io/T_booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });

        if (!bookingResponse.ok) throw new Error("Đặt phòng không thành công.");
        alert("Đặt phòng thành công!");
        window.location.href = 'billing.html';
    } catch (error) {
        console.error("Lỗi khi tạo đặt phòng:", error);
        alert("Đã xảy ra lỗi khi đặt phòng. Vui lòng thử lại.");
    }
}
