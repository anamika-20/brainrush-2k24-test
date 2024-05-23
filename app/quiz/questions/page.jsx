"use client";
import Loader from "@components/Loader/UniversalLoader";
import Question from "@components/Question";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const page = () => {
  const diff = new Date() - new Date(localStorage.getItem("startTime"));
  const time = 1800 - Math.floor(diff / 1000);
  const [timeLeft, setTimeLeft] = useState(time); // 30 minutes in seconds
  const widthPercentage = 100 - (timeLeft / time) * 100;
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("questions"))
  );
  const router = useRouter();
  const team = useSelector((state) => state.team.team);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState(
    JSON.parse(localStorage.getItem("responses"))
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onSave();
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // const getAllQuestions = async () => {
  //   try {
  //     setLoading(true);
  //     const { data } = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/${team?._id}`
  //     );
  //     if (data.success) {
  //       setQuestions(data.questions);
  //       setTimeLeft(1800);
  //     } else {
  //       alert(data?.message);
  //     }
  //     setLoading(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   if (team) getAllQuestions();
  // }, [team]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleNext = () => {
    setClickedIndex(-1);
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      localStorage.setItem("responses", JSON.stringify(responses));
    }
  };
  const onSave = async () => {
    localStorage.setItem("responses", JSON.stringify(responses));
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/${team?._id}`,
        { responses }
      );
      if (data.success) {
        localStorage.removeItem("responses");
        localStorage.removeItem("startTime");
        localStorage.removeItem("questions");
        alert("Quiz has been submitted and responses has been recorded");
        router.push("/quiz/result");
      } else {
        alert(data?.message);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handlePrev = () => {
    setClickedIndex(-1);
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      localStorage.setItem("responses", JSON.stringify(responses));
    }
  };

  const handleClick = (qid, ans, index) => {
    var temp = [...responses];
    const existingResponseIndex = temp.findIndex(
      (response) => response.question === qid
    );

    if (existingResponseIndex !== -1) {
      temp[existingResponseIndex].answer = ans;
    } else {
      temp.push({ question: qid, answer: ans });
    }
    console.log(temp);
    setResponses(temp);
    setClickedIndex(index);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col items-center justify-center ">
      <div
        className="max-w-md w-full p-6 bg-white rounded-lg"
        style={{ height: "70%", width: "85%" }}
      >
        {/* {formatTime(timeLeft)} */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl text-background font-bold">QUIZ</h1>
          <div className="flex items-center text-sm text-background">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 10V5a1 1 0 012 0v4h3a1 1 0 010 2H9a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {formatTime(timeLeft)}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mb-6 h-1 w-full bg-bgGray ">
          <div
            className="h-1 bg-background "
            style={{ width: `${widthPercentage}%` }}
          ></div>
        </div>
        {/* {questions.length > 0 && questions.map((question) => */}
        {questions.length > 0 && (
          <Question
            question={questions[currentQuestion - 1]}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            onNext={handleNext}
            onPrev={handlePrev}
            handleClick={handleClick}
            clickedIndex={clickedIndex}
            responses={responses}
            onSave={onSave}
          />
        )}
        {/* )} */}
      </div>
    </div>
  );
};

export default page;
