"use client";

import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { ResetSchema } from "@/schemas";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { reset } from "@/actions/reset";

export const ResetForm = () => {
   const [isPending, startTransition] = useTransition();

   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");

   const formMethods = useForm<z.infer<typeof ResetSchema>>({
      resolver: zodResolver(ResetSchema),
      defaultValues: {
         email: "",
      },
   });

   const onSubmit: SubmitHandler<z.infer<typeof ResetSchema>> = (values) => {
      setError("");
      setSuccess("");
      startTransition(() => {
         reset(values).then((data) => {
            setError(data.error);
            setSuccess(data.success);
         });
      });
   };

   return (
      <CardWrapper
         headerLabel="Forgot your password?"
         backButtonLabel="Back to login"
         backButtonHref="/auth/login"
      >
         <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
               <div className="space-y-4">
                  <FormField
                     control={formMethods.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 placeholder="john.doe@example.com"
                                 type="email"
                                 disabled={isPending}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button className="w-full" type="submit" disabled={isPending}>
                  Send reset email
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
};
