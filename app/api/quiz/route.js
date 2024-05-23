import { NextResponse } from "next/server";
import User from "@models/user";
import Team from "@models/team";
import { connectToDatabase } from "@utils/db";
import QuizTitle from "@models/quizTitle";
import Question from "@models/question";
import Quiz from "@models/quiz";
import EventDay from "@models/eventDay";
import EventTimings from "@models/eventTimings";

//get all quiz topics
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
          message: "You can not get the quiz topics now",
        },
        { status: 400 }
      );
    }
    const quiz = await Quiz.findOne({ team: teamDetails._id });
    if (quiz && quiz?.quizStarted) {
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
    if (teamDetails.members.length != 2 || !teamDetails.payment) {
      return NextResponse.json({
        success: false,
        message: "Team is not eligible for the quiz",
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
          message: "You can not choose the quiz topics now",
        },
        { status: 400 }
      );
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
