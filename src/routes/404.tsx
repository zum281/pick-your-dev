import type { FC } from "react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export const NotFound: FC = () => {
  return (
    <div className="text-center space-y-8">
      <Text as="h1">Did you get lost?</Text>
      <Button asChild className="w-fit mx-auto">
        <Link href="/">Go back to the beginning</Link>
      </Button>
    </div>
  );
};
