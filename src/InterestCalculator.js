import React, { useState } from "react";

const InterestCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyInterest, setMonthlyInterest] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [loanPeriod, setLoanPeriod] = useState("");

  const calculateInterest = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const dailyInterest = monthlyInterest / 30;
    const interest = dailyInterest * days;
    const total = Math.round(parseFloat(loanAmount) + interest);
    setTotalAmount(
      total.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );

    // Tính toán thời gian vay
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = (days % 365) % 30;

    let periodText = "";
    if (years > 0) {
      periodText += `${years} năm `;
    }
    if (months > 0) {
      periodText += `${months} tháng `;
    }
    if (remainingDays > 0 || (years === 0 && months === 0)) {
      periodText += `${remainingDays} ngày`;
    }

    setLoanPeriod(periodText.trim());
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="mb-4">
        <label className="block mb-2">SỐ TIỀN MƯỢN:</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">NGÀY MƯỢN:</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">NGÀY TRẢ TIỀN:</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">TIỀN LÃI 1 THÁNG:</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={monthlyInterest}
          onChange={(e) => setMonthlyInterest(e.target.value)}
        />
      </div>
      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        onClick={calculateInterest}
      >
        TÍNH TIỀN
      </button>
      {totalAmount && (
        <div className="mt-4 p-2 bg-green-100 border rounded">
          <p className="text-2xl mb-2">Tổng gian vay: {loanPeriod}</p>
          <h3 className="text-4xl font-semibold mb-2">
            TỔNG TIỀN : {totalAmount}
          </h3>
        </div>
      )}
    </div>
  );
};

export default InterestCalculator;
