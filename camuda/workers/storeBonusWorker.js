import axios from "axios";
import { Client, logger, Variables } from "camunda-external-task-client-js";


const config = {
    baseUrl: "http://localhost:8081/engine-rest",
    use: logger,
    asyncResponseTimeout: 10000,
};

const client = new Client(config);

const BACKEND_BASE_URL = "http://localhost:8080/api";

// Store Bonus in OrangeHRM  (Topic: storeBonusSalary)
client.subscribe("storeBonusSalary", async ({ task, taskService }) => {
    const employeeId = task.variables.get("employeeId");
    const year = task.variables.get("year");
    const value = task.variables.get("value"); // bonus value

    try {
        console.log(`[OrangeHRM] employeeId=${employeeId}, year=${year}, value=${value}`);


        const res = await axios.post(
            `${BACKEND_BASE_URL}/orangehrm/employees/${employeeId}/bonussalary`,
            { year, value },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("[OrangeHRM] Saved:", res.data);


        const vars = new Variables();
        vars.set("orangehrmSaveResult", res.data);

        await taskService.complete(task, vars);
    } catch (err) {
        const details = err?.response?.data ? JSON.stringify(err.response.data) : String(err);
        console.error("[OrangeHRM] ERROR:", details);

        await taskService.handleFailure(task, {
            errorMessage: "Failed to store bonus in OrangeHRM",
            errorDetails: details,
            retries: 0,
            retryTimeout: 0,
        });
    }
});


// Store Bonus Record in MongoDB (Topic: storeBonusRecordMongo)
client.subscribe("storeBonusRecordMongo", async ({ task, taskService }) => {
    const employeeId = task.variables.get("employeeId");
    const year = task.variables.get("year");
    const value = task.variables.get("value");

    try {
        console.log(`[MongoDB] employeeId=${employeeId}, year=${year}, value=${value}`);

        const res = await axios.post(
            `${BACKEND_BASE_URL}/bonus-records`,
            { employeeId, year, value, source: "camunda" },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("[MongoDB] Saved:", res.data);

        const vars = new Variables();
        vars.set("mongoSaveResult", res.data);

        await taskService.complete(task, vars);
    } catch (err) {
        const details = err?.response?.data ? JSON.stringify(err.response.data) : String(err);
        console.error("[MongoDB] ERROR:", details);

        await taskService.handleFailure(task, {
            errorMessage: "Failed to store bonus record in MongoDB",
            errorDetails: details,
            retries: 0,
            retryTimeout: 0,
        });
    }
});
