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
    const [limit, setLimit] = useState(0);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");
    const [notSelected, setNotSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    const getTeams = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/team/all?search=${search}&page=${pageNum}&selected=${notSelected}`
            );
            // const data = await response.json();
            setTeams(data.teams);
            setLimit(data.limit);
            setCount(data.count);
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
                <div
                    className="overflow-x-auto mx-4 md:mx-20 rounded-md"
                >
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <table className="min-w-full divide-y table-fixed text-sm text-left text-white">
                                <thead
                                    className="h-20 text-xs text-white uppercase border-2 border-white"
                                >
                                    <tr>
                                        <th scope="col" className="px-6 py-3 ">
                                            <span className={preahvihear.className}>Team Name</span>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className={preahvihear.className}>
                                                Team Leader
                                            </span>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className={preahvihear.className}>
                                                Score
                                            </span>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className={preahvihear.className}>
                                                Time
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teams &&
                                        teams.map((team) => (
                                            <tr className="border-b" key={team._id}>
                                                <td
                                                    scope="row"
                                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                >
                                                    <span className={preahvihear.className}>
                                                        {team.teamName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    <span className="text-gray-900">
                                                        <span className={preahvihear.className}>
                                                            {team.leader.name}
                                                        </span>
                                                    </span>
                                                    <br />
                                                    <span className={preahvihear.className}>
                                                        {team.leader.email}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    <span className="text-gray-900">
                                                        <span className={preahvihear.className}>
                                                            {team?.teamMember?.name
                                                                ? team.teamMember.name
                                                                : "Not Selected"}
                                                        </span>
                                                    </span>
                                                    <br />
                                                    <span className={preahvihear.className}>
                                                        {team?.teamMember?.name
                                                            ? team.teamMember.email
                                                            : ""}
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
