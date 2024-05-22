import { NextResponse } from "next/server";
import User from "@models/user";
import Team from "@models/team";
import { connectToDatabase } from "@utils/db";
import QuizTitle from "@models/quizTitle";
import Question from "@models/question";
import Quiz from "@models/quiz";

//get all questions
export async function GET(req, { params }) {
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
    const { teamId } = params;
    const quiz = await Quiz.findOne({ team: teamId });
    if (!quiz?.quizEnded) {
      return NextResponse.json({ message: "Quiz not ended" }, { status: 400 });
    }
    // Fetch the questions for the given quiz IDs
    const questions = await Question.find({
      title: { $in: teamDetails.quizTopics },
    }).populate("title");
    //   .populate("title", "title") // Populate the title field with the title from QuizTitle
    //   .exec();
    return NextResponse.json({
      success: true,
      message: "All Quiz Titles",
      questions,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
