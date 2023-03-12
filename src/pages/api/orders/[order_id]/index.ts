// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import DatatypeParser from "@utilities/DatatypeParser";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Data = {
  order_id: number;
  customer_id: number;
  order_date: Date;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  (async () => {
    try {
      const { order_id } = req.query;
      const result: any = await prisma.order.findUnique({
        select: {
          order_id: true,
          customer_id: true,
          orderProducts: {
            select: {
              id: true,
              order_id: true,
              product_id: true,
              quantity: true,
              product_cost: true,
              product_price: true,
              discount: true,
            },
          },
          order_date: true,
        },
        where: {
          order_id: BigInt(order_id as string),
        },
      });
      res.status(200).json(DatatypeParser(result) as unknown as Data);
    } catch (error: any) {
      throw new Error(error);
    }
  })();
}
