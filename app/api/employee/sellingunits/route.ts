import { responseError } from "@/app/_lib/PosResponse";
import { PrismaClient } from "@prisma/client";

export async function GET()
{
    const prisma = new PrismaClient()
    const getSellingUnits = await prisma.sellingUnits.findMany()

    await prisma.$disconnect()

    if(getSellingUnits.length == 0) return responseError("Selling unit not found")
    return Response.json(getSellingUnits)
}

export async function POST(req:Request)
{
    const {stock, price} = await req.json()
    const prisma = new PrismaClient()
    const createSellingUnit = await prisma.sellingUnits.create({
        data: {
            stock:stock,
            price:price,
            product_id: "258fa908-b3a7-448e-b57f-254b3178d509",
            unit_id: 2
        }
    })

    await prisma.$disconnect()
    if(!createSellingUnit) return responseError("Failed to create Selling Unit")
    return Response.json({
        success:true,
        message:"Selling Unit Successfully Created"
    })
}