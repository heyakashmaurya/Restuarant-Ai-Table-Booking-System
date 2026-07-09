import Table from "../models/Table.js";
import Reservation from "../models/Reservation.js";

export const findBestAvailableTable = async ({
  guests,
  date,
  time
}) => {
  const tables = await Table.find({
    status: "available",
    capacity: { $gte: guests }
  }).sort({ capacity: 1 });

  for (const table of tables) {
    const existing = await Reservation.findOne({
      tableAssigned: table._id,
      date,
      time,
      status: "confirmed"
    });

    if (!existing) {
      return table;
    }
  }

  return null;
};