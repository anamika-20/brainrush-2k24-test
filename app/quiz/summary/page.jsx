import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="max-w-md w-full p-6 bg-white rounded-lg"
        style={{ height: "70%", width: "80%" }}
      >
        <div className="flex justify-between items-center mb-4">
          {/* SVG of back arrow */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-background cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
              // onClick={() => handleBackClick()}
            >
              <path
                fillRule="evenodd"
                d="M7.707 4.293a1 1 0 010 1.414L5.414 8H18a1 1 0 110 2H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <h1 className="text-3xl text-background font-bold">QUIZ SUMMARY</h1>
          </div>
        </div>
        <div className="mb-6 h-1 w-full bg-bgGray">
          <div className="h-1 bg-background" style={{ width: "100%" }}></div>
        </div>
        {/* Unmarked */}
        <div className="border border-gray-300 p-2 rounded-lg mb-3">
          <div className="flex items-center mb-2">
            <div>
              <span className="px-2 py-1 mr-2 rounded-full bg-gray-700 text-white text-xs font-semibold">
                1
              </span>
            </div>
            <h2 className="text-lg font-semibold">Question</h2>
          </div>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-xs font-semibold">
                Unmarked
              </span>
              <p className="text-sm text-gray-600 ml-2">
                This question is unmarked
              </p>
            </div>
          </div>
        </div>
        {/* Review */}
        <div className="border border-gray-300 p-2 rounded-lg mb-3">
          <div className="flex items-center mb-2">
            <div>
              <span className="px-2 py-1 mr-2 rounded-full bg-gray-700 text-white text-xs font-semibold">
                1
              </span>
            </div>
            <h2 className="text-lg font-semibold">Question</h2>
          </div>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-xs font-semibold">
                Review
              </span>
              <p className="text-sm text-gray-600 ml-2">
                This question is marked for Review
              </p>
            </div>
          </div>
        </div>

        {/* Marked */}
        <div className="border border-gray-300 p-2 rounded-lg mb-3">
          <div className="flex items-center mb-2">
            <div>
              <span className="px-2 py-1 mr-2 rounded-full bg-gray-700 text-white text-xs font-semibold">
                1
              </span>
            </div>
            <h2 className="text-lg font-semibold">Question</h2>
          </div>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-xs font-semibold">
                Marked
              </span>
              <p className="text-sm text-gray-600 ml-2">
                This question is Marked
              </p>
            </div>
          </div>
        </div>
        <button className="flex items-center justify-center border border-background bg-background text-white py-2 px-4 rounded-md w-full mt-4 ">
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default page;
