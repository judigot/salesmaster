import { NextResponse } from "next/server";

import DatatypeParser from "@utilities/DatatypeParser";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Product = prisma.product;

export async function GET(req: Request) {
  try {
    const result: any = await Product.findMany();
    return NextResponse.json(DatatypeParser(result), {
      status: 200,
    });
    // res.status(200).json(DatatypeParser(result) as unknown as Data);
  } catch (error: any) {
    throw new Error(error);
  }
}
