import axios from "axios";

const getToken = async () => {
	const response = await axios.post(
		"https://sf-function.scheduling.athena.io/v1/graphql",
		{
			operationName: "createConsumerWorkflowToken",
			variables: {
				locationId: "21276-1",
				practitionerId: "21276-1",
			},
			query:
				"mutation createConsumerWorkflowToken($locationId: String, $practitionerId: String, $contextId: String) {\n  createConsumerWorkflowToken(locationId: $locationId, practitionerId: $practitionerId, contextId: $contextId) {\n    token\n    expiresIn\n    status\n    retryAfter\n    __typename\n  }\n}\n",
		},
		{
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
			},
		}
	);
	console.log("Output:", response.data);
	return response.data.data.createConsumerWorkflowToken.token;
};

export default getToken;
