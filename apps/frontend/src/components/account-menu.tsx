import { Button } from "@/frontend/components/ui/button";
import {
  Menu,
  MenuItem,
  MenuPopover,
  MenuTrigger,
} from "@/frontend/components/ui/menu";
import { useLogout } from "@/frontend/features/auth/hooks/mutations";
import { useCurrentUser } from "@/frontend/features/auth/hooks/queries";
import { Route as adminRoute } from "@/frontend/routes/admin/_admin/index";
import { Link } from "@tanstack/react-router";

function AccountMenu({ onLogout }: { onLogout: () => void }) {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();

  if (!user) return null;

  return (
    <MenuTrigger>
      <Button
        variant="ghost"
        className="m-4 rounded-full size-10 p-0 overflow-hidden"
      >
        {user.image ? (
          <img
            src={user.image}
            width={40}
            height={40}
            referrerPolicy="no-referrer"
            className="object-cover size-10"
          />
        ) : (
          <div className="size-10 rounded-full flex items-center justify-center text-lg bg-slate-700 dark:bg-slate-300 text-slate-100 dark:text-slate-800">
            {user.name.split(" ")[0][0]}
          </div>
        )}
      </Button>
      <MenuPopover>
        <Menu>
          {user.role === "admin" && (
            <MenuItem disableSelection>
              <Link to={adminRoute.to}>Admin</Link>
            </MenuItem>
          )}
          <MenuItem
            onAction={() => logout(undefined, { onSuccess: () => onLogout() })}
          >
            Logout
          </MenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}

export default AccountMenu;
