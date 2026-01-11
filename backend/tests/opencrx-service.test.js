const sinon = require("sinon");
const { expect } = require("chai");
const opencrxService = require("../src/services/opencrx-service");

describe("OpenCRX Service Integration Tests (stubbed)", () => {
    afterEach(() => {
        // client wieder zurücksetzen
        if (opencrxService._resetClient) opencrxService._resetClient();
        sinon.restore();
    });

    describe("Service is online (reachable)", () => {
        it("getAllAccounts() should return objects", async () => {
            const fakeClient = {
                get: sinon.stub().resolves({ data: { objects: [{ name: "A" }, { name: "B" }] } })
            };

            opencrxService._setClient(fakeClient);

            const accounts = await opencrxService.getAllAccounts();
            expect(accounts).to.be.an("array").with.length(25);
        });

        it("getAllSalesOrders() should return orders with extracted id", async () => {
            const fakeClient = {
                get: sinon.stub().resolves({
                    data: {
                        objects: [{ "@href": "https://x/y/salesOrder/abc123", name: "Order1" }]
                    }
                })
            };

            opencrxService._setClient(fakeClient);

            const orders = await opencrxService.getAllSalesOrders();
            expect(orders[0]).to.have.property("id", "00016173-a72c-439e-9726-c90c1312818b");
        });
    });

    describe("Service is offline (not reachable)", () => {
        it("getAllAccounts() should throw if OpenCRX is unreachable", async () => {
            const fakeClient = {
                get: sinon.stub().rejects(Object.assign(new Error("connect ECONNREFUSED"), { code: "ECONNREFUSED" }))
            };

            opencrxService._setClient(fakeClient);

            try {
                await opencrxService.getAllAccounts();
                throw new Error("Expected getAllAccounts() to throw");
            } catch (err) {
                expect(err.code).to.equal("ECONNREFUSED");
            }
        });
    });
});
