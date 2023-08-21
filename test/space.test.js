const Space = require("../src/model/space");
const User = require("../src/model/user");
const request = require("./request");

describe("GET /spaces", () => {
    it("should return all spaces of the current user", async () => {
        const res = await request.get("/spaces");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});

describe("POST /spaces", () => {
    it("should create a new space", async () => {
        const name = "Test Space";
        const description = "Test Description";

        const res = await request.post("/spaces").send({ name, description});

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual(name);
        expect(res.body.description).toEqual(description);

        const space = await Space.findOne({ name });

        expect(space).toBeTruthy();
    })
});

describe("DELETE /spaces", () => {
    it("should delete a space", async () => {
        const user = await User.findOne({ auth_provider_id: process.env.TEST_AUTH_PROVIDER_ID });
        const space = await Space.create({ createdBy: user._id, name: "Test Space", description: "Test Description", people: [{role: 'manager', user: user._id}], documents: [] });

        const res = await request.delete("/spaces/"+space._id).send();
        
        expect(res.statusCode).toEqual(200);
        const deletedSpace = await Space.findOne({ name: "Test Space" });

        expect(deletedSpace).toBeFalsy();
    })
});

