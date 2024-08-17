import axios from "axios";

const getAppointments = async (token, startBefore, startAfter) => {
	const response = await axios.post(
		"https://sf-function.scheduling.athena.io/v1/graphql",
		{
			operationName: "SearchAvailabilityDates",
			variables: {
				locationIds: ["21276-1"],
				page: 1,
				patientNewness:
					"scheduling.athena.io/enumeration/patientnewness/generalestablished",
				practitionerIds: ["21276-1"],
				serviceTypeTokens: [
					"codesystem.scheduling.athena.io/servicetype.canonical|03d9d312-3cf8-11e8-b467-0ed5f89f718b",
				],
				specialty:
					"codesystem.scheduling.athena.io/specialty.canonical|Naturopathic Medicine",
				startAfter: startAfter,
				startBefore: startBefore,
			},
			query:
				"query SearchAvailabilityDates($locationIds: [String!], $practitionerIds: [String!], $patientNewness: String, $specialty: String, $serviceTypeTokens: [String!]!, $startAfter: String!, $startBefore: String!, $visitType: VisitType, $page: Int, $practitionerCategory: PractitionerCategory) {\n  searchAvailabilityDates(locationIds: $locationIds, practitionerIds: $practitionerIds, patientNewness: $patientNewness, specialty: $specialty, serviceTypeTokens: $serviceTypeTokens, startAfter: $startAfter, startBefore: $startBefore, visitType: $visitType, page: $page, practitionerCategory: $practitionerCategory) {\n    date\n    availability\n    __typename\n  }\n}\n",
		},
		{
			headers: {
				"X-Scheduling-Jwt": `${token}`,
			},
		}
	);
	console.log("Ouptut:", response.data);
	return response.data.data;
};

const getAppointmentSlots = async (token, date) => {
	const response = await axios.post(
		"https://sf-function.scheduling.athena.io/v1/graphql",
		{
			operationName: "SearchSlots",
			variables: {
				locationIds: ["21276-1"],
				page: 1,
				patientNewness:
					"scheduling.athena.io/enumeration/patientnewness/generalestablished",
				practitionerIds: ["21276-1"],
				serviceTypeTokens: [
					"codesystem.scheduling.athena.io/servicetype.canonical|03d9d312-3cf8-11e8-b467-0ed5f89f718b",
				],
				specialty:
					"codesystem.scheduling.athena.io/specialty.canonical|Naturopathic Medicine",
				startAfter: date,
				startBefore: date,
			},
			query:
				"query SearchSlots($locationIds: [String!], $practitionerIds: [String!], $patientNewness: String, $specialty: String, $serviceTypeTokens: [String!]!, $startAfter: String!, $startBefore: String!, $visitType: VisitType, $page: Int, $practitionerCategory: PractitionerCategory) {\n  searchSlots(locationIds: $locationIds, practitionerIds: $practitionerIds, patientNewness: $patientNewness, specialty: $specialty, serviceTypeTokens: $serviceTypeTokens, startAfter: $startAfter, startBefore: $startBefore, visitType: $visitType, page: $page, practitionerCategory: $practitionerCategory) {\n    scheduleAvailabilitySlots {\n      location {\n        reference\n        resource {\n          ... on Location {\n            id\n            name\n            address {\n              line\n              city\n              state\n              postalCode\n              __typename\n            }\n            telecom {\n              system\n              value\n              __typename\n            }\n            timezone\n            managingOrganization {\n              reference\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      practitionerAvailability {\n        isTelehealth\n        practitioner {\n          reference\n          resource {\n            ... on Practitioner {\n              id\n              name {\n                text\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        availability {\n          id\n          start\n          end\n          status\n          serviceType {\n            text\n            coding {\n              code\n              system\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      isPatientPractitioner\n      __typename\n    }\n    totalSchedules\n    __typename\n  }\n}\n",
		},
		{
			headers: {
				"X-Scheduling-Jwt": `${token}`,
			},
		}
	);
	console.log("Output:", response.data);
	return response.data.data;
};

export { getAppointments, getAppointmentSlots };
