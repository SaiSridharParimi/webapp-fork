const supertest = require("supertest")
const { app, server } = require("../index")
const { sequelize } = require("../config/database")
const {execSync} = require("child_process")

beforeAll(async() => {
    await sequelize.authenticate().then(async() => {
        console.log("Connected to DB using tests")
        const [results] = await sequelize.query("SHOW TABLES;");
        console.log("Existing Tables: ", results);
    }).catch((err) => {
        console.log("Unable to create DB during tests" + err)
    })
})

test("Configuring tests", ()=>{
    expect(true).toBe(true)
})

describe("Tests for healthz API", () => {
    describe("Tests for Request Methods", () => {
        it("Testing 200 OK for GET", async () => {
            const response = await supertest(app).get("/healthz")
            expect(response.status).toBe(200)
        })
        test("Testing 405 Method Not Allowed for POST", async () => {
            const response = await supertest(app).post("/healthz")
            expect(response.status).toBe(405)
        })
        it("Testing 405 Method Not Allowed for PUT", async () => {
            const response = await supertest(app).put("/healthz")
            expect(response.status).toBe(405)
        })
        test("Testing 405 Method Not Allowed for PATCH", async () => {
            const response = await supertest(app).patch("/healthz")
            expect(response.status).toBe(405)
        })
        it("Testing 405 Method Not Allowed for DELETE", async () => {
            const response = await supertest(app).delete("/healthz")
            expect(response.status).toBe(405)
        })
        test("Testing 405 Method Not Allowed for HEAD", async () => {
            const response = await supertest(app).head("/healthz")
            expect(response.status).toBe(405)
        })
        it("Testing 405 Method Not Allowed for OPTIONS", async () => {
            const response = await supertest(app).options("/healthz")
            expect(response.status).toBe(405)
        })
    })
    describe("TESTING 400 Bad Request for Payloads", () => {
        describe("Testing 400 Bad Request for Request Body", ()=>{
            test("Testing 400 for plain body", async () => {
                const response = await supertest(app).get("/healthz").set('Content-Type', 'text/plain').send("test")
                expect(response.status).toBe(400)
            })
            it("Testing 400 for JSON Object in body", async()=>{
                const response = await supertest(app).get("/healthz").send({
                    test : "1234"
                })
                expect(response.status).toBe(400)
            })
            test("Testing 400 for HTML in body", async()=>{
                const response = await supertest(app).get("/healthz").set('Content-Type', 'text/html')
                                                                     .send("<html>Using HTML</html>")
                expect(response.status).toBe(400)
            })
            it("Testing 400 for form data", async()=>{
                const response = await supertest(app).get("/healthz").set('Content-Type', 'application/x-www-form-urlencoded')
                                                                     .send("Using Form Data")
                expect(response.status).toBe(400)                                                
            })
        })
        describe("Testing 400 Bad Request for Request Param", ()=>{
            it("Testing for request param", async()=>{
                const response = await supertest(app).get("/healthz?testingValue=asdf")
                expect(response.status).toBe(400) 
            })
        })
        describe("Testing /healthz with headers", () => {
            it("should return 400 Bad Request if headers are present", async () => {
                const response = await supertest(app).get("/healthz").set("key", "value");
                expect(response.status).toBe(400);
            });
        })
    })
    describe("Testing 503 Service Unavailable when Database Stopped", ()=>{
        it("Testing when Database stopped", async()=>{
            await sequelize.close()
            const response = await supertest(app).get("/healthz")
            expect(response.status).toBe(503)
        })
    })
    describe("No Method Returns 500", (()=>{
        test("Ensuring no request returns 500", async () => {
            const response = await supertest(app).get("/healthz");
            expect(response.status).not.toBe(500);
        });
    }))
})

afterEach(async () => {
    if (!sequelize.connectionManager.pool) {
        await sequelize.authenticate(); 
    }
});

afterAll(async()=>{
    await sequelize.close()
    server.close()
})