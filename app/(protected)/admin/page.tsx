"use client";

import { toast } from "sonner";

import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { admin } from "@/actions/admin";

export default function AdminPage() {
   const onApiRouteClick = () => {
      fetch("/api/admin").then((res) => {
         if (res.ok) {
            toast.success("Allowed API Route");
         } else {
            toast.error("Forbbiden API Route");
         }
      });
   };
   const onServerActionClick = () => {
      admin().then((data) => {
         if (data.error) {
            toast.error(data.error);
         }

         if (data.success) {
            toast.success(data.success);
         }
      });
   };
   return (
      <Card className="w-[600px]">
         <CardHeader>
            <p className="text-2xl font-semibold text-center">🔑 Admin</p>
         </CardHeader>
         <CardContent className="space-y-4">
            <RoleGate allowedRole={UserRole.ADMIN}>
               <FormSuccess message="You are allowed to see this content!" />
            </RoleGate>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
               <p className="font-medium text-sm">Admin-only API Route</p>
               <Button onClick={onApiRouteClick}>Click to test</Button>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
               <p className="font-medium text-sm">Admin-only Server Action</p>
               <Button onClick={onServerActionClick}>Click to test</Button>
            </div>
         </CardContent>
      </Card>
   );
}