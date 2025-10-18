import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";

export const appRouter = createTRPCRouter({
    testAI: protectedProcedure.mutation(async () => {
        await inngest.send({
            name: "execute/ai",
        });

        return { success: true, message: "AI job queued" };
    }),
    getWorkflows: protectedProcedure.query(({ ctx }) => {
        return prisma.workflow.findMany();
    }),
    createWorkflow: protectedProcedure.mutation(async () => {
        await inngest.send({
            name: "test/hello.world",
            data: {
                email: "aditya.chaudhary0523@gmail.com",
            },
        });

        return { success: true, message: "Job queued" };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
