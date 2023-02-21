// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

const prisma = new PrismaClient();

const Product = prisma.product;

type Data = {
  // product_id: number;
  // product_name: string;
  // product_category: number;
  // product_cost: Decimal;
  // product_price: Decimal;
  // product_stock: BigInt;
  // status: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { product_id } = req.query;
  console.log(typeof BigInt(product_id as string));
  Product.findUnique({
    where: {
      product_id: BigInt(product_id as string),
    },
  })
    // prisma
    //   .$queryRawUnsafe(
    //     `SELECT * FROM "product";`
    //     // `SELECT * FROM "product" WHERE "product_id" = ${product_id};`
    //   )
    .then((result: any) => {
      // Success
      let cleanedResult = undefined;

      let cleanRow: { [key: string]: string | number | Decimal } | undefined =
        {};

      if (Array.isArray(result)) {
        cleanRow = undefined;
        cleanedResult = result.map(
          (result: { [key: string]: string | number }, i: number) => {
            const cleanRow: { [key: string]: string | number } = {};
            // prettier-ignore
            for ( let i = 0, arrayLength = Object.keys(result).length; i < arrayLength; i++ ) {
              const key: string = Object.keys(result)[i];
              const value = result[key];
              switch (typeof value) {
                case "bigint":
                  cleanRow[key] = parseInt((value as number).toString());
                  break;
                case "object":
                  cleanRow[key] = parseFloat(value);
                  break;
                default:
                  cleanRow[key] = value;
                  break;
              }
            }
            return cleanRow;
          }
        );
      } else {
        // prettier-ignore
        for ( let i = 0, arrayLength = Object.keys(result).length; i < arrayLength; i++ ) {
          const key: string = Object.keys(result)[i];
          const value = result[key];
          switch (typeof value) {
            case "bigint":
              cleanRow[key] = parseInt((value as unknown as number).toString());
              break;
            case "object":
              cleanRow[key] = parseFloat(value);
              break;
            default:
              cleanRow[key] = value;
              break;
          }
        }
      }

      res.status(200).json(cleanRow || (cleanedResult as Data));

      // {
      //   product_id: 6,
      //   product_name: "Sandwich Bread",
      //   product_category: 2,
      //   product_cost: 19 as unknown as Decimal,
      //   product_price: 29.99 as unknown as Decimal,
      //   product_stock: BigInt(0),
      //   status: "active",
      // }
    })
    .catch((error: string) => {
      // Failure
      console.log(error);
    })
    .finally(() => {
      // Finally
    });
}
