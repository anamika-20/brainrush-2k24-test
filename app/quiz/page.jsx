"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@components/Button";
import axios from "axios";

const page = () => {
  const time = 60;
  const [timeLeft, setTimeLeft] = useState(time); // 30 minutes in seconds
  const widthPercentage = 100 - (timeLeft / time) * 100;
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const getAllQuizzes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz`
      );
      console.log(data);
      if (data.success) {
        setOptions(data.quizzes);
      } else {
        alert(data?.message);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllQuizzes();
  }, [])

  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleSelectChange = (event) => {
    console.log(event.target)
    setSelectedTopics([...selectedTopics, event.target.value])
  };

  const filterOptions = (exclude) => options.filter(option => !exclude.includes(option._id));

  return (
    <div className="flex flex-col mx-5 items-center justify-center ">
      <div
        className="max-w-md w-full p-6 bg-white rounded-lg"
        style={{ width: "90%", height: "700px" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl text-background font-bold">Round-1</h1>
        </div>
        <div>
          <div className="mb-6 h-1 w-full bg-bgGray ">
            <div className="h-1 bg-background " style={{ width: "100%" }}></div>
          </div>

          <h3 className="text-left text-background font-bold">
            CHOOSE TOPIC 1
          </h3>
          <div
            className="border-2 border-background rounded-md"
            style={{ padding: "9px", margin: "5px 0" }}
          >
            <select
              className="w-full py-3 bg-white-600 px-3 font-bold rounded-md"
              name="topic1"
              value={selectedTopics.topic1}
              onChange={(e) => handleSelectChange(e, "topic1")}
            >
              <option value="">Select Topic 1</option>
              {filterOptions([
                selectedTopics[1],
                selectedTopics[2],
              ]).map((option) => (
                <option key={option?._id} value={option?._id}>
                  {option?.title}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-left text-background font-bold">
            CHOOSE TOPIC 2
          </h3>
          <div
            className="border-2 border-background rounded-md"
            style={{ padding: "9px", margin: "5px 0" }}
          >
            <select
              className="w-full py-3 bg-white-600 px-3 font-bold rounded-md"
              name="topic2"
              value={selectedTopics.topic2}
              onChange={(e) => handleSelectChange(e, "topic2")}
            >
              <option value="">Select Topic 2</option>
              {filterOptions([
                selectedTopics[0],
                selectedTopics[2],
              ]).map((option) => (
                <option key={option?._id} value={option?._id}>
                  {option?.title}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-left  text-background font-bold">
            CHOOSE TOPIC 3
          </h3>
          <div
            className="border-2 border-background rounded-md"
            style={{ padding: "9px", margin: "5px 0" }}
          >
            <select
              className="w-full py-3 bg-white-600 px-3 font-bold rounded-md"
              name="topic3"
              value={selectedTopics.topic3}
              onChange={(e) => handleSelectChange(e, "topic3")}
            >
              <option value="">Select Topic 3</option>
              {filterOptions([
                selectedTopics[0],
                selectedTopics[1],
              ]).map((option) => (
                <option key={option?._id} value={option?._id}>
                  {option?.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="mt-15 flex items-center justify-center border border-background bg-background text-white py-2 px-4 rounded-md w-full mt-4 "
          onClick={() => {
            router.push("/questions");
          }}
        >
          SUBMIT
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default page;
