export const calculateEndTime = (
    startTime,
    duration = 90
) => {

    const [hours, minutes] =
        startTime.split(":").map(Number);

    const totalMinutes =
        (hours * 60) + minutes + duration;

    const endHour =
        Math.floor(totalMinutes / 60) % 24;

    const endMinute =
        totalMinutes % 60;

    return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
};