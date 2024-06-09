import React, { useEffect, useState } from "react";

const InterestCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyInterest, setMonthlyInterest] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [loanPeriod, setLoanPeriod] = useState("");
  const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [displayLoanAmount, setDisplayLoanAmount] = useState("");
  const [displayMonthlyInterest, setDisplayMonthlyInterest] = useState("");
  const predefinedAmounts = [
    500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000,
    4500000, 5000000, 5500000, 6000000,
  ];
  const predefinedInterests = [30000, 40000, 50000, 60000];

  useEffect(() => {
    if (loanAmount) {
      const formattedAmount = Number(loanAmount).toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      setDisplayLoanAmount(formattedAmount);
    } else {
      setDisplayLoanAmount("");
    }
  }, [loanAmount]);

  useEffect(() => {
    if (monthlyInterest) {
      const formattedInterest = Number(monthlyInterest).toLocaleString(
        "vi-VN",
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }
      );
      setDisplayMonthlyInterest(formattedInterest);
    } else {
      setDisplayMonthlyInterest("");
    }
  }, [monthlyInterest]);

  const calculateInterest = () => {
    if (!loanAmount || !monthlyInterest || !startDate || !endDate) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedMonthlyInterest = parseFloat(monthlyInterest);

    if (isNaN(parsedLoanAmount) || isNaN(parsedMonthlyInterest)) {
      alert("Số tiền vay và tiền lãi phải là số hợp lệ!");
      return;
    }
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

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = (days % 365) % 30;

    let periodText = "";
    if (years > 0) periodText += `${years} năm `;
    if (months > 0) periodText += `${months} tháng `;
    if (remainingDays > 0 || (years === 0 && months === 0)) {
      periodText += `${remainingDays} ngày`;
    }

    setLoanPeriod(periodText.trim());
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setLoanAmount(value);
    setIsAmountModalOpen(false);
  };

  const handleAmountSelect = (amount) => {
    handleAmountChange({ target: { value: amount.toString() } });
    setIsAmountModalOpen(false);
  };

  const handleInterestChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setMonthlyInterest(value);
    setIsInterestModalOpen(false);
  };
  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate > getCurrentDate()) {
      alert("Ngày mượn không được lớn hơn ngày hiện tại!");
      return;
    }
    setStartDate(selectedDate);
  };
  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate <= startDate) {
      alert("Ngày trả phải lớn hơn ngày mượn!");
      return;
    }
    setEndDate(selectedDate);
  };
  const handleInterestSelect = (interest) => {
    handleInterestChange({ target: { value: interest.toString() } });
    setIsInterestModalOpen(false);
  };

  const resetForm = () => {
    setLoanAmount("");
    setStartDate("");
    setEndDate("");
    setMonthlyInterest("");
    setTotalAmount(null);
    setLoanPeriod("");
    setDisplayLoanAmount("");
    setDisplayMonthlyInterest("");
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="mb-4 flex items-center">
        <label className="block mb-2 mr-2">SỐ TIỀN MƯỢN:</label>
        <div className="flex-grow relative">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={displayLoanAmount}
            onChange={handleAmountChange}
          />
          {isAmountModalOpen && (
            <div className="absolute z-10 -left-24 w-[350px] bg-white shadow-lg rounded-lg p-6 mt-2 border border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-200 text-sm"
                    onClick={() => handleAmountSelect(amount)}
                  >
                    {amount.toLocaleString("vi-VN")}đ
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="ml-2 p-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setIsAmountModalOpen(!isAmountModalOpen)}
        >
          Chọn mốc tiền
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">NGÀY MƯỢN:</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          max={getCurrentDate()}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">NGÀY TRẢ TIỀN:</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate ? new Date(startDate).toISOString().split("T")[0] : ""}
        />
      </div>
      <div className="mb-4 flex items-center">
        <label className="block mb-2 mr-2">TIỀN LÃI 1 THÁNG:</label>
        <div className="flex-grow relative">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={displayMonthlyInterest}
            onChange={handleInterestChange}
          />
          {isInterestModalOpen && (
            <div className="absolute -left-20 z-10 w-[300px] bg-white shadow-lg rounded-lg p-2 mt-2 border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                {predefinedInterests.map((interest) => (
                  <button
                    key={interest}
                    className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-200 text-sm"
                    onClick={() => handleInterestSelect(interest)}
                  >
                    {interest.toLocaleString("vi-VN")}đ
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="ml-2 p-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setIsInterestModalOpen(!isInterestModalOpen)}
        >
          Chọn mốc lãi
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          className="flex-1 bg-blue-500 text-white p-2 rounded"
          onClick={calculateInterest}
        >
          TÍNH TIỀN
        </button>
        <button
          className="flex-1 bg-gray-500 text-white p-2 rounded"
          onClick={resetForm}
        >
          LÀM MỚI
        </button>
      </div>
      {totalAmount && (
        <div className="mt-4 p-2 bg-green-100 border rounded">
          <p className="text-2xl mb-2">Thời gian vay: {loanPeriod}</p>
          <h3 className="text-4xl font-semibold mb-2">
            TỔNG TIỀN : {totalAmount}
          </h3>
        </div>
      )}
    </div>
  );
};

export default InterestCalculator;
