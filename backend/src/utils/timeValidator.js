export const validateBookingTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);

    if (
        Number.isNaN(hour) ||
        Number.isNaN(minute) ||
        hour < 0 ||
        hour > 23 ||
        minute < 0 ||
        minute > 59
    ) {
        return {
            valid: false,
            reason: "Invalid booking time.",
        };
    }

    return {
        valid: true,
    };
};