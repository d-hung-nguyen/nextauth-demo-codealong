# NextAuth - Workshop

In this Workshop we will be refactoring an application to incorporate a login using the library NextAuth.
At the end of the Workshop, users will be able to log in and toggle their favorite ponies from My Little Pony.
In the Favorite-Page they will only see their own favorites.

There will be several steps needed to achieve this outcome:
Steps 1-3 are needed in almost every application using NextAuth and OAuth.
The other steps are specific for the project of this workshop.

### 1. - Register a OAuth-App at GitHub

create GITHUB_ID and GITHUB_SECRET:

GitHub profile: settings -> Developer Settings -> OAuth-Apps -> new OAuth App:

- enter Application Name
- enter homepage: either "[http://localhost:3000](http://localhost:3000/)" oder URL of Vercel-Deployment
- Authorization Callback URL: API route as follows: "[http://localhost:3000/api/auth/callback/github](http://localhost:3000/api/auth/callback/github)" ("vercel-deployment/api/auth/callback/github")
- Register Application
- copy CLIENT ID and add to project as GITHUB_ID
- Generate new Client secret
- copy CLIENT secret and add to project as GITHUB_SECRET

Attention: The OAuth app is only ever registered for ONE URL, i.e. you must create an OAuth app for your test environment (localhost) and another one for your Vercel deployment.

When configuring your Vercel deployment using NextAuth, you need to provide additional variables.

- NEXTAUTH_URL=this should be the URL of your Vercel Deployment
- NEXTAUTH_SECRET=This is used to encrypt cookies and tokens. It should be a random string of at least 32 characters. On Linux systems, you can generate a suitable string using the command `openssl rand -base64 32`

### 2. - Basic Setup

1. NextAuth - Getting started: https://next-auth.js.org/getting-started/example
2. Installing dependencies:
   1. `npm install next-auth`
   2. `npm install @auth/mongodb-adapter mongodb`
3. Doing some config:
   1. `db/mongodb.js`:

```js
// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const options = {
  useUnifiedTopology: true,

  useNewUrlParser: true,
};

let client;

let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value

  // is preserved across module reloads caused by HMR (Hot Module Replacement).

  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);

    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.

  client = new MongoClient(uri, options);

  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a

// separate module, the client can be shared across functions.

export default clientPromise;
```

ii. `pages/api/auth/[...nextauth.js]`:

```js
import NextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";

import { MongoDBAdapter } from "@auth/mongodb-adapter";

import clientPromise from "@/db/mongodb";

import dbConnect from "@/db/dbConnect";

import User from "@/db/models/User";

export default NextAuth({
  // Configure one or more authentication providers

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,

      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),

  callbacks: {
    async session({ session, user }) {
      dbConnect();

      const currentUser = await User.findById(user.id);

      if (currentUser.favoritePonies == null) {
        currentUser.favoritePonies = [];

        currentUser.save();
      }

      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
});
```

  <details>
       <summary>What is going on here?</summary>
    
- **MongoDBAdapter**: This adapter is responsible for connecting the authentication system to a MongoDB database, allowing user data to be stored, retrieved, and managed within MongoDB. The `clientPromise` passed to the adapter is a promise that resolves to a MongoDB client, ensuring the database connection is established before the adapter is used.

- **Callbacks**: The `callbacks` object defines functions that run during the authentication process. In this case, there's a single callback for `session`, which customizes the session object.
- **Session Callback**:

  - This asynchronous function is triggered after a user successfully authenticates but before the session object is returned to the client.
  - **Parameters**:
    - `session`: The current session object, which will be modified and returned by the function.
    - `user`: An object containing user data, typically fetched from the database during authentication.
  - **Functionality**:

    1. `dbConnect()`: A call to establish or ensure a connection to the MongoDB database. This function is presumably defined elsewhere in the codebase.
    2. It fetches the current user's data from the database using `User.findById(user.id)`. `User` is likely a model representing users in the database, and `findById` is a method to retrieve a user by their unique identifier.
    3. If the user's `favoritePonies` field is null (indicating that it hasn't been set or initialized), it initializes this field to an empty array and saves the user object back to the database. This ensures every user has a `favoritePonies` field that is an array, which can later be used to store the user's favorite ponies.
    4. It returns an updated session object. The session's `user` object is augmented with the user's ID, ensuring the session accurately reflects the authenticated user's identity.

     </details>

    ### 3. Session-Context bereitstellen, in der `_app.js`:

    ```js
    import { SessionProvider } from "next-auth/react";

    export default function App({
      Component,
      pageProps: { session, ...pageProps },
    }) {
      return (
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      );
    }
    ```

  ### 4. Create LoginButton component using

      `import { useSession, signIn, signOut } from "next-auth/react"; `

### 5. Implement this as part of the `Layout` component to be visible on every page

### 6. create dynamic user API Route `pages/api/user/[id].js` and handle the methods: `GET, POST & PATCH`

### 7. refactor `pages/favorite.js` to fetch the user bases on the `session.data.user.id` and map over `user.favoritePonies`. Consider covering potential exceptions

### 8. refactor `pages/ponies/[id].js` to fetch the user and the pony; additionally, adapt the toggleFavorite function to handle 3 cases:

- `session.status === "unauthenticated"` -> user not allowed to use function
- pony is part of the user's favorite ponies -> send a PATCH request to remove entry from array
- pony is not yet part of the user's favorite ponies -> send a POST request to add entry to array
- if the responses from steps 2 or 3 are ok, mutate
- adapt the isFavorite boolean

### 9. Cross your fingers that everything works!

### Link collection

- [NextAuth Docs](https://next-auth.js.org/)
- [List of Providers for OAuth](https://next-auth.js.org/providers/)
- [Information about the Deployment](https://next-auth.js.org/deployment)

### Afterthought

#### Why should I use NextAuth instead of manually taking care of it?

Using NextAuth and OAuth for authentication in your applications, instead of manually handling usernames, passwords, and their hashes, offers several significant advantages that can enhance security, simplify development, and improve user experience. Here's a concise explanation:

1. Enhanced Security: OAuth providers like Google, Facebook, and Twitter invest heavily in security. By leveraging their authentication systems, you inherit their advanced security measures, such as two-factor authentication and ongoing security updates. This reduces the risk of common vulnerabilities associated with handling passwords directly, such as password theft or brute force attacks.

2. Simplified Development: Implementing a secure authentication system from scratch is complex and time-consuming. It involves not just securely hashing and storing passwords, but also implementing password recovery, account verification emails, and protection against various attacks. NextAuth abstracts away these complexities, allowing you to implement authentication quickly and with fewer lines of code, reducing the potential for security mistakes.

3. Improved User Experience: Users increasingly expect seamless login experiences across websites and applications. Integrating with OAuth providers allows users to sign in with their existing accounts from trusted platforms, eliminating the need to remember another set of credentials. This convenience can lead to higher sign-up and retention rates.

4. Compliance and Best Practices: Managing user credentials requires compliance with data protection regulations like GDPR, which include stipulations on how personally identifiable information (PII) should be stored and processed. Utilizing OAuth and NextAuth can help offload some of these responsibilities to providers that are already compliant, ensuring that you're following best practices without needing to become an expert in regulatory nuances.

5. Scalability: As your application grows, so does the complexity of managing authentication. Relying on NextAuth and OAuth can simplify scaling your user management system, as these solutions are designed to handle a large number of authentication requests efficiently.

6. Focus on Core Features: By offloading the authentication complexity to NextAuth and OAuth providers, your team can focus on developing the core features of your application, improving the overall quality and speed of development.

In summary, while managing passwords and authentication in-house offers control, using NextAuth with OAuth providers delivers robust security, simplifies the development process, enhances user experience, ensures compliance with best practices, aids scalability, and lets you concentrate on your application's unique value proposition.
