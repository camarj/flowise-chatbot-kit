"use client";

import { ModeToggle } from "./toggle-mode";

export function NavBarComponent() {
  return (
    <nav className='flex absolute end-0 justify-end p-4'>
      <ModeToggle />
    </nav>
  );
}
