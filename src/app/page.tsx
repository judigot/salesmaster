import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

import { PrismaClient } from "@prisma/client";

import DatatypeParser from "@utilities/DatatypeParser";

const prisma = new PrismaClient();

const Users = prisma.user;

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  buildSchema as gql,
} from "graphql";

// Run the GraphQL query '{ users }' and print out the response// Construct a schema, using GraphQL schema language
var schema = gql(`
  type User {
    user_id: ID!
    username: String!
    password: String!
    user_type: String!
  }

  type OrderedProducts {
    order_id: ID!
    product_id: ID!
    quantity: ID!
  }

  type Order {
    order_id: ID!
    products: [OrderedProducts!]
  }

  type Query {
      getText: String!
      getUser(id: ID!): User
      getOrder(id: ID!): Order
  }
`);

// The rootValue provides a resolver function for each API endpoint
var rootValue = {
  getText: () => {
    return "Hello, World!";
  },
  getUser: async ({ id }: { id: string }) => {
    const result: any = await Users.findUnique({
      select: {
        user_id: true,
        username: true,
        password: true,
      },
      where: {
        user_id: parseInt(id),
      },
    });
    return DatatypeParser(result);
  },
  getOrder: async ({ id }: { id: string }) => {
    const result: any = await prisma.order.findUnique({
      select: {
        order_id: true,
        orderHasMany_order_product: {
          select: {
            order_id: true,
            product_id: true,
            quantity: true,
          },
        },
      },
      where: {
        order_id: parseInt(id),
      },
    });
    console.log(result);
    return DatatypeParser(result);
  },
};

const getUsers = async () => {
  try {
    let source = "";
    // source = "{ getText }";
    // source = "{ getUser(id: 1) { user_id, username, password } }";
    source = "{ getOrder(id: 1) { order_id } }";

    graphql({ schema, source, rootValue })
      .then((result) => {
        // Success
        console.log(JSON.stringify(result.data));
        return result.data;
      })
      .catch((error) => {
        // Failure
        throw new Error(error);
      })
      .finally(() => {
        // Finally
      });
  } catch (error) {
    return error;
  }
};

export default async function Home() {
  const users: any = await getUsers();
  return <main className={styles.main}></main>;
}
