require("dotenv").config({
    path: "./.test.env",
});

const mongoose = require("mongoose");
const supertest = require("supertest");
const defaults = require('superagent-defaults');

const admin = require("firebase-admin");
const {getAuth} = require("firebase-admin/auth");
const app = require("../src/app");
const User = require("../src/model/user");

const connection = require("../src/model/db");

const testItems = {}

const request = defaults(supertest(app));

/* Connecting to the database before each test. */
beforeAll(async () => {
    /*
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });*/
    const testingUuid = '00000000-0000-0000-0000-000000000000';

    try{
        await getAuth().deleteUser(testingUuid);
    }catch(e){}

    await getAuth().createUser({
        email: 'testuser@casevisor.com',
        uid: testingUuid,
        emailVerified: false,
        phoneNumber: '+905444444444',
        password: 'secretPassword',
        displayName: 'John Doe',
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false,
    });
    const user = await getAuth().(testingUuid);

    testItems.token = await getAuth().createSessionCookie(user.uid, { expiresIn: 60 * 60 * 24 * 5 });
    console.log(testItems.token)
    testItems.user = await User.create({
        auth_provider_id: testingUuid,
        email: "lol@gmail.com"
    });
    
    request.set({
        'Authorization': `Bearer ${testItems.token}`
    })
    /*
    testItems.document = await Document.create({
        title: "Test document",
        content: "Test content",
        user: user._id,
    });

    testItems.bookmark = await Bookmark.create({
        document: document._id,
        user: user._id,
    });
    */
});

/* Disconnecting from the database after each test. */
afterAll(async () => {
    connection.close();
});

describe("GET /bookmarks", () => {
    it("should return all bookmarks of the current user", async () => {
        const res = await request.get("/bookmarks");
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});
/*
describe("POST /bookmarks", () => {
    it("should create a new bookmark", async () => {
        const res = await request.post("/bookmarks")
            .send({ document: testItems.document._id })

        expect(res.statusCode).toEqual(200);
    });
});

describe("DELETE /bookmarks/:id", () => {
    it("should delete a bookmark", async () => {
        const res = await request.delete("/bookmarks/" + testItems.bookmark._id)

        expect(res.statusCode).toEqual(200);
    });
});
*/