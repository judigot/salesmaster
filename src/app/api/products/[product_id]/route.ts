import { NextResponse } from "next/server";

import DatatypeParser from "@utilities/DatatypeParser";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Product = prisma.product;

export async function GET(req: Request, { params }: any) {
  try {
    const result: Object | null = await Product.findUnique({
      where: {
        product_id: BigInt(params.product_id),
      },
    });
    return NextResponse.json(DatatypeParser(result), {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
