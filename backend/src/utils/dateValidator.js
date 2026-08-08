export const validateBookingDate = (bookingDate) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const booking = new Date(bookingDate);

    booking.setHours(0, 0, 0, 0);

    if (booking < today) {
        return {
            valid: false,
            reason: "Booking date cannot be in the past.",
        };
    }

    const maxDate = new Date(today);

    maxDate.setDate(maxDate.getDate() + 180);

    if (booking > maxDate) {
        return {
            valid: false,
            reason: "Bookings are allowed only within 180 days.",
        };
    }

    return {
        valid: true,
    };
};