// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Decimal } from "@prisma/client/runtime";

import DatatypeParser from "@utilities/DatatypeParser";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Data = {
  product_id: number;
  product_name: string;
  product_category: number;
  product_cost: Decimal;
  product_price: Decimal;
  product_stock: BigInt;
  status: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  (async () => {
    try {
      const { user_id } = req.query;
      const result: any = await prisma.user.findUnique({
        where: {
          user_id: BigInt(user_id as string),
        },
      });
      res.status(200).json(DatatypeParser(result) as unknown as Data);
    } catch (error: any) {
      throw new Error(error);
    }
  })();
}
