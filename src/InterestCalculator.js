import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";

registerLocale("vi", vi);

const InterestCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalInterestAmount, setTotalInterestAmount] = useState(null);
  const [loanPeriod, setLoanPeriod] = useState("");
  const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [displayLoanAmount, setDisplayLoanAmount] = useState("");
  const [displayMonthlyInterestRate, setDisplayMonthlyInterestRate] =
    useState("");
  const predefinedAmounts = [
    500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000,
    4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000,
    8500000, 9000000, 9500000, 10000000, 10500000,
  ];
  const predefinedInterestRates = [4, 5, 6];

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
    if (monthlyInterestRate) {
      setDisplayMonthlyInterestRate(monthlyInterestRate);
    } else {
      setDisplayMonthlyInterestRate("");
    }
  }, [monthlyInterestRate]);

  const calculateInterest = () => {
    if (!loanAmount || !monthlyInterestRate || !startDate || !endDate) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedMonthlyInterestRate = parseFloat(monthlyInterestRate) / 100;

    if (isNaN(parsedLoanAmount) || isNaN(parsedMonthlyInterestRate)) {
      alert("Số tiền vay và lãi suất phải là số hợp lệ!");
      return;
    }

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const monthlyInterest = parsedLoanAmount * parsedMonthlyInterestRate;
    const dailyInterest = monthlyInterest / 30;
    const totalInterest = dailyInterest * days;

    const total = Math.round(parsedLoanAmount + totalInterest);
    setTotalAmount(
      total.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );

    setTotalInterestAmount(
      Math.round(totalInterest).toLocaleString("vi-VN", {
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

  const handleInterestRateChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setMonthlyInterestRate(value);
    setIsInterestModalOpen(false);
  };

  const handleInterestRateSelect = (rate) => {
    handleInterestRateChange({ target: { value: rate.toString() } });
    setIsInterestModalOpen(false);
  };

  const resetForm = () => {
    setLoanAmount("");
    setStartDate(null);
    setEndDate(null);
    setMonthlyInterestRate("");
    setTotalAmount(null);
    setTotalInterestAmount(null);
    setLoanPeriod("");
    setDisplayLoanAmount("");
    setDisplayMonthlyInterestRate("");
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
            placeholder="Ví dụ: 1000000"
          />
          {isAmountModalOpen && (
            <div className="absolute z-10 -left-24 w-[350px] bg-white shadow-lg rounded-lg p-6 mt-2 border border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    className="p-3 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200 text-sm"
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
          className="ml-2 p-1 bg-blue-200 rounded hover:bg-blue-300"
          onClick={() => setIsAmountModalOpen(!isAmountModalOpen)}
        >
          Chọn mốc tiền
        </button>
      </div>
      <div className="mb-4 flex">
        <label className="block mb-2 text-start">NGÀY MƯỢN:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          locale="vi"
          className="w-full p-2 border rounded bg-blue-200"
          placeholderText="dd/mm/yyyy"
        />
      </div>
      <div className="mb-4 flex">
        <label className="block mb-2 text-start">NGÀY TRẢ TIỀN:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd/MM/yyyy"
          locale="vi"
          className="w-full p-2 border rounded bg-blue-200"
          placeholderText="dd/mm/yyyy"
        />
      </div>
      <div className="mb-4 flex items-center">
        <label className="block mb-2 mr-2">LÃI SUẤT 1 THÁNG:</label>
        <div className="flex-grow relative">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={displayMonthlyInterestRate}
            onChange={handleInterestRateChange}
            placeholder="Ví dụ: 40.000 đ"
          />
          {isInterestModalOpen && (
            <div className="absolute -left-20 z-10 w-[300px] bg-white shadow-lg rounded-lg p-2 mt-2 border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                {predefinedInterestRates.map((rate) => (
                  <button
                    key={rate}
                    className="p-3 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200 text-sm"
                    onClick={() => handleInterestRateSelect(rate)}
                  >
                    {rate}0.000 đ
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="ml-2 p-1 bg-blue-200 rounded hover:bg-blue-300"
          onClick={() => setIsInterestModalOpen(!isInterestModalOpen)}
        >
          Chọn lãi suất
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          className="flex-1 bg-green-500 text-white p-2 rounded"
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
        <div className="mt-4 p-2 bg-green-100 border rounded text-start font-semibold">
          <p className="text-2xl mb-2">Thời gian vay: {loanPeriod}</p>
          <p className="text-2xl mb-2">Tổng tiền lãi: {totalInterestAmount}</p>
          <h3 className="text-4xl mb-2">TỔNG TIỀN: {totalAmount}</h3>
        </div>
      )}
    </div>
  );
};

export default InterestCalculator;
