// import {MongoMemoryServer} from 'mongodb-memory-server';
// import mongoose from 'mongoose';
// import request from 'supertest';
// import {app} from '../app';

// declare global {
//     var signin: () => Promise<string[]>;
// }

// let mongo: any;
// beforeAll(async () => {
//     process.env.JWT_KEY='than';
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//     const mongo = await MongoMemoryServer.create();
//     const mongoUri = mongo.getUri();

//     await mongoose.connect(mongoUri, {});
// });

// beforeEach(async () => {
//     if (mongoose.connection.db) {
//       const collections = await mongoose.connection.db.collections();
  
//       for (let collection of collections) {
//         await collection.deleteMany({});
//       }
//     }
// });

// afterAll(async () => {
//     if (mongo){
//         await mongo.stop();
//     }
//     await mongoose.connection.close();
// });

// global.signin = async () => {
//     const email = 'test@test.com';
//     const password = 'password';
    
//     const response = await request(app)
//         .post('api/users/signup')
//         .send({
//             email, 
//             password,
//         })
//         .expect(201);

//     const cookie = response.get('Set-Cookie');

//     if (!cookie) {
//         throw new Error("Failed to get cookie from response");
//     }
//     return cookie || [];
// };


import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
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

// beforeEach(async () => {
//     // Clean collections before each test
//     const collections = await mongoose.connection.db.collections();
//     for (let collection of collections) {
//         await collection.deleteMany({});
//     }
// });

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

// global.signin = () => {
//     //Build a JWT payload. {id, email}
//     const payload = {
//         id: 'id12345678',
//         email: 'test@test.com'
//     };

//     //Create the JWT
//     const token = jwt.sign(payload, process.env.JWT_KEY!);

//     //Build session Object. {jwt: MY_JWT}
//     const session = {jwt: token};

//     //Turn that session into JSON
//     const sessionJSON= JSON.stringify(session);

//     //Take JSON and encode it as base64
//     const base64 = Buffer.from(sessionJSON).toString('base64');

//     //return a string thats the cookie with the encode data
//     return [`session=${base64}`];
// };



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






// Global signin function to be used in tests
// global.signin = async () => {
//     const email = 'test@test.com';
//     const password = 'password';

//     const response = await request(app)
//         .post('/api/users/signup')  // Fix the route here (added leading '/')
//         .send({
//             email,
//             password,
//         })
//         .expect(201);

//     // Retrieve cookie from response header
//     const cookie = response.get('Set-Cookie');

//     if (!cookie) {
//         throw new Error("Failed to get cookie from response");
//     }

//     return cookie;
// };
