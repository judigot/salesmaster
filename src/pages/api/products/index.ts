// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Decimal } from "@prisma/client/runtime";

import DatatypeParser from "@utilities/DatatypeParser";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Product = prisma.product;

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
  const { product_id } = req.query;
  Product.findMany()
    .then((result: any) => {
      // Success
      const data = DatatypeParser(result) as unknown as Data;
      res.status(200).json(data);
    })
    .catch((error: string) => {
      // Failure
      console.log(error);
    })
    .finally(() => {
      // Finally
    });
}
