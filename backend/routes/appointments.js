import express from "express";
import getToken from "../utils/getToken.js";
import {
	getAppointments,
	getAppointmentSlots,
} from "../utils/getAppointments.js";

const router = express.Router();

router.get("/appointments", async (req, res) => {
	let currentMonth = req.query.currentMonth;
	let startAfter, startBefore;
	if (currentMonth == 1 || currentMonth == null) {
		// get appointments for the current month
		const date = new Date();
		startAfter = new Date(date.getFullYear(), date.getMonth(), 1);
		startBefore = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	} else {
		// get appointments for the next month
		const date = new Date();
		startAfter = new Date(date.getFullYear(), date.getMonth() + 1, 1);
		startBefore = new Date(date.getFullYear(), date.getMonth() + 2, 0);
	}

	const token = await getToken();
	const appointments = await getAppointments(token, startBefore, startAfter);
	res.send(appointments);
});

router.get("/appointments/slots", async (req, res) => {
	const date = req.query.date;
	if (!date) {
		res.status(400).send("Date is required");
	}
	if (isNaN(Date.parse(date))) {
		res.status(400).send("Invalid date");
	}

	const token = await getToken();
	const appointmentSlots = await getAppointmentSlots(token, date);
	res.send(appointmentSlots);
});

export default router;
