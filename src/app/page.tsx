import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

import { PrismaClient } from "@prisma/client";

import crypto from "crypto";

const prisma = new PrismaClient();

const Users = prisma.app_user;

const tableName = "app_user";

const getUsers = async () => {
  try {
    const result = prisma.$queryRawUnsafe(`SELECT * FROM ${tableName};`);
    return result;
  } catch (error) {
    return error;
  }
};

export default async function Home() {
  const users: any = await getUsers();
  return (
    <main className={styles.main}>
      {users?.map((row: { [key: string]: string }, i: number) => {
        return <p key={i}>{row?.username}</p>;
      })}
    </main>
  );
}
