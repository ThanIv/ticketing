import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

jest.setTimeout(20000);  // 20 seconds for Jest

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = 'than';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // Start MongoMemoryServer globally
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    // Connect mongoose to the in-memory MongoDB
    await mongoose.connect(mongoUri,{});
});

beforeEach(async () => {
    if (mongoose.connection.db) {
        jest.clearAllMocks();
      const collections = await mongoose.connection.db.collections();
  
      for (let collection of collections) {
        await collection.deleteMany({});
      }
    }
});

afterAll(async () => {
    // Stop MongoMemoryServer and close the connection
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    // Build a JWT payload with id and email
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    // Sign the payload with the secret key to create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Create a session object containing the JWT
    const session = { jwt: token };

    // Convert the session object to JSON
    const sessionJSON = JSON.stringify(session);

    // Base64 encode the JSON
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return the cookie in the correct format for use in tests
    return [`session=${base64}`];
};

