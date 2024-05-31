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

const schema = /* GraphQL */ `
  type User {
    user_id: ID!
    username: String!
    password: String!
    user_type: String!
  }

  type OrderedProducts {
    id: ID!
    order_id: Int!
    product_id: Int!
    quantity: Int!
  }

  type Order {
    order_id: ID!
    orderProducts: [OrderedProducts!]!
  }

  type Query {
    getUser(id: ID!): User
    getOrder(id: ID!): Order
  }
`;

// The rootValue provides a resolver function for each API endpoint
var rootValue = {
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
        orderProducts: {
          select: {
            id: true,
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
    const x: any = DatatypeParser(result);
    return x;
  },
};

const getUsers = async () => {
  try {
    const id = 1;
    let query = "";
    query = /* GraphQL */ `
      query {
        getUser(id: ${id}) {
          user_id
          username
          password
        }
      }
    `;

    query = /* GraphQL */ `
      query {
        getOrder(id: 1) {
          order_id
          orderProducts {
            id
            order_id
            product_id
            quantity
          }
        }
      }
    `;

    // prettier-ignore
    const { data: { getOrder: order } }: any = await graphql({ schema: gql(schema), source: query, rootValue });

    return order;
  } catch (error) {
    return error;
  }
};

export default async function Home() {
  const users: any = await getUsers();
  return (
    <main className={styles.main}>
      <p>{typeof users.orderProducts[0].product_id}</p>
      <p>{typeof users.orderProducts[0].product_id}</p>
    </main>
  );
}
