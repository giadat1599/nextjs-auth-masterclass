import { db } from "@/lib/db";

export const getVertificationTokenByEmail = async (email: string) => {
   try {
      const vertificationToken = await db.vertificationToken.findFirst({
         where: { email },
      });

      return vertificationToken;
   } catch {
      return null;
   }
};

export const getVertificationTokenByToken = async (token: string) => {
   try {
      const vertificationToken = await db.vertificationToken.findUnique({
         where: { token },
      });

      return vertificationToken;
   } catch {
      return null;
   }
};
