/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { RouterProvider, type createRouter } from "@tanstack/react-router";
// import type { FunctionComponent } from "./common/types";
// import { TanStackRouterDevelopmentTools } from "./components/utils/development-tools/TanStackRouterDevelopmentTools";
import { createRouter } from "@tanstack/react-router";
import { FunctionComponent } from "./common/types.js";
import AppointmentCalendar from "./components/AppointmentCalendar.js";

type AppProps = { router: ReturnType<typeof createRouter> };

const App = ({ router }: AppProps): FunctionComponent => {
	return (
		<div className="App">
			{/* Header Bar */}
			<header className="bg-blue-600 text-white p-4 shadow-md">
				<h1 className="text-2xl font-bold text-center">Scheduling</h1>
			</header>

			{/* Main Content */}
			<main className="mt-4">
				<AppointmentCalendar />
			</main>
		</div>
	);
};

export default App;
