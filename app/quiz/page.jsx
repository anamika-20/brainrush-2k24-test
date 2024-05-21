"use client";
import React, { useEffect, useState } from "react";

const page = () => {
  const time = 60;
  const [timeLeft, setTimeLeft] = useState(time); // 30 minutes in seconds
  const widthPercentage = 100 - (timeLeft / time) * 100;

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleClick = (index) => {
    setClickedIndex(index);
  };

  const buttons = ["Paris", "Madrid", "Berlin", "Rome"];
  return (
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
        {/* Question and review section */}
        <div className="flex justify-between items-center text-background text-sm mb-4">
          <span>1 of 25 Questions</span>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 accent-background"
              style={{
                width: "16px",
                height: "16px",
              }}
            />
            Mark for Review
          </label>
        </div>

        {/* Question */}
        <h2 className="text-lg font-medium mb-4 text-gray-800">
          What is the capital of France?What is the capital of France?What is
          the capital of France?What is the capital of France?What is the
          capital of France?What is the capital of France?What is the capital of
          France?
        </h2>
        {/* Options */}
        <div className="grid grid-cols-1 gap-4">
          {buttons.map((city, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`flex items-center justify-between border py-2 px-4 rounded-md w-full focus:outline-none 
      ${
        clickedIndex === index
          ? "border-background text-background"
          : "border-gray-300 text-gray-800"
      }
     `}
            >
              {city}
              {clickedIndex === index ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="10"
                    fill="currentColor"
                    className="text-background"
                  />
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414-1.414L7 12.586 4.707 10.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l9-9z"
                    clipRule="evenodd"
                    className="text-white"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="10" cy="10" r="9" />
                </svg>
              )}
            </button>
          ))}
        </div>
        {/* Navigation buttons */}
        <div className="flex justify-between mt-[22px]  space-x-4">
          <button className="flex items-center justify-center border border-gray-300 py-2 px-4 rounded-md w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 4.293a1 1 0 010 1.414L5.414 8H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </button>
          <button className="flex items-center justify-center border border-background bg-background text-white py-2 px-4 rounded-md w-full">
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 15.707a1 1 0 010-1.414L14.586 12H5a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
