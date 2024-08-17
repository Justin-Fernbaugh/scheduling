/* eslint-disable @typescript-eslint/consistent-type-imports */
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, type createRouter } from "@tanstack/react-router";
// import type { FunctionComponent } from "./common/types";
// import { TanStackRouterDevelopmentTools } from "./components/utils/development-tools/TanStackRouterDevelopmentTools";
import { FunctionComponent } from "./common/types.js";
// import AppointmentCalendar from "./components/AppointmentCalendar.js";

const queryClient = new QueryClient();
type AppProps = { router: ReturnType<typeof createRouter> };

const App = ({ router }: AppProps): FunctionComponent => {
	return (
		<QueryClientProvider client={queryClient}>
			<header className="bg-blue-600 text-white p-4 shadow-md">
				<h1 className="text-2xl font-bold text-center">Scheduling</h1>
			</header>
			<RouterProvider router={router} />
			{/* <TanStackRouterDevelopmentTools
				router={router}
				initialIsOpen={false}
				position="bottom-right"
			/>
			<ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
};

// const App = ({ router }: AppProps): FunctionComponent => {
// 	return (
// 		<QueryClientProvider client={queryClient}>
// 			<RouterProvider router={router} />
// 			<div className="App">
// 				{/* Header Bar */}
// 				<header className="bg-blue-600 text-white p-4 shadow-md">
// 					<h1 className="text-2xl font-bold text-center">Scheduling</h1>
// 				</header>

// 				{/* Main Content */}
// 				<main className="mt-4">
// 					<AppointmentCalendar />
// 				</main>
// 			</div>
// 		</QueryClientProvider>
// 	);
// };

export default App;
