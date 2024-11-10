"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design-system/components/ui/avatar";
import { Button } from "@repo/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function User() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const name = user?.github?.name || user?.discord?.username;
  const email = user?.email;
  const provider = user?.github ? "GitHub" : "Discord";

  const disableLogin = !ready || authenticated;

  return (
    <div>
      {authenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`https://github.com/${user?.github?.username}.png`}
                alt={name || ""}
                className="rounded-lg"
              />
              <AvatarFallback>
                <span className="capitalize">{name?.charAt(0)}</span>
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-5 mr-4 w-72 p-3 pb-1">
            <div>
              <p className="mb-2 text-muted-foreground text-sm">{email}</p>
              <div className="mb-2 flex items-center gap-2">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage
                    src={`https://github.com/${user?.github?.username}.png`}
                    alt={name || ""}
                    className="rounded-lg"
                  />
                  <AvatarFallback className="rounded-lg">
                    <span className="capitalize">{name?.charAt(0)}</span>
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ">
                  <span className="text-sm">{name}</span>
                  <span className="text-muted-foreground text-sm ">
                    via {provider}
                  </span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="h-10" onClick={logout}>
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button disabled={disableLogin} onClick={login}>
          Sign In
        </Button>
      )}
    </div>
  );
}
