import { useState, useEffect } from "react";

const Question = ({
  question,
  currentQuestion,
  totalQuestions,
  onNext,
  onPrev,
  handleClick,
  clickedIndex,
  responses,
  onSave,
}) => {
  const [response, setResponse] = useState(-1);
  useEffect(() => {
    const index = responses.findIndex(
      (response) => response.qid === question._id
    );
    if (index !== -1) {
      setResponse(responses[index].answer);
    } else {
      setResponse("");
    }
  }, [question, responses]);
  return (
    <>
      {/* Question and review section */}
      <div className="flex justify-between items-center text-background text-sm mb-4">
        <span>
          {currentQuestion} of {totalQuestions} Questions
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg font-medium mb-4 text-gray-800">
        {question.content}
      </h2>
      {/* Options */}
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleClick(question._id, option.text, index)} //add in responses
            className={`flex items-center justify-between border py-2 px-4 rounded-md w-full focus:outline-none 
          ${
            clickedIndex === index || response === option.text
              ? "border-background text-background"
              : "border-gray-300 text-gray-800"
          }
         `}
          >
            {option.text}
            {clickedIndex === index || response === option.text ? (
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
        {currentQuestion !== 1 && (
          <button
            onClick={onPrev}
            className="flex items-center justify-center border border-gray-300 py-2 px-4 rounded-md w-full"
            disabled={currentQuestion === 1}
          >
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
        )}
        {currentQuestion !== totalQuestions && (
          <button
            onClick={onNext}
            className="flex items-center justify-center border border-background bg-background text-white py-2 px-4 rounded-md w-full"
          >
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
        )}
      </div>
      {currentQuestion === totalQuestions && (
        <button
          onClick={onSave}
          className="flex items-center justify-center border border-background bg-background text-white py-2 px-4 rounded-md w-full mt-2"
        >
          Save and Submit
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
      )}
    </>
  );
};

export default Question;
