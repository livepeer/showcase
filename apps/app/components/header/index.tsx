"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";
import { GitHubLogoIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import Search from "./search";

export default function Header() {
  const menuItems = [
    {
      label: "Explore",
      href: "/explore",
    },
    {
      label: "Learn",
      href: "/learn",
    },
    {
      label: "Community",
      href: "/community",
    },
  ];

  return (
    <div className="flex justify-between  items-center  h-16 w-full">
      <div className="flex items-center gap-8">
        <Search />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex gap-6 ">
          {menuItems.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="text-sm text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Button variant="outline" className="hidden md:flex">
          <GitHubLogoIcon />
          <span>Github</span>
        </Button>
        {/* {authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-9 h-9">
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
              <DropdownMenuContent className="w-72 mr-4 mt-5  p-3 pb-1">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{email}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-10 h-10 rounded-lg">
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
                      <span className="text-sm text-muted-foreground ">
                        via {provider}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setShowBilling(!showBilling)}
                  className="h-10"
                >
                  <CreditCard />
                  Credits and Billing
                </DropdownMenuItem>
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
          )} */}
        <ModeToggle />
      </div>
    </div>
  );
}
