import { DataTable } from "@/frontend/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { GameDifficulty, User } from "@jigsaw/shared";

type GameEntry = {
  id: number;
  imageKey: string;
  pieceCount: number;
  pieceSize: number;
  difficulty: GameDifficulty;
  owner: User;
  createdAt: string;
};

interface GamesTableProps {
  games: GameEntry[];
}

function GamesTable({ games }: GamesTableProps) {
  const columns: ColumnDef<GameEntry>[] = [
    {
      accessorKey: "imageKey",
      header: "Image Key",
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
    },
  ];

  return <DataTable columns={columns} data={games} />;
}
export default GamesTable;
