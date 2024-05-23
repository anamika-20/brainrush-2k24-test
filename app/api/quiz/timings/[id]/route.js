import { NextResponse } from "next/server";
import User from "@models/user";
import Team from "@models/team";
import EventTimings from "@models/eventTimings";
import Quiz from "@models/quiz";
import EventDay from "@models/eventDay";
import { connectToDatabase } from "@utils/db";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const email = req.headers.get("Authorization");
    const user = await User.findOne({ email: email });
    //check user is in the team
    const teamDetails = await Team.findOne({
      $or: [{ leader: user._id }, { members: user._id }],
    }).populate(["leader", "members"]);
    if (!teamDetails) {
      return NextResponse.json({
        success: false,
        message: "Team not found",
      });
    }
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid Id",
        },
        { status: 404 }
      );
    }
    //check the team Id sent from the front end is equal to the team where the user belongs
    if (String(teamDetails._id) !== id) {
      return NextResponse.json(
        {
          message: "You are not the part of the team",
        },
        { status: 404 }
      );
    }
    const eventDay = await EventDay.findOne({ team: id });
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

    const quiz = await Quiz.findOne({ team: id });

    if (flag) {
      if (!quiz) {
        return NextResponse.json({
          canStartQuiz: true,
          alreadyStarted: false,
        });
      } else {
        return NextResponse.json({
          canStartQuiz: true,
          alreadyStarted: quiz.quizStarted,
        });
      }
    } else {
      return NextResponse.json({
        canStartQuiz: false,
        alreadyStarted: false,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
