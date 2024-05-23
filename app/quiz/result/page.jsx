"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import "./results.css";
import { Preahvihear } from "next/font/google";
import axios from "axios";
import Loader from "@components/Loader/Loader";

const preahvihear = Preahvihear({
  subsets: ["latin"],
  weight: ["400"],
});

const AllTeams = () => {
  const [teams, setTeams] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [notSelected, setNotSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTeams = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/results`
      );

      setTeams(data.sortedResults);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getTeams();
  }, [pageNum, notSelected]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto mx-4 md:mx-20 rounded-md">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y table-fixed text-sm text-left text-white">
                <thead className="h-20 text-xs text-white uppercase border-2 border-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 ">
                      <span className={preahvihear.className}>Rank</span>
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      <span className={preahvihear.className}>Team Name</span>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className={preahvihear.className}>Team Leader</span>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className={preahvihear.className}>Score</span>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className={preahvihear.className}>Time</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teams &&
                    teams.map((team, index) => (
                      <tr className="border-b" key={team._id}>
                        <td
                          scope="row"
                          className="px-6 py-4 font-medium text-white whitespace-nowrap"
                        >
                          <span className={preahvihear.className}>
                            {index + 1}
                          </span>
                        </td>
                        <td
                          scope="row"
                          className="px-6 py-4 font-medium text-white whitespace-nowrap"
                        >
                          <span className={preahvihear.className}>
                            {team?.teamName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          <span className="text-white">
                            <span className={preahvihear.className}>
                              {team?.teamLeader}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          <span className="text-white">
                            <span className={preahvihear.className}>
                              {team?.score}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 ">
                          <span className="text-white">
                            <span className={preahvihear.className}>
                              {Math.floor(team?.time / 60) +
                                ":" +
                                (team?.time % 60 < 10 ? "0" : "") +
                                (team?.time % 60)}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllTeams;
