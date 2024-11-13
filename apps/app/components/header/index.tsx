import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";
import Search from "./search";
import User from "./user";

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
      href: "https://discord.gg/livepeer",
    },
  ];

  return (
    <div className="flex h-16 w-full items-center justify-between">
      <div className="flex items-center gap-8">
        <Search />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden gap-6 md:flex ">
          {menuItems.map((item) => (
            <Link
              href={item.href}
              target="_blank"
              key={item.label}
              className="text-muted-foreground text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Button variant="outline" className="hidden md:flex">
          <GitHubLogoIcon />
          <span>Github</span>
        </Button>
        <User />
        <ModeToggle />
      </div>
    </div>
  );
}
