import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const FILTERS = ["1M", "3M", "6M", "1Y", "YTD", "ALL"];

const InvestorPortfolioGraph = () => {
  const [activeFilter, setActiveFilter] = useState("1Y");

  // Fake data for demo — you can replace with backend API values
  const dataSets = {
    "1M": [195, 197, 198, 199, 200],
    "3M": [188, 190, 193, 195, 198, 200],
    "6M": [180, 184, 188, 191, 195, 198, 200],
    "1Y": [
      175, 178, 182, 185, 188, 187, 189, 191, 188, 190, 193, 195, 192, 194, 196,
      197, 193, 195, 198, 200,
    ],
    YTD: [180, 183, 187, 189, 192, 195, 197, 200],
    ALL: [120, 135, 150, 165, 175, 185, 193, 200],
  };

  const categories = {
    "1M": ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    "3M": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "6M": ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "1Y": [
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    YTD: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    ALL: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
  };

  const series = [
    {
      name: "Portfolio Value",
      data: dataSets[activeFilter],
    },
  ];

  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: {
        // Add this to disable any shadow
        enabled: false,
      },
    },

    dataLabels: { enabled: false },

    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#3BF695"],
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        gradientToColors: ["rgba(59, 246, 149, 0.1)", "rgba(59, 246, 149, 0)"],
        opacityFrom: 0.2, // Start opacity
        opacityTo: 0, // End opacity
        stops: [0, 100],
      },
    },

    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },

    xaxis: {
      categories: categories[activeFilter],
      labels: {
        style: { fontSize: "12px", colors: "#6b7280" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      opposite: true,
      labels: {
        style: { colors: "#6b7280" },
        formatter: (value) => `$${value}M`,
      },
    },

    tooltip: {
      theme: "light",
      y: { formatter: (value) => `$${value}M` },
    },
  };

  return (
    <div className="bg-white p-[40px]  w-full !border-b border-[#E5E5EA] ">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-['Atacama_Trial_VAR'] text-[24px] font-normal leading-[120%] text-[#0A0A0A]">
          Portfolio Performance
        </h2>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`
                px-3 py-1 rounded-md text-sm
                ${
                  activeFilter === f
                    ? "bg-gradient-to-r from-purple-600 via-blue-500 to-blue-600 text-white"
                    : "text-[#000] text-center font-['Montserrat'] text-[13px] font-semibold leading-[150%]"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <hr className="mb-6" />

      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default InvestorPortfolioGraph;
