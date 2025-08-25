
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronsUpDown, UserCircle, Settings } from 'lucide-react';
import type { User } from '@/lib/data';
import { users } from '@/lib/data';

interface UserMenuProps {
  user: User;
  setUser: (user: User) => void;
}

export function UserMenu({ user, setUser }: UserMenuProps) {

  const name = user.name;
  const email = user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-1 h-auto"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
           <div className="hidden text-left md:block">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <ChevronsUpDown className="hidden h-4 w-4 text-muted-foreground md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={user.id}
          onValueChange={(id) => {
            const newUser = users.find((u) => u.id === id);
            if (newUser) {
              setUser(newUser);
            }
          }}
        >
          <DropdownMenuLabel>Switch User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {users.map((u) => (
            <DropdownMenuRadioItem key={u.id} value={u.id}>
              {u.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
