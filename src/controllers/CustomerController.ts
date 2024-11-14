export default {
    list: () => {
        const customers = [
            { id: 1, name: 'John Doe', email: 'john@doe.com' },
            { id: 2, name: 'Jane Doe', email: 'jane@doe.com' },
            { id: 3, name: 'Jim Beam', email: 'jim@beam.com' },
        ]

        return customers;
    },
    create: ({ body }: {
        body: {
            id: number,
            name: string,
            email: string
        }
    }) => {
        return body;
    },
    update: ({ body, params }: {
        body: {
            name: string,
            email: string
        },
        params: {
            id: number
        }
    }) => {
        return { body: body, id: params.id };
    },
    remove: ({ params }: {
        params: {
            id: number
        }
    }) => {
        return { id: params.id };
    }
}