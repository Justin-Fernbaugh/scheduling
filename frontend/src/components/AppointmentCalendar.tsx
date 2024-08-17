import { useState, useEffect } from "react";
import axios from "axios";

// Errors encountered: UTC time to local time due to day being off by -1, typescript related errors due to the slot interface.
const AppointmentCalendar = (): JSX.Element => {
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	interface Availability {
		availability: boolean;
		date: Date;
	}

	interface Slot {
		id: string;
		start: string;
		end: string;
		serviceType: string | Array<string>;
		location: {
			id: string;
			name: string;
			address: {
				line: Array<string>; // Update the type of 'line' property to string[]
				city: string;
				state: string;
				postalCode: string;
			};
			telecom: Array<string>; // Update the type of 'telecom' property
			timezone: string;
		};
		practitioner: {
			id: string;
			name: Array<{
				text: string;
			}>;
		};
	}

	interface Day {
		availability: boolean;
		date: string;
	}

	interface ScheduleAvailabilitySlot {
		id: string;
		start: string;
		end: string;
		serviceType: Array<{ text: string }>;
		location: {
			resource: {
				id: string;
				name: string;
				address: {
					line: Array<string>;
					city: string;
					state: string;
					postalCode: string;
				};
				telecom: Array<string>;
				timezone: string;
			};
		};
		practitionerAvailability: Array<{
			practitioner: {
				resource: {
					id: string;
					name: Array<{ text: string }>;
				};
			};
			availability: Array<{
				id: string;
				start: string;
				end: string;
				serviceType: Array<{ text: string }>;
			}>;
		}>;
	}

	const [availability, setAvailability] = useState<Array<Availability>>([]);
	const [slots, setSlots] = useState<Array<Slot>>([]);
	const [currentMonth, setCurrentMonth] = useState<number>(0);

	useEffect(() => {
		// Fetch availability for the current month or next month
		axios
			.get("http://localhost:8000/api/appointments", {
				params: {
					currentMonth: currentMonth,
				},
			})
			.then((response: { data: { searchAvailabilityDates: Array<Day> } }) => {
				// Extract availability dates from the response
				interface AvailabilityDate {
					availability: boolean;
					date: Date;
				}

				const availableDates: Array<AvailabilityDate> =
					response.data.searchAvailabilityDates.map((day: Day) => ({
						...day,
						date: new Date(`${day.date}T00:00:00Z`), // Parse as UTC date
					})) as Array<AvailabilityDate>;
				setAvailability(availableDates);
			})
			.catch((error) => {
				console.error("Error fetching availability:", error);
			});
	}, [currentMonth]); // Re-fetch data when currentMonth changes

	const handleDateClick = (date: Date): void => {
		const dateString = date.toISOString().split("T")[0] ?? null; // Convert back to YYYY-MM-DD format
		setSelectedDate(dateString);
		// Fetch available slots for the selected day
		axios
			.get<{
				searchSlots: {
					scheduleAvailabilitySlots: Array<ScheduleAvailabilitySlot>;
				};
			}>(`http://localhost:8000/api/appointments/slots?date=${dateString}`)
			.then((response) => {
				const slotsData =
					response.data.searchSlots.scheduleAvailabilitySlots.flatMap(
						(schedule) =>
							schedule.practitionerAvailability.flatMap(
								(practitionerAvailability) =>
									practitionerAvailability.availability.map((slot) => ({
										id: slot.id,
										start: slot.start,
										end: slot.end,
										serviceType: slot.serviceType
											.map((service) => service.text)
											.join(", "),
										location: {
											id: schedule.location.resource.id,
											name: schedule.location.resource.name,
											address: {
												line: schedule.location.resource.address.line,
												city: schedule.location.resource.address.city,
												state: schedule.location.resource.address.state,
												postalCode:
													schedule.location.resource.address.postalCode,
											},
											telecom: schedule.location.resource.telecom,
											timezone: schedule.location.resource.timezone,
										},
										practitioner: {
											id: practitionerAvailability.practitioner.resource.id,
											name: practitionerAvailability.practitioner.resource.name.map(
												(name) => ({
													text: name.text,
												})
											),
										},
									}))
							)
					);
				setSlots(slotsData);
			})
			.catch((error) => {
				console.error("Error fetching slots:", error);
			});
	};

	const handleMonthToggle = (): void => {
		// Toggle between current month (1) and next month (0)
		setCurrentMonth((previous) => (previous === 0 ? 1 : 0));
	};

	const getMonthName = (monthIndex: number): string => {
		const date = new Date();
		date.setMonth(monthIndex);
		return date.toLocaleString("default", { month: "long" });
	};

	return (
		<div className="appointment-calendar flex flex-col items-center p-4">
			<div className="mb-4">
				<button
					className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
					onClick={handleMonthToggle}
				>
					{currentMonth === 1 ? "Show Next Month" : "Show Current Month"}
				</button>
			</div>

			<h2 className="text-xl font-semibold mb-4">
				{getMonthName(
					currentMonth === 1 ? new Date().getMonth() : new Date().getMonth() + 1
				)}
			</h2>

			<div className="calendar grid grid-cols-7 gap-4 mb-6">
				{availability.map((day) =>
					day.availability ? (
						<div
							key={day.date.toISOString()}
							className={`day p-2 border rounded-lg text-center cursor-pointer ${
								selectedDate === day.date.toISOString().split("T")[0]
									? "bg-blue-500 text-white"
									: "bg-gray-200 hover:bg-blue-100"
							}`}
							onClick={() => {
								handleDateClick(day.date);
							}}
						>
							{day.date.getUTCDate()}
						</div>
					) : null
				)}
			</div>

			<div className="appointment-summary w-full max-w-lg">
				{selectedDate && (
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Available slots on {selectedDate}:
						</h3>
						{slots.length > 0 ? (
							slots.map((slot) => (
								<div
									key={slot.id}
									className="slot p-4 mb-4 border rounded-lg bg-white shadow-sm"
								>
									<p className="text-sm">
										<strong>Time:</strong>{" "}
										{new Date(slot.start).toLocaleTimeString()} -{" "}
										{new Date(slot.end).toLocaleTimeString()}
									</p>
									<p className="text-sm">
										<strong>Service:</strong> {slot.serviceType}
									</p>
									<p className="text-sm">
										<strong>Location:</strong> {slot.location.name}
									</p>
									<p className="text-sm">
										<strong>Practitioner:</strong>{" "}
										{slot.practitioner.name.map((name) => name.text).join(", ")}
									</p>
								</div>
							))
						) : (
							<p className="text-sm text-gray-600">
								No available slots for this day.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default AppointmentCalendar;
