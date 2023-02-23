// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import cookie from "cookie";

const prisma = new PrismaClient();

const User = prisma.user;

type Data = {
  // username: string;
  // password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      res.redirect("/");
      break;
    case "POST":
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token) {
        try {
          const user: any = jwt.verify(
            token,
            `${process.env.ACCESS_TOKEN_SECRET}`
          );
          res.setHeader("user", user);
          res.status(200).json({
            redirect: "user",
            user,
          });
        } catch (error) {
          res.status(403);
        }
      } else {
        res.status(200).json({
          redirect: "login",
        });
      }
      break;
    default:
      res.json({} as Data);
      break;
  }
}
