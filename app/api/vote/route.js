import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import { auth } from "@/auth";

export async function POST(req) {
  const { searchParams } = req.nextUrl;
  const postId = searchParams.get("postId");

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already voted
    if (post.voters.includes(session.user.id)) {
      return NextResponse.json({ error: "Already voted" }, { status: 400 });
    }

    post.votesCounter += 1;
    post.voters.push(session.user.id);
    await post.save();

    return NextResponse.json(
      { message: "Vote added successfully", votesCounter: post.votesCounter },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = req.nextUrl;
  const postId = searchParams.get("postId");

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user has voted
    if (!post.voters.includes(session.user.id)) {
      return NextResponse.json({ error: "Haven't voted yet" }, { status: 400 });
    }

    post.votesCounter = Math.max(0, post.votesCounter - 1);
    post.voters = post.voters.filter(
      (voterId) => voterId.toString() !== session.user.id
    );
    await post.save();

    return NextResponse.json(
      { message: "Vote removed successfully", votesCounter: post.votesCounter },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
