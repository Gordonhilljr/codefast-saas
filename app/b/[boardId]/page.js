import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import { redirect } from "next/navigation";

const getBoard = async (boardId) => {
  await connectMongo();

  const board = await Board.findById(boardId);
  if (!board) {
    redirect("/dashboard");
  }

  return board;
};

export default async function PublicFeedbackBoard({ params }) {
  const { boardId } = params;
  console.log(boardId);

  const board = await getBoard(boardId);

  return <main>{board.name}(public)</main>;
}
