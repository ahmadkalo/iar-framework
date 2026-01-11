const sinon = require("sinon");
const { expect } = require("chai");
const axios = require("axios");

const orangehrmService = require("../src/services/orangehrm-service");

describe("OrangeHRM Service Integration Tests (stubbed)", () => {
    afterEach(() => {
        sinon.restore();
    });

    describe("Service is online (reachable)", () => {
        it("login() should return access token", async () => {
            sinon.stub(axios, "post").resolves({
                data: { access_token: "fake_token_123" }
            });

            const token = await orangehrmService.login();
            expect(token).to.have.property("access_token", "fake_token_123");
        });

        it("getEmployeeById() should return employee data", async () => {
            // 1) login() -> axios.post
            sinon.stub(axios, "post").resolves({
                data: { access_token: "fake_token_123" }
            });

            // 2) get employee -> axios.get
            sinon.stub(axios, "get").resolves({
                data: { data: { id: 3, firstName: "John", lastName: "Smith", fullName: "John Smith" } }
            });

            const emp = await orangehrmService.getEmployeeById(3);
            expect(emp).to.deep.include({ id: 3, fullName: "John Smith" });
        });
    });

    describe("Service is offline (not reachable)", () => {
        it("login() should throw if OrangeHRM token endpoint is unreachable", async () => {
            sinon.stub(axios, "post").rejects(Object.assign(new Error("connect ECONNREFUSED"), {
                code: "ECONNREFUSED"
            }));

            try {
                await orangehrmService.login();
                throw new Error("Expected login() to throw");
            } catch (err) {
                expect(err.message).to.equal("Login failed");
            }
        });

        it("getAllEmployees() should throw if OrangeHRM is unreachable", async () => {
            // login ok
            sinon.stub(axios, "post").resolves({
                data: { access_token: "fake_token_123" }
            });

            // employee/search fails
            sinon.stub(axios, "get").rejects(Object.assign(new Error("connect ECONNREFUSED"), {
                code: "ECONNREFUSED"
            }));

            try {
                await orangehrmService.getAllEmployees();
                throw new Error("Expected getAllEmployees() to throw");
            } catch (err) {
                expect(err.message).to.equal("Failed to fetch employees");
            }
        });
    });
});
