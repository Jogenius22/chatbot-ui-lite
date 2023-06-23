import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
// import { Formik, Field, Form } from "formik";
import { OpenAIModel } from "@/types";
import React from "react";

const AdminPage = () => {
  const router = useRouter();

  const [model, setModel] = useState<string>("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState<number>(0.5);
  const [maxResponseLength, setMaxResponseLength] = useState<number>(200);
  const [prompt, setPrompt] = useState<string>("You are an AI Assistant");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const data = { model, temperature, maxTokens: maxResponseLength, prompt };
      await axios.post("/api/set", data);
      setSuccessMessage("Configuration updated successfully");
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxResponseLengthBlur = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (value < 50) {
      setMaxResponseLength(50);
    } else if (value > 2048) {
      setMaxResponseLength(2048);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Chatbot Configuration</h2>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Model:</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as OpenAIModel)}
                    className="input input-bordered"
                  >
                    <option value={OpenAIModel.DAVINCI_TURBO}>
                      gpt-3.5-turbo
                    </option>
                    <option value={OpenAIModel.GPT_4}>gpt-4</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">
                    Temperature: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="slider slider-horizontal"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">
                    Maximum Response Length:
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="2048"
                    value={maxResponseLength}
                    onChange={(e) =>
                      setMaxResponseLength(parseInt(e.target.value))
                    }
                    onBlur={handleMaxResponseLengthBlur}
                    className="input input-bordered"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Prompt:</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input input-bordered h-24"
                  ></textarea>
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex justify-center items-center w-full bg-blue-500 text-white px-4 py-3 rounded-md focus:outline-none"
                >
                  {isLoading ? "Setting..." : "Set"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 mt-2">{successMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
