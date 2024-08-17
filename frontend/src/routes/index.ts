import { createFileRoute } from "@tanstack/react-router";
// import { Home } from "../pages/Home";
// Import the appointment calendar component
import AppointmentCalendar from "../components/AppointmentCalendar";

export const Route = createFileRoute("/")({
	component: AppointmentCalendar,
});
