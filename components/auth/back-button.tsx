"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
   label: string;
   href: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
   return (
      <Button asChild variant="link" className="font-normal w-full" size="sm">
         <Link href={href}>{label}</Link>
      </Button>
   );
};
