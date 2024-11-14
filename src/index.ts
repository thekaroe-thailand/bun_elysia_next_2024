import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";

import CustomerController from "./controllers/CustomerController";

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(swagger())
  .use(jwt({
    name: "jwt",
    secret: "secret",
  }))

  .get("/customers", CustomerController.list)
  .post("/customers", CustomerController.create)
  .put("/customers/:id", CustomerController.update)
  .delete("/customers/:id", CustomerController.remove)

  .post("/login", async ({ jwt, cookie: { auth } }) => {
    const user = {
      id: 1,
      name: "John",
      username: 'kob',
      level: 'admin',
      signinTime: new Date().toISOString(),
    }

    const token = await jwt.sign(user);

    auth.set({
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { token: token };
  })
  .get('/profile', async ({ jwt, cookie: { auth } }) => {
    const user = await jwt.verify(auth.value);
    return user;
  })
  .get("/logout", ({ cookie: { auth } }) => {
    return { message: "Logout successful" };
  })
  .get("/", () => "Hello Elysia")
  .get("/hello", () => "Hello World")

  // get and params
  .get("/hello/:name", ({ params }) => `Hello ${params.name}`)

  // get and multiple params
  .get("/hello/:name/:age", ({ params }) => {
    const name = params.name;
    const age = params.age;

    return `Hello ${name} ${age}`;
  })

  .get("/customers", () => {
    const customers = [
      { name: "John", age: 20 },
      { name: "Jane", age: 21 },
      { name: "Doe", age: 22 },
      { name: "Smith", age: 23 },
    ];

    return customers;
  })

  .get("/customers/:id", ({ params }) => {
    const customers = [
      { id: 1, name: "John", age: 20 },
      { id: 2, name: "Jane", age: 21 },
      { id: 3, name: "Doe", age: 22 },
      { id: 4, name: "Smith", age: 23 },
    ];

    const customer = customers.find((customer) => customer.id === Number(params.id));

    if (!customer) {
      return "Customer not found";
    }

    return customer;
  })

  // example http://localhost:3000/customers/query?name=John&age=20
  .get("/customers/query", ({ query }) => {
    const name = query.name;
    const age = query.age;

    return `query: ${name} ${age}`;
  })

  .get("/customers/status", () => {
    return new Response("Hello World", { status: 500 });
  })

  .post("/customers/create", ({ body }: { body: any }) => {
    const name = body.name;
    const age = body.age;

    return `body: ${name} ${age}`;
  })

  .put("/customers/update/:id", ({ params, body }: { params: any; body: any }) => {
    const id = params.id;
    const name = body.name;
    const age = body.age;

    return `params: ${id} body: ${name} ${age}`;
  })

  .put("/customers/updateAll/:id", ({ params, body }: {
    params: { id: string };
    body: { name: string; age: number };
  }) => {
    const id = params.id;
    const name = body.name;
    const age = body.age;

    return `params: ${id} body: ${name} ${age}`;
  })

  .delete("/customers/delete/:id", ({ params }: { params: any }) => {
    const id = params.id;

    return `params: ${id}`;
  })

  // upload file
  .post("/upload-file", ({ body }: { body: { file: File } }) => {
    const file = body.file;

    Bun.write('uploads/' + file.name, file);

    return { message: "File uploaded" };
  })

  // write file
  .get("/write-file", () => {
    Bun.write('test.txt', 'Hello World');

    return { message: "File written" };
  })

  // read file
  .get("/read-file", () => {
    const file = Bun.file('test.txt');

    return file.text();
  })

  // listen
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
