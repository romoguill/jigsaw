import { DataTable } from "@/frontend/components/data-table";
import { Button } from "@/frontend/components/ui/button";
import { apiClient } from "@/frontend/lib/api-client";
import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono/client";
import { useDeleteGame } from "../api/mutations";

// type GameEntry = {
//   id: number;
//   imageKey: string;
//   imageUrl: string;
//   pieceCount: number;
//   pieceSize: number;
//   difficulty: GameDifficulty;
//   owner: User;
//   createdAt: string;
// };

type GameEntry = InferResponseType<typeof apiClient.game.$get>[number];

interface GamesTableProps {
  games: GameEntry[];
}

function GamesTable({ games }: GamesTableProps) {
  const { mutate: deleteGame } = useDeleteGame();

  const columns: ColumnDef<GameEntry>[] = [
    {
      accessorKey: "imageUrl",
      header: undefined,
      cell: ({ row }) => (
        <img
          src={row.original.imageUrl}
          alt={`Game - ${row.original.id}`}
          className="w-20 h-20 object-cover"
        />
      ),
    },
    {
      accessorKey: "pieceCount",
      header: "Piece Count",
    },
    {
      accessorKey: "pieceSize",
      header: "Piece Size",
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        return row.original.owner.role;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString("fr-CA", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          onClick={() => deleteGame(row.original.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={games} />;
}
export default GamesTable;
