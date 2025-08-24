"use client";
import React, { useEffect, useState } from "react";

export default function OptionMaker({ countryId, serviceId }) {
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  // { questionId: [optionId1, optionId2] }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Build query params dynamically
        const queryParams = new URLSearchParams();
        if (countryId) queryParams.append("countryId", countryId);
        if (serviceId) queryParams.append("serviceId", serviceId);

        const res = await fetch(`http://localhost:5000/seed?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(data.data || []);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, [countryId, serviceId]);

  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
      } else {
        return { ...prev, [questionId]: [...current, optionId] };
      }
    });
  };

  return (
    <div className="space-y-4">
      {questions?.map((q) => (
        <div key={q._id} className="p-4 border rounded">
          <h3 className="font-semibold mb-2">{q.title}</h3>
          <div className="flex flex-col space-y-1">
            {q.options.map((opt) => (
              <label key={opt._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedOptions[q._id]?.includes(opt._id) || false}
                  onChange={() => handleOptionChange(q._id, opt._id)}
                />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Debug / Preview of selected options */}
      <pre>{JSON.stringify(selectedOptions, null, 2)}</pre>
    </div>
  );
}
