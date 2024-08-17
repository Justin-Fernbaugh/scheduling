import express from "express";
import appointments from "./routes/appointments.js?";

const app = express();
// get port from environment variable or use default port 8000
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/api", appointments);

// health check
app.get("/health", (req, res) => {
	res.send("Server is up and running");
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
