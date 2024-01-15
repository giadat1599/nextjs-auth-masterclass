import { v4 as uuidV4 } from "uuid";

import { db } from "./db";
import { getVertificationTokenByEmail } from "@/data/vertification-token";

export const generateVertificationToken = async (email: string) => {
   const token = uuidV4();
   const expires = new Date(new Date().getTime() + 3600 * 1000);

   const exisitingToken = await getVertificationTokenByEmail(email);

   if (exisitingToken) {
      await db.vertificationToken.delete({
         where: { id: exisitingToken.id },
      });
   }

   const vertificationToken = await db.vertificationToken.create({
      data: {
         token,
         email,
         expires,
      },
   });

   return vertificationToken;
};
