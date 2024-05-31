// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import DatatypeParser from "@utilities/DatatypeParser";

import { PrismaClient } from "@prisma/client";
import rawQuery from "../rawQuery";

const prisma = new PrismaClient();

type Data = {
  order_id: number;
  customer_id: number;
  order_date: Date;
};

const getData = async (order_id: string | string[] | undefined) => {
  try {
    // const result: any = await prisma.order.findUnique({
    //   select: {
    //     order_id: true,
    //     customer_id: true,
    //     orderProducts: {
    //       select: {
    //         id: true,
    //         order_id: true,
    //         product_id: true,
    //         quantity: true,
    //         product_cost: true,
    //         product_price: true,
    //         discount: true,
    //       },
    //     },
    //     order_date: true,
    //   },
    //   where: {
    //     order_id: BigInt(order_id as string),
    //   },
    // });
    return (await prisma.$queryRawUnsafe(
      rawQuery(/*sql*/ `WHERE order_id = ${order_id}`)
    )) as unknown as Data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  (async () => {
    const { order_id } = req.query;
    // prettier-ignore
    switch (req.method) {
      case "GET":
        // res.redirect("/");
        res.status(200).json(DatatypeParser(await getData(order_id)));
        break;
      case "POST":
        res.status(200).json(DatatypeParser(await getData(order_id)));
        break;
      default:
        res.status(200).json({} as Data);
        break;
    }
  })();
}
