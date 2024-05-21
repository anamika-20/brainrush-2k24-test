import { NextResponse } from "next/server";
import User from "@models/user";
import Team from "@models/team";
import ConfirmationRequest from "@models/confirmationRequest";
import { connectToDatabase } from "@utils/db";
import QuizTitle from "@models/quizTitle";
import Question from "@models/question";

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

//create a new Team
export async function POST(request) {
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
    // if (teamDetails.members.length != 2) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Team not complete",
    //   });
    // }

    const { quizIds } = await request.json();
    // console.log(request.body);
    if (!Array.isArray(quizIds) || quizIds.length !== 3) {
      return NextResponse.json(
        { message: "You must provide exactly 3 quiz IDs" },
        { status: 400 }
      );
    }

    // Fetch the questions for the given quiz IDs
    const questions = await Question.find({ title: { $in: quizIds } }).populate(
      "title"
    );
    //   .populate("title", "title") // Populate the title field with the title from QuizTitle
    //   .exec();

    return NextResponse.json({
      success: true,
      message: "Questions retrieved Successfully",
      questions,
    });
  } catch (error) {
    console.error("Error ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
