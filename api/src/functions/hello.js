// const { app } = require('@azure/functions');

// app.http('hello', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     handler: async (request, context) => {
//         context.log(`Http function processed request for url "${request.url}"`);

//         const name = request.query.get('name') || await request.text() || 'world';

//         return { body: `Hello, ${name}!` };
//     }
// });

// const jwt = require("jsonwebtoken");
// const jwksClient = require("jwks-rsa");

// const TENANT_ID = "380de320-1fbf-4244-87d7-f7ca03b702cc";

// // Replace this with your Application (client) ID
// const CLIENT_ID = "73f42017-aca1-4ee8-92ea-7676e2cff6d9";

// // Optional: replace with your Entra security group Object ID
// // const ALLOWED_GROUP_ID = process.env.ALLOWED_GROUP_ID;

// const client = jwksClient({
//   jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
// });

// function getSigningKey(header, callback) {
//   client.getSigningKey(header.kid, (err, key) => {
//     if (err) {
//       return callback(err);
//     }

//     const signingKey = key.getPublicKey();
//     callback(null, signingKey);
//   });
// }

// function verifyMicrosoftToken(token) {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       token,
//       getSigningKey,
//       {
//         algorithms: ["RS256"],
//         audience: CLIENT_ID,
//         issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
//       },
//       (err, decoded) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(decoded);
//         }
//       }
//     );
//   });
// }

// module.exports = async function (context, req) {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       context.res = {
//         status: 401,
//         body: {
//           error: "Missing Authorization Bearer token",
//         },
//       };
//       return;
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = await verifyMicrosoftToken(token);

//     // Optional group check
//     if (ALLOWED_GROUP_ID) {
//       const groups = decoded.groups || [];

//       if (!groups.includes(ALLOWED_GROUP_ID)) {
//         context.res = {
//           status: 403,
//           body: {
//             error: "User is authenticated but not in the authorized group",
//           },
//         };
//         return;
//       }
//     }

//     context.res = {
//       status: 200,
//       body: {
//         message: "Access granted",
//         user: {
//           name: decoded.name,
//           email: decoded.preferred_username,
//           objectId: decoded.oid,
//           tenantId: decoded.tid,
//         },
//       },
//     };
//   } catch (err) {
//     context.res = {
//       status: 403,
//       body: {
//         error: "Invalid or expired token",
//         details: err.message,
//       },
//     };
//   }
// };


const { app } = require('@azure/functions');
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const TENANT_ID = "380de320-1fbf-4244-87d7-f7ca03b702cc";
const CLIENT_ID = "73f42017-aca1-4ee8-92ea-7676e2cff6d9";

const client = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
});

function getSigningKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {

        if (err) {
            return callback(err);
        }

        callback(null, key.getPublicKey());
    });
}

function verifyMicrosoftToken(token) {

    return new Promise((resolve, reject) => {

        jwt.verify(
            token,
            getSigningKey,
            {
                algorithms: ["RS256"],
                audience: CLIENT_ID,
                issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
            },
            (err, decoded) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            }
        );
    });
}

app.http('checkUser', {
    methods: ['GET'],
    authLevel: 'anonymous',

    handler: async (request, context) => {

        try {

            const authHeader = request.headers.get('authorization');

            if (!authHeader || !authHeader.startsWith('Bearer ')) {

                return {
                    status: 401,
                    jsonBody: {
                        error: 'Missing Authorization Bearer token'
                    }
                };
            }

            const token = authHeader.split(' ')[1];

            const decoded = await verifyMicrosoftToken(token);

            return {
                status: 200,
                jsonBody: {
                    message: 'Access granted',
                    user: {
                        name: decoded.name,
                        email: decoded.preferred_username,
                        objectId: decoded.oid,
                        tenantId: decoded.tid
                    }
                }
            };

        } catch (err) {

            return {
                status: 403,
                jsonBody: {
                    error: 'Invalid or expired token',
                    details: err.message
                }
            };
        }
    }
});