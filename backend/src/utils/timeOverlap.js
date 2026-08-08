/*
|--------------------------------------------------------------------------
| Convert "18:30" -> Minutes
|--------------------------------------------------------------------------
*/

export const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);

    return (hours * 60) + minutes;
};

/*
|--------------------------------------------------------------------------
| Check Time Overlap
|--------------------------------------------------------------------------
*/

export const isTimeOverlapping = ({
    existingStart,
    existingEnd,
    requestedStart,
    requestedEnd,
}) => {

    const existingStartMin = timeToMinutes(existingStart);
    const existingEndMin = timeToMinutes(existingEnd);

    const requestedStartMin = timeToMinutes(requestedStart);
    const requestedEndMin = timeToMinutes(requestedEnd);

    return (
        requestedStartMin < existingEndMin &&
        requestedEndMin > existingStartMin
    );
};