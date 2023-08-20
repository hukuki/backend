require("dotenv").config({
    path: "./.test.env",
});

const mongoose = require("mongoose");
const request = require("supertest");
const admin = require("firebase-admin");

const app = require("../app");

const { connectToDatabase, disconnectFromDatabase } = require("../model/db");

const testItems = {}

/* Connecting to the database before each test. */
beforeAll(async () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    
    await connectToDatabase();

    const auth_provider_id = 'some-uid';

    testItems.token = await getAuth().createCustomToken(uid);

    testItems.user = await User.create({
        auth_provider_id,
        email: "lol@gmail.com"
    });
    
    testItems.document = await Document.create({
        title: "Test document",
        content: "Test content",
        user: user._id,
    });

    testItems.bookmark = await Bookmark.create({
        document: document._id,
        user: user._id,
    });
});

/* Disconnecting from the database after each test. */
afterAll(async () => {
    await disconnectFromDatabase();
});

describe("GET /bookmarks", () => {
    it("should return all bookmarks of the current user", async () => {
        const res = await request(app).get("/bookmarks").set('Authorization', `Bearer ${testItems.token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});

describe("POST /bookmarks", () => {
    it("should create a new bookmark", async () => {
        const res = await request(app).post("/bookmarks")
            .send({ document: testItems.document._id })
            .set('Authorization', `Bearer ${testItems.token}`);

        expect(res.statusCode).toEqual(200);
    });
});

describe("DELETE /bookmarks/:id", () => {
    it("should delete a bookmark", async () => {
        const res = await request(app).delete("/bookmarks/" + testItems.bookmark._id)
            .set('Authorization', `Bearer ${testItems.token}`);

        expect(res.statusCode).toEqual(200);
    });
});