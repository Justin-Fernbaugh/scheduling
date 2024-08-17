// This route does the following:
// When get request is received to /api/appointments at a high level it will do the following:
// send an api request to "https://sf-function.scheduling.athena.io/v1/graphql" with the query:
// {
//     "operationName": "createConsumerWorkflowToken",
//     "variables": {
//         "locationId": "21276-1",
//         "practitionerId": "21276-1"
//     },
//     "query": "mutation createConsumerWorkflowToken($locationId: String, $practitionerId: String, $contextId: String) {\n  createConsumerWorkflowToken(locationId: $locationId, practitionerId: $practitionerId, contextId: $contextId) {\n    token\n    expiresIn\n    status\n    retryAfter\n    __typename\n  }\n}\n"
// }
// If the request is successful, it will return the token and expiresIn from the response.
// Once the token is received we can query "https://sf-function.scheduling.athena.io/v1/graphql" with the query:
// {
//     "operationName": "SearchAvailabilityDates",
//     "variables": {
//         "locationIds": [
//             "21276-1"
//         ],
//         "page": 1,
//         "patientNewness": "scheduling.athena.io/enumeration/patientnewness/generalestablished",
//         "practitionerIds": [
//             "21276-1"
//         ],
//         "serviceTypeTokens": [
//             "codesystem.scheduling.athena.io/servicetype.canonical|03d9d312-3cf8-11e8-b467-0ed5f89f718b"
//         ],
//         "specialty": "codesystem.scheduling.athena.io/specialty.canonical|Naturopathic Medicine",
//         "startAfter": "2024-08-15T00:00:00-07:00",
//         "startBefore": "2024-09-07T23:59:59-07:00"
//     },
//     "query": "query SearchAvailabilityDates($locationIds: [String!], $practitionerIds: [String!], $patientNewness: String, $specialty: String, $serviceTypeTokens: [String!]!, $startAfter: String!, $startBefore: String!, $visitType: VisitType, $page: Int, $practitionerCategory: PractitionerCategory) {\n  searchAvailabilityDates(locationIds: $locationIds, practitionerIds: $practitionerIds, patientNewness: $patientNewness, specialty: $specialty, serviceTypeTokens: $serviceTypeTokens, startAfter: $startAfter, startBefore: $startBefore, visitType: $visitType, page: $page, practitionerCategory: $practitionerCategory) {\n    date\n    availability\n    __typename\n  }\n}\n"
// }

// When the token is about to expire then renew the token.
import express from "express";
import getToken from "../utils/getToken.js";
import {
	getAppointments,
	getAppointmentSlots,
} from "../utils/getAppointments.js";

const router = express.Router();

router.get("/appointments", async (req, res) => {
	let currentMonth = req.query.currentMonth; // get currentMonth query param to determine if we should get appointments for the current month or next month. should be 1 or 0
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
	const date = req.query.date; // get date query param to get appointment slots for a specific date
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

// const getToken = async () => {
// 	const response = await axios.post(
// 		"https://sf-function.scheduling.athena.io/v1/graphql",
// 		{
// 			operationName: "createConsumerWorkflowToken",
// 			variables: {
// 				locationId: "21276-1",
// 				practitionerId: "21276-1",
// 			},
// 			query:
// 				"mutation createConsumerWorkflowToken($locationId: String, $practitionerId: String, $contextId: String) {\n  createConsumerWorkflowToken(locationId: $locationId, practitionerId: $practitionerId, contextId: $contextId) {\n    token\n    expiresIn\n    status\n    retryAfter\n    __typename\n  }\n}\n",
// 		},
// 		{
// 			headers: {
// 				"User-Agent":
// 					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
// 			},
// 		}
// 	);
// 	console.log("Output:", response.data);
// 	return response.data.data.createConsumerWorkflowToken.token;
// };

// on route "https://sf-function.scheduling.athena.io/v1/graphql" with the query:
// {
//     "operationName": "SearchSlots",
//     "variables": {
//         "locationIds": [
//             "21276-1"
//         ],
//         "page": 1,
//         "patientNewness": "scheduling.athena.io/enumeration/patientnewness/generalestablished",
//         "practitionerIds": [
//             "21276-1"
//         ],
//         "serviceTypeTokens": [
//             "codesystem.scheduling.athena.io/servicetype.canonical|03d9d312-3cf8-11e8-b467-0ed5f89f718b"
//         ],
//         "specialty": "codesystem.scheduling.athena.io/specialty.canonical|Naturopathic Medicine",
//         "startAfter": "2024-08-27",
//         "startBefore": "2024-08-27"
//     },
//     "query": "query SearchSlots($locationIds: [String!], $practitionerIds: [String!], $patientNewness: String, $specialty: String, $serviceTypeTokens: [String!]!, $startAfter: String!, $startBefore: String!, $visitType: VisitType, $page: Int, $practitionerCategory: PractitionerCategory) {\n  searchSlots(locationIds: $locationIds, practitionerIds: $practitionerIds, patientNewness: $patientNewness, specialty: $specialty, serviceTypeTokens: $serviceTypeTokens, startAfter: $startAfter, startBefore: $startBefore, visitType: $visitType, page: $page, practitionerCategory: $practitionerCategory) {\n    scheduleAvailabilitySlots {\n      location {\n        reference\n        resource {\n          ... on Location {\n            id\n            name\n            address {\n              line\n              city\n              state\n              postalCode\n              __typename\n            }\n            telecom {\n              system\n              value\n              __typename\n            }\n            timezone\n            managingOrganization {\n              reference\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      practitionerAvailability {\n        isTelehealth\n        practitioner {\n          reference\n          resource {\n            ... on Practitioner {\n              id\n              name {\n                text\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        availability {\n          id\n          start\n          end\n          status\n          serviceType {\n            text\n            coding {\n              code\n              system\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      isPatientPractitioner\n      __typename\n    }\n    totalSchedules\n    __typename\n  }\n}\n"
// }
// get the appointment slots for a specific date

export default router;
