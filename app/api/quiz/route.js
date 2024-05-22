import { NextResponse } from "next/server";
import User from "@models/user";
import Team from "@models/team";
import { connectToDatabase } from "@utils/db";
import QuizTitle from "@models/quizTitle";
import Question from "@models/question";
import Quiz from "@models/quiz";

//get all quizzes
export async function GET(req) {
  try {
    await connectToDatabase();
    const email = req.headers.get("Authorization");
    const user = await User.findOne({ email: email });
    const teamDetails = await Team.findOne({
      $or: [{ leader: user._id }, { members: user._id }],
    }).populate(["leader", "members"]);
    if (!teamDetails) {
      return NextResponse.json({
        success: false,
        message: "Team not found",
      });
    }
    const quiz = await Quiz.findOne({ team: teamDetails._id });
    if (quiz?.quizStarted) {
      return NextResponse.json(
        { message: "Quiz already started" },
        { status: 400 }
      );
    }
    const quizTitles = await QuizTitle.find({});
    return NextResponse.json({
      success: true,
      message: "All Quiz Titles",
      quizzes: quizTitles,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//set quizzes to teams
export async function PATCH(request) {
  try {
    await connectToDatabase();
    const email = request.headers.get("Authorization");
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }
    const teamDetails = await Team.findOne({
      $or: [{ leader: user._id }, { members: user._id }],
    }).populate(["leader", "members"]);
    if (!teamDetails) {
      return NextResponse.json({
        success: false,
        message: "Team not found",
      });
    }
    if (teamDetails.members.length != 2) {
      return NextResponse.json({
        success: false,
        message: "Team not complete",
      });
    }
    const quiz = await Quiz.findOne({ team: teamDetails._id });
    if (quiz) {
      return NextResponse.json(
        { message: "Quiz already started" },
        { status: 400 }
      );
    }
    const { quizIds } = await request.json();
    if (!Array.isArray(quizIds) || quizIds.length !== 3) {
      return NextResponse.json(
        { message: "You must provide exactly 3 quiz IDs" },
        { status: 400 }
      );
    }
    teamDetails.quizTopics = quizIds;
    await teamDetails.save();

    return NextResponse.json({
      success: true,
      message: "Quizzes Assigned",
    });
  } catch (error) {
    console.error("Error ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
