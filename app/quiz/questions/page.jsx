"use client";
import Loader from "@components/Loader/UniversalLoader";
import Question from "@components/Question";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const page = () => {
  const time = 1800;
  const [timeLeft, setTimeLeft] = useState(time); // 30 minutes in seconds
  const widthPercentage = 100 - (timeLeft / time) * 100;
  const [clickedIndex, setClickedIndex] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState([])
  const team = useSelector((state) => state.team.team);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([])


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getAllQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/${team?._id}`
      );
      if (data.success) {
        setQuestions(data.questions);
        setTimeLeft(1800);
      } else {
        alert(data?.message);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (team)
      getAllQuestions();
  }, [team])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleNext = () => {
    setClickedIndex(null);
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    setClickedIndex(null);
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleClick = (qid, ans, index) => {
    const existingResponseIndex = responses.findIndex(response => response.questionId === questionId);

    if (existingResponseIndex !== -1) {
      responses[existingResponseIndex].buttonText = buttonText;
    } else {
      responses.push({ questionId, buttonText });
    }
    setClickedIndex(index);
  };

  return (
    loading ? <Loader /> :
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
          {questions.length > 0 &&
            <Question question={questions[currentQuestion - 1]} currentQuestion={currentQuestion} totalQuestions={30} onNext={handleNext} onPrev={handlePrev} handleClick={handleClick} clickedIndex={clickedIndex} />}
          {/* )} */}
        </div>
      </div>
  );
};

export default page;
