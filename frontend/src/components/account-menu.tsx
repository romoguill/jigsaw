import { useAuth } from "@/features/auth/hooks/auth-provider";
import { useLogout } from "@/features/auth/hooks/mutations";
import { Button } from "./ui/button";
import { Popover, PopoverDialog, PopoverTrigger } from "./ui/popover";

function AccountMenu() {
  const user = useAuth();
  const { mutate: logout } = useLogout();

  if (!user) return null;

  console.log(user.name.split(" "));

  return (
    <PopoverTrigger>
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
      <Popover offset={10}>
        <PopoverDialog>
          <div className="space-y-3">
            <Button variant="destructive" onPress={() => logout()}>
              Logout
            </Button>
          </div>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  );
}

export default AccountMenu;
