import { PrismaClient } from '@prisma/client';

export async function GET(req: Request, route: { params: { no_ref: string } }) {
  const prisma = new PrismaClient();
  const no_ref = route.params.no_ref;
  const getReceipt = await prisma.transactions.findFirst({
    where: {
      no_ref: no_ref,
    },
    select: {
      no_ref: true,
      created_at: true,
      total_price: true,
      pay: true,
      change: true,
      employee: {
        select: {
          name: true,
          admin: {
            select: {
              client: {
                select: {
                  client_name: true,
                },
              },
            },
          },
        },
      },
      customer: {
        select: {
          name: true,
        },
      },
      transactionLists: {
        select: {
          id: true,
          qty: true,
          total_price: true,
          created_at: true,

          sellingUnit: {
            select: {
              price: true,
              product: {
                select: {
                  product_name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  await prisma.$disconnect();
  if (!getReceipt)
    return Response.json({
      receiptDetail: getReceipt,
    });
  return Response.json({
    receiptDetail: getReceipt,
  });
}
