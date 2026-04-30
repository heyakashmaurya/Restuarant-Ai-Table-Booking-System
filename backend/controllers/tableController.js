import Table from "../models/Table.js";

/* ---------------------------------- */
/* Create Table                       */
/* ---------------------------------- */
export const createTable = async (req, res) => {
  try {
    const { number, capacity, area, status } = req.body;

    const exists = await Table.findOne({ number });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Table number already exists"
      });
    }

    const table = await Table.create({
      number,
      capacity,
      area,
      status
    });

    res.status(201).json({
      success: true,
      table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------------------------- */
/* Get All Tables                     */
/* ---------------------------------- */
export const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ capacity: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------------------------- */
/* Update Table Status                */
/* ---------------------------------- */
export const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const table = await Table.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found"
      });
    }

    res.status(200).json({
      success: true,
      table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------------------------- */
/* Delete Table                       */
/* ---------------------------------- */
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByIdAndDelete(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Table deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};