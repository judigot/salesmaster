// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import cookie from "cookie";

const prisma = new PrismaClient();

type Data = {
  username: string;
  password: string;
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
      const { username, password } = req.body;
      if (username && password) {
        const user = await prisma.user.findFirst({
          select: {
            username: true,
            password: true,
            user_type: true,
          },
          where: {
            username: username,
          },
        });

        // If user exists
        if (user) {
          const hash: string = user.password;
          bcrypt.compare(password, hash).then((isCorrectPassword) => {
            let accessToken = undefined;
            if (isCorrectPassword) {
              //====================JWT====================//
              // Set user information (payload) to be sent to the client (exclude sensitive information like passwords)
              const { password, ...userInfo } = user;
              accessToken = jwt.sign(
                userInfo,
                `${process.env.ACCESS_TOKEN_SECRET}`
                // { expiresIn: "5s" }
              );
              res.setHeader(
                "Set-Cookie",
                cookie.serialize("accessToken", accessToken, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "strict",
                  // maxAge: 60 * 60 * 24 * 7, // 1 week
                })
              );
              //====================JWT====================//
            }
            res.status(200).json({
              accessToken,
            } as unknown as Data);
          });
        }
        if (!user) {
          res.status(200).json(false as unknown as Data);
        }
      }
      break;
    default:
      res.status(200).json({} as Data);
      break;
  }
}
