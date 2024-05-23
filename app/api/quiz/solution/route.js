import { NextResponse } from "next/server";
import User from "@models/user";
import Team from "@models/team";
import { connectToDatabase } from "@utils/db";
import Question from "@models/question";
import Quiz from "@models/quiz";
import EventDay from "@models/eventDay";
import EventTimings from "@models/eventTimings";

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
    if (teamDetails.quizTopics.length !== 3) {
      return NextResponse.json({
        success: false,
        message: "Choose Topics first",
      });
    }
    const eventDay = await EventDay.findOne({ team: teamDetails._id });
    if (!eventDay || !eventDay.attendance) {
      return NextResponse.json(
        {
          message: "You are not present in the event",
        },
        { status: 403 }
      );
    }
    const event = await EventTimings.findOne({
      name: "First Round",
    });
    const today = new Date();
    const flag =
      today >= new Date(event.startTime) && today < new Date(event.endTime);
    if (!flag) {
      return NextResponse.json(
        {
          message: "You can not start the quiz now",
        },
        { status: 400 }
      );
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
      message: "All Questions",
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
