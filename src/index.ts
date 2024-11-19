import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";

import CustomerController from "./controllers/CustomerController"; // ไม่ค่อยนิยมใช้กัน
import { UserController } from "./controllers/UserController"; // คนนิยมใช้กัน

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(swagger({
    documentation: {
      tags: [
        { name: 'User', description: 'User related endpoints' },
        { name: 'Customer', description: 'Customer related endpoints' }
      ]
    }
  }))
  .use(jwt({
    name: "jwt",
    secret: "secret",
  }))

  .group('/users', (app) => app
    .get('/', UserController.list, { tags: ['User'] })
    .post('/', UserController.create, { tags: ['User'] })
    .put('/:id', UserController.update, { tags: ['User'] })
    .delete('/:id', UserController.remove, { tags: ['User'] })
    .get('/some-field', UserController.findSomeField, { tags: ['User'] })
    .get('/sort', UserController.sort, { tags: ['User'] })
    .get('/filter', UserController.filter, { tags: ['User'] })
    .get('/more-than', UserController.moreThan, { tags: ['User'] })
    .get('/less-than', UserController.lessThan, { tags: ['User'] })
    .get('/not-equal', UserController.notEqual, { tags: ['User'] })
    .get('/in', UserController.in, { tags: ['User'] })
    .get('/is-null', UserController.isNull, { tags: ['User'] })
    .get('/is-not-null', UserController.isNotNull, { tags: ['User'] })
    .get('/between', UserController.between, { tags: ['User'] })
  )

  .group('/customers', (app) => app
    .get("/", CustomerController.list, { tags: ['Customer'] })
    .post("/", CustomerController.create, { tags: ['Customer'] })
    .put("/:id", CustomerController.update, { tags: ['Customer'] })
    .delete("/:id", CustomerController.remove, { tags: ['Customer'] })
  ) // bun prisma db pull

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
  .get('/info', async ({ jwt, request }) => {
    if (request.headers.get('Authorization') === null) {
      return { message: "No Authorization header" };
    }

    const token = request.headers.get('Authorization') ?? '';

    if (token === '') {
      return { message: "No token" };
    }

    const payload = await jwt.verify(token);

    return {
      message: 'Hello Elysia',
      payload: payload,
    }
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
