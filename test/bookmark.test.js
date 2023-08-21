const request = require("./request");
const User = require("../src/model/user");

describe("GET /bookmarks", () => {
    it("should return all bookmarks of the current user", async () => {
        const res = await request.get("/bookmarks");
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});

describe("POST /bookmarks", () => {
    it("should create a new bookmark", async () => {
        const dummyDocumentId = "224322432";
        
        const res = await request.post("/bookmarks")
            .send({ bookmarks: [dummyDocumentId] })
        
        expect(res.statusCode).toEqual(200);
        
        const user = await User.findOne({ auth_provider_id: process.env.TEST_AUTH_PROVIDER_ID });

        expect(user.bookmarks).toEqual([dummyDocumentId]);
    });
});

describe("POST /bookmarks", () => {
    it("should create multiple new bookmarks", async () => {
        const dummyDocumentIds = ["22asdsa", "23423asşl", "234234"];    
        
        const res = await request.post("/bookmarks")
            .send({ bookmarks: dummyDocumentIds })

        expect(res.statusCode).toEqual(200);
        
        const user = await User.findOne({ auth_provider_id: process.env.TEST_AUTH_PROVIDER_ID });

        expect(user.bookmarks).toEqual(dummyDocumentIds);
    });
});

describe("DELETE /bookmarks", () => {
    it("should delete bookmarks", async () => {
        const dummyDocumentId = "22asdsa";
        
        let user = await User.findOne({ auth_provider_id: process.env.TEST_AUTH_PROVIDER_ID });
        user.bookmarks.push(dummyDocumentId);
        await user.save();

        const res = await request.delete("/bookmarks/"+dummyDocumentId).send()

        user = await User.findOne({ auth_provider_id: process.env.TEST_AUTH_PROVIDER_ID });

        expect(res.statusCode).toEqual(200);
        expect(user.bookmarks).toEqual([]);
    });
});

/*
describe("DELETE /bookmarks/:id", () => {
    it("should delete a bookmark", async () => {
        const res = await request.delete("/bookmarks/" + testItems.bookmark._id)

        expect(res.statusCode).toEqual(200);
    });
});
*/