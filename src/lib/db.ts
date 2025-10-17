import { PrismaClient } from "@/generated/prisma";

// add prisma property to global object
const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV != "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
