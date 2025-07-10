"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);

  const handlerequest = () => {
    alert("Request to join the project has been sent!");
  };

  useEffect(() => {
    const fetchStaticProjects = async () => {
      const projectTitles = [
        "E-Learning Platform",
        "Fitness Tracking App",
        "Project Management Tool",
        "Blockchain Wallet",
        "Social Network",
        "IoT Dashboard",
        "Video Streaming App",
        "AR Navigation",
        "Game Development",
        "ML Image Processing",
        "DevOps Pipeline",
      ];

      try {
        const images = await Promise.all(
          projectTitles.map(async (title) => {
            const res = await axios.get(
              "https://api.unsplash.com/search/photos",
              {
                params: { query: title, per_page: 1 },
                headers: {
                  Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
                },
              }
            );
            return res.data.results[0]?.urls?.regular || "";
          })
        );

        const staticProjects = projectTitles.map((title, index) => ({
          title,
          description: `This is a project about ${title.toLowerCase()}.`,
          skillsNeeded: ["React", "API", "Tailwind"],
          thumbnail: images[index],
        }));

        setProjects(staticProjects);
      } catch (err) {
        console.error("Failed to fetch Unsplash images:", err);
      }
    };

    const fetchUserProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (res.ok && data?.data) {
          setUserProjects(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user projects:", err);
      }
    };

    fetchStaticProjects();
    fetchUserProjects();
  }, []);

  const renderCard = (project, index, isUser = false) => (
    <div key={index} className="m-4">
      <div
        className="relative flex flex-col justify-end text-white shadow-md bg-cover bg-center rounded-xl w-96 h-72"
        style={{
          backgroundImage: `url(${
            isUser ? project.image || "/default.jpg" : project.thumbnail
          })`,
        }}
      >
        <div className="bg-black bg-opacity-60 p-4 rounded-b-xl">
          <h5 className="text-xl font-semibold">{project.title}</h5>
          <p className="text-sm text-gray-300">
            {project.description?.split(" ").slice(0, 12).join(" ") +
              (project.description?.split(" ").length > 12 ? "..." : "")}
          </p>
          <div className="mt-2 text-sm">
            <span className="font-semibold">Tech Stack:</span>{" "}
            {(isUser
              ? project.techStack?.join(", ")
              : project.skillsNeeded?.join(", ")) || "N/A"}
          </div>
          <button
            onClick={handlerequest}
            className="mt-3 py-2 px-4 text-xs font-bold uppercase text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all"
          >
            Request to join
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center">
      {projects.map((p, i) => renderCard(p, i))}
      {userProjects.map((p, i) => renderCard(p, i + projects.length, true))}
    </div>
  );
}

export default Projects;
