import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

import { PrismaClient } from "@prisma/client";

import DatatypeParser from "@utilities/DatatypeParser";

const prisma = new PrismaClient();

const Users = prisma.user;

const getUsers = async () => {
  try {
    const result = await Users.findMany();
    return DatatypeParser(result);
  } catch (error) {
    return error;
  }
};

export default async function Home() {
  const users: any = await getUsers();
  return (
    <main className={styles.main}>
      {users?.map((row: { [key: string]: string }, i: number) => {
        return <span key={i}>{JSON.stringify(row)}</span>;
      })}
    </main>
  );
}
