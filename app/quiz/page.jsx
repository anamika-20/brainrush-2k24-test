"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Loader from "@components/Loader/UniversalLoader";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const team = useSelector((state) => state.team.team);
  const [selectedTopics, setSelectedTopics] = useState({
    topic1: "",
    topic2: "",
    topic3: "",
  });
  const router = useRouter();
  const getAllQuizzes = async () => {
    try {
      setLoading(true);
      if (team?.quizTopics.length === 3) {
        const { data: quizData } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/${team?._id}`
        );
        if (quizData.success) {
          localStorage.setItem("startTime", quizData.startTime);
          const { data: questionData } = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/${team?._id}`
          );
          if (questionData.success) {
            localStorage.setItem(
              "questions",
              JSON.stringify(questionData.questions)
            );
            localStorage.setItem("responses", JSON.stringify([]));

            console.log(questionData.questions);
          } else {
            alert(data?.message);
          }
          router.push("quiz/questions");
        }
      } else {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz`
        );
        console.log(data);
        if (data.success) {
          setOptions(data.quizzes);
        } else {
          alert(data?.message);
        }
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllQuizzes();
    const startTime = localStorage.getItem("startTime");
    if (startTime) {
      router.push("/quiz/questions");
    }
  }, []);

  const handleSubmit = async () => {
    if (Object.values(selectedTopics).includes("")) {
      alert("Please select all the topics");
      return;
    }
    try {
      setLoading(true);
      const userResponse = confirm("Are you sure you want to start the quiz?");
      if (userResponse) {
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz`,
          { quizIds: Object.values(selectedTopics) }
        );
        console.log(data);
        if (data.success) {
          const { data: quizData } = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/${team?._id}`
          );
          console.log(quizData);
          if (quizData.success) {
            localStorage.setItem("startTime", quizData.startTime);
            const { data: questionData } = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/${team?._id}`
            );
            if (questionData.success) {
              localStorage.setItem(
                "questions",
                JSON.stringify(questionData.questions)
              );
              localStorage.setItem("responses", JSON.stringify([]));

              console.log(questionData.questions);
            } else {
              alert(data?.message);
            }
            router.push("quiz/questions");
          } else {
            alert(quizData?.message);
          }
        } else {
          alert(data?.message);
        }
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectChange = (event, topicKey) => {
    const value = event.target.value;
    setSelectedTopics((prevState) => ({
      ...prevState,
      [topicKey]: value,
    }));
  };

  const filterOptions = (exclude) => {
    return options.filter(
      (option) =>
        !Object.values(selectedTopics).includes(option._id) ||
        exclude.includes(option._id)
    );
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col mx-5 items-center justify-center ">
      <div
        className="max-w-md w-full p-6 bg-white rounded-lg"
        style={{ width: "90%", height: "700px" }}
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl text-background font-bold">Round-1</h1>
        </div>
        <div>
          <div className="mb-6 h-px w-full bg-bgGray ">
            <div
              className="h-px bg-background "
              style={{ width: "100%" }}
            ></div>
          </div>

          <h3 className="text-left text-background font-bold">
            CHOOSE TOPIC 1
          </h3>
          <div
            className="border-2 border-background rounded-md"
            style={{ padding: "9px", margin: "5px 0" }}
          >
            <select
              className="w-full py-3 bg-white-600 px-3 focus:outline-none font-bold rounded-md"
              name="topic1"
              value={selectedTopics.topic1}
              onChange={(e) => handleSelectChange(e, "topic1")}
            >
              <option value="">Select Topic 1</option>
              {filterOptions([selectedTopics.topic1]).map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
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
              className="w-full py-3 bg-white-600 px-3 focus:outline-none font-bold rounded-md"
              name="topic2"
              value={selectedTopics.topic2}
              onChange={(e) => handleSelectChange(e, "topic2")}
            >
              <option value="">Select Topic 2</option>
              {filterOptions([selectedTopics.topic2]).map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
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
              className="w-full py-3 bg-white-600 px-3 focus:outline-none font-bold rounded-md"
              name="topic3"
              value={selectedTopics.topic3}
              onChange={(e) => handleSelectChange(e, "topic3")}
            >
              <option value="">Select Topic 3</option>
              {filterOptions([selectedTopics.topic3]).map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="mt-15 flex items-center justify-center border border-background bg-background text-white py-2 px-4 rounded-md w-full mt-4"
          onClick={handleSubmit}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default page;
