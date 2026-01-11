const sinon = require("sinon");
const { expect } = require("chai");

const socialService = require("../src/services/socialPerformance-service");
const salesmenService = require("../src/services/salesmen-service");

describe("MongoDB Services Integration Tests (stubbed)", () => {
    afterEach(() => sinon.restore());

    describe("Service is online (reachable)", () => {
        it("socialPerformance-service.getBySid() should return records", async () => {
            const fakeRecords = [
                { sid: 3, category: "Teamwork", score: 4, year: 2025 }
            ];

            const toArrayStub = sinon.stub().resolves(fakeRecords);
            const findStub = sinon.stub().returns({ toArray: toArrayStub });
            const collectionStub = sinon.stub().returns({ find: findStub });

            const db = { collection: collectionStub };

            const records = await socialService.getBySid(db, 3);
            expect(records).to.deep.equal(fakeRecords);
        });

        it("salesmen-service.getById() should return salesman", async () => {
            const fakeSalesman = { id: 3, firstname: "John", lastname: "Smith" };

            const findOneStub = sinon.stub().resolves(fakeSalesman);
            const collectionStub = sinon.stub().returns({ findOne: findOneStub });

            const db = { collection: collectionStub };

            const salesman = await salesmenService.getById(db, 3);
            expect(salesman).to.deep.equal(fakeSalesman);
        });
    });

    describe("Service is offline (not reachable)", () => {
        it("socialPerformance-service.getAll() should throw if DB fails", async () => {

            const toArrayStub = sinon.stub().rejects(new Error("MongoNetworkError"));
            const findStub = sinon.stub().returns({ toArray: toArrayStub });
            const collectionStub = sinon.stub().returns({ find: findStub });

            const db = { collection: collectionStub };

            try {
                await socialService.getAll(db);
                throw new Error("Expected getAll() to throw");
            } catch (err) {
                expect(err.message).to.equal("MongoNetworkError");
            }
        });
    });
});