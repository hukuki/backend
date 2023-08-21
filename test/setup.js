require("dotenv").config({
    path: "./.test.env",
});

const {getAuth} = require("firebase-admin/auth");
const User = require("../src/model/user");

const connection = require("../src/model/db");
const Space = require("../src/model/space");
const testItems = {};

/* Connecting to the database before each test. */

afterEach(async () => {
    await Space.deleteMany({});
    await User.deleteMany({});
  });

beforeEach(async () => {
    /*
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });*/

    const testingUuid = process.env.TEST_AUTH_PROVIDER_ID;

    testItems.user = await User.create({
        auth_provider_id: testingUuid,
        email: "lol@gmail.com"
    });
    
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
