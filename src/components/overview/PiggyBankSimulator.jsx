import { useState } from 'react';

function PiggyBankSimulator() {
  const [savingMode, setSavingMode] = useState('flexible');
  const [formulaType, setFormulaType] = useState('linear');
  const [monthlyIncome, setMonthlyIncome] = useState(20000000); // 20 triệu VNĐ
  const [spendingRatio, setSpendingRatio] = useState(0.6); // 60% thu nhập
  const [spending, setSpending] = useState(150000);
  const [minSaving, setMinSaving] = useState(10000);
  const [maxSaving, setMaxSaving] = useState(70000);
  const [fixedAmount, setFixedAmount] = useState(50000);
  const [sensitivityK, setSensitivityK] = useState(1); // Hệ số k cho công thức mũ
  const [simulationResult, setSimulationResult] = useState('Kết quả mô phỏng sẽ xuất hiện ở đây...');
  const [dailyAvgSpending, setDailyAvgSpending] = useState(0);
  
  // Biến cho cảnh báo vượt mức chi tiêu
  const [isOverspending, setIsOverspending] = useState(false);
  const [overspendingAmount, setOverspendingAmount] = useState(0);
  const [overspendingPercent, setOverspendingPercent] = useState(0);
  const [showRebalancePlan, setShowRebalancePlan] = useState(false);
  const [pauseSavingToday, setPauseSavingToday] = useState(false);
  
  // Biến cho tính toán cân bằng lại
  const [currentDay, setCurrentDay] = useState(10); // Mặc định ngày 10 trong tháng
  const [daysInMonth, setDaysInMonth] = useState(30); // Mặc định 30 ngày/tháng
  const [totalSpentSoFar, setTotalSpentSoFar] = useState(6000000); // Mặc định đã tiêu 6 triệu
  const [monthlySavingTarget, setMonthlySavingTarget] = useState(3000000); // Mục tiêu tiết kiệm 3 triệu/tháng
  const [savedSoFar, setSavedSoFar] = useState(1000000); // Đã tiết kiệm 1 triệu
  const [safeSpendingThreshold, setSafeSpendingThreshold] = useState(1.1); // Hệ số α = 1.1

  const handleModeChange = (e) => {
    setSavingMode(e.target.value);
  };

  // Tính toán chi tiêu trung bình hàng ngày dựa trên thu nhập tháng và tỉ lệ chi tiêu
  const calculateDailyAvgSpending = () => {
    return (monthlyIncome / daysInMonth) * spendingRatio;
  };
  
  // Kiểm tra xem có vượt mức chi tiêu an toàn không
  const checkOverspending = (dailySpending, avgDailySpending) => {
    // Tính ngưỡng an toàn với hệ số α
    const safeThreshold = avgDailySpending * safeSpendingThreshold;
    
    // Kiểm tra có vượt ngưỡng không
    if (dailySpending > safeThreshold) {
      const overAmount = dailySpending - avgDailySpending;
      const overPercent = (overAmount / avgDailySpending) * 100;
      
      return {
        isOver: true,
        amount: overAmount,
        percent: overPercent
      };
    }
    
    return {
      isOver: false,
      amount: 0,
      percent: 0
    };
  };
  
  // Tính toán kế hoạch cân bằng lại cho các ngày còn lại
  const calculateRebalancePlan = () => {
    // Bước 1: Tính ngân sách cho chi tiêu sau khi trừ tiết kiệm
    const budgetForSpending = monthlyIncome - monthlySavingTarget;
    
    // Bước 2: Tính ngân sách còn lại cho cả tháng
    const remainingSpendBudget = budgetForSpending - totalSpentSoFar;
    
    // Bước 3: Tính số ngày còn lại trong tháng
    const remainingDays = daysInMonth - currentDay;
    
    // Bước 4: Tính chi tiêu hợp lý trung bình cho các ngày còn lại
    let targetDailySpending = remainingSpendBudget / remainingDays;
    
    // Đặt mức tối thiểu cho chi tiêu hàng ngày (70% chi tiêu trung bình)
    const minDailySpending = calculateDailyAvgSpending() * 0.7;
    targetDailySpending = Math.max(targetDailySpending, minDailySpending);
    
    // Kiểm tra xem có vượt tổng ngân sách không
    const isBudgetExceeded = remainingSpendBudget < 0;
    
    // Tính toán số tiết kiệm còn thiếu
    const savingDeficit = isBudgetExceeded ? Math.abs(remainingSpendBudget) : 0;
    
    return {
      targetDailySpending,
      remainingDays,
      remainingBudget: remainingSpendBudget,
      isBudgetExceeded,
      savingDeficit
    };
  };

  // Tính toán số tiền tiết kiệm theo công thức tuyến tính
  const calculateLinearSaving = (dailySpending, avgSpending) => {
    const epsilon = 0.01; // Hằng số nhỏ để tránh chia cho 0
    let saving = minSaving + (maxSaving - minSaving) * (1 - dailySpending / (avgSpending + epsilon));
    return Math.max(minSaving, Math.min(maxSaving, saving));
  };

  // Tính toán số tiền tiết kiệm theo công thức mũ
  const calculateExponentialSaving = (dailySpending, avgSpending) => {
    const epsilon = 0.01; // Hằng số nhỏ để tránh chia cho 0
    let saving = minSaving + (maxSaving - minSaving) * Math.exp(-sensitivityK * dailySpending / (avgSpending + epsilon));
    return Math.max(minSaving, Math.min(maxSaving, saving));
  };

  const runSimulation = (e) => {
    e.preventDefault();
    
    // Tính chi tiêu trung bình hàng ngày
    const avgSpending = calculateDailyAvgSpending();
    setDailyAvgSpending(avgSpending);
    
    // Kiểm tra vượt mức chi tiêu
    const overspendCheck = checkOverspending(spending, avgSpending);
    setIsOverspending(overspendCheck.isOver);
    setOverspendingAmount(overspendCheck.amount);
    setOverspendingPercent(overspendCheck.percent);
    
    // Cập nhật tổng chi tiêu đến hiện tại (giả lập thêm chi tiêu hôm nay)
    setTotalSpentSoFar(prev => prev + spending);
    
    // Tính toán kế hoạch cân bằng
    const rebalancePlan = calculateRebalancePlan();
    
    if (savingMode === 'fixed') {
      const amountString = fixedAmount.toLocaleString('vi-VN') + ' VNĐ';
      
      if (overspendCheck.isOver) {
        // Hiển thị cảnh báo vượt mức và gợi ý tạm dừng tiết kiệm
        setSimulationResult(generateOverspendingWarning(overspendCheck, avgSpending, rebalancePlan, 0));
      } else {
        setSimulationResult(`Gợi ý: Bạn đã đặt mục tiêu cố định. Hãy bỏ vào heo <strong>${amountString}</strong> như đã định! Kỷ luật là sức mạnh.`);
      }
    } else {
      if (minSaving >= maxSaving) {
        setSimulationResult('Lỗi: Số tiền Tối thiểu phải nhỏ hơn Tối đa.');
        return;
      }
      
      // Tính toán số tiền tiết kiệm dựa trên công thức đã chọn
      let suggestion = 0;
      
      if (overspendCheck.isOver && !pauseSavingToday) {
        // Nếu vượt mức chi tiêu và chưa tạm dừng tiết kiệm
        suggestion = minSaving; // Gợi ý tiết kiệm tối thiểu
        
        // Hiển thị cảnh báo vượt mức
        setSimulationResult(generateOverspendingWarning(overspendCheck, avgSpending, rebalancePlan, suggestion));
        return;
      } else if (overspendCheck.isOver && pauseSavingToday) {
        // Nếu vượt mức chi tiêu và đã tạm dừng tiết kiệm
        suggestion = 0;
      } else {
        // Tính toán bình thường nếu không vượt mức
        if (formulaType === 'linear') {
          suggestion = calculateLinearSaving(spending, avgSpending);
        } else { // exponential
          suggestion = calculateExponentialSaving(spending, avgSpending);
        }
      }
      
      // Làm tròn số tiền
      suggestion = Math.round(suggestion / 1000) * 1000;
      
      const amountString = suggestion.toLocaleString('vi-VN') + ' VNĐ';
      const spendingString = spending.toLocaleString('vi-VN') + ' VNĐ';
      const avgSpendingString = Math.round(avgSpending).toLocaleString('vi-VN') + ' VNĐ';

      // Nếu không có cảnh báo vượt mức hoặc đã tạm dừng tiết kiệm
      if (!overspendCheck.isOver || pauseSavingToday) {
        let resultHTML = `<div class="text-left">
          <p class="font-bold mb-2">FinGenie AI phân tích:</p>
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li>Thu nhập tháng: ${monthlyIncome.toLocaleString('vi-VN')} VNĐ</li>
            <li>Chi tiêu trung bình/ngày: ${avgSpendingString}</li>
            <li>Chi tiêu hôm nay: ${spendingString}</li>
          </ul>`;
          
        if (pauseSavingToday) {
          resultHTML += `<div class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p class="text-yellow-800 font-medium">Bạn đã tạm dừng tiết kiệm hôm nay.</p>
          </div>`;
        }
        
        resultHTML += `<p class="mt-3 text-center text-lg font-bold">Hôm nay bạn nên bỏ vào heo: <span class="text-emerald-600">${amountString}</span></p>
        </div>`;
        
        setSimulationResult(resultHTML);
      }
    }
  };
  
  // Tạo nội dung cảnh báo vượt mức chi tiêu
  const generateOverspendingWarning = (overspendData, avgSpending, rebalancePlan, suggestedSaving) => {
    const overspendingString = Math.round(overspendData.amount).toLocaleString('vi-VN') + ' VNĐ';
    const percentString = Math.round(overspendData.percent) + '%';
    const avgSpendingString = Math.round(avgSpending).toLocaleString('vi-VN') + ' VNĐ';
    const targetDailyString = Math.round(rebalancePlan.targetDailySpending).toLocaleString('vi-VN') + ' VNĐ';
    const savingString = suggestedSaving.toLocaleString('vi-VN') + ' VNĐ';
    
    return `
      <div class="text-left">
        <div class="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
          <p class="text-red-700 font-bold">Cảnh báo: Ngày hôm nay bạn đã vượt mức chi tiêu an toàn</p>
          <p class="text-red-600 text-sm">Chi tiêu hôm nay vượt ${percentString} so với mức trung bình ${avgSpendingString}.</p>
        </div>
        
        <p class="font-bold mb-2">Gợi ý điều chỉnh:</p>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li>Chi tiêu hợp lý cho ${rebalancePlan.remainingDays} ngày còn lại: <strong>${targetDailyString}/ngày</strong></li>
          ${rebalancePlan.isBudgetExceeded ? `<li class="text-red-600 font-medium">Bạn đã vượt tổng ngân sách sau khi trừ mục tiêu tiết kiệm!</li>` : ''}
        </ul>
        
        <div class="mt-3 text-center">
          <p class="font-medium">Hôm nay nên tiết kiệm: <span class="text-yellow-600">${savingString}</span></p>
          <button 
            type="button" 
            class="mt-2 bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 text-sm"
            onclick="document.getElementById('pauseSavingBtn').click()"
          >
            Tạm dừng tiết kiệm hôm nay
          </button>
          <button 
            type="button" 
            class="mt-2 ml-2 bg-slate-500 text-white py-1 px-3 rounded-md hover:bg-slate-600 text-sm"
            onclick="document.getElementById('showPlanBtn').click()"
          >
            Xem kế hoạch bù đắp
          </button>
        </div>
      </div>
    `;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Mô phỏng Tính năng "Heo Đất" 🐷</h2>
      <p className="text-sm text-slate-500 mb-4">Hãy thử tương tác với logic MVP cốt lõi của chúng tôi. Chọn một chế độ và xem AI của FinGenie gợi ý tiết kiệm như thế nào.</p>
      
      <form className="space-y-4" onSubmit={runSimulation}>
        <div>
          <label htmlFor="monthlyIncome" className="block text-sm font-medium text-slate-700">Thu nhập hàng tháng (VNĐ)</label>
          <input 
            type="number" 
            id="monthlyIncome" 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="spendingRatio" className="block text-sm font-medium text-slate-700">Tỉ lệ chi tiêu trung bình (0-1)</label>
          <input 
            type="number" 
            id="spendingRatio" 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            value={spendingRatio}
            min="0"
            max="1"
            step="0.05"
            onChange={(e) => setSpendingRatio(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label htmlFor="monthlySavingTarget" className="block text-sm font-medium text-slate-700">Mục tiêu tiết kiệm tháng (VNĐ)</label>
          <input 
            type="number" 
            id="monthlySavingTarget" 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            value={monthlySavingTarget}
            onChange={(e) => setMonthlySavingTarget(Number(e.target.value))}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentDay" className="block text-sm font-medium text-slate-700">Ngày hiện tại (1-30)</label>
            <input 
              type="number" 
              id="currentDay" 
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={currentDay}
              min="1"
              max="30"
              onChange={(e) => setCurrentDay(Number(e.target.value))}
            />
          </div>
          
          <div>
            <label htmlFor="totalSpentSoFar" className="block text-sm font-medium text-slate-700">Đã chi tiêu (VNĐ)</label>
            <input 
              type="number" 
              id="totalSpentSoFar" 
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={totalSpentSoFar}
              onChange={(e) => setTotalSpentSoFar(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label htmlFor="savingMode" className="block text-sm font-medium text-slate-700">Chế độ Bỏ Quỹ</label>
          <select 
            id="savingMode" 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            value={savingMode}
            onChange={handleModeChange}
          >
            <option value="flexible">1. Linh động (Thông minh)</option>
            <option value="fixed">2. Cố định (Dễ dùng)</option>
          </select>
        </div>

        <div>
          <label htmlFor="spending" className="block text-sm font-medium text-slate-700">Chi tiêu trong ngày (VNĐ)</label>
          <input 
            type="number" 
            id="spending" 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            value={spending}
            onChange={(e) => setSpending(Number(e.target.value))}
          />
        </div>

        {savingMode === 'flexible' ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="formulaType" className="block text-sm font-medium text-slate-700">Loại công thức tính toán</label>
              <select 
                id="formulaType" 
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={formulaType}
                onChange={(e) => setFormulaType(e.target.value)}
              >
                <option value="linear">Tuyến tính (Dễ hiểu)</option>
                <option value="exponential">Hàm mũ (Mượt hơn)</option>
              </select>
            </div>

            {formulaType === 'exponential' && (
              <div>
                <label htmlFor="sensitivityK" className="block text-sm font-medium text-slate-700">Độ nhạy k (0.5-2)</label>
                <input 
                  type="range" 
                  id="sensitivityK" 
                  className="mt-1 block w-full"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={sensitivityK}
                  onChange={(e) => setSensitivityK(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0.5 (Phản ứng nhẹ)</span>
                  <span>{sensitivityK}</span>
                  <span>2.0 (Phản ứng mạnh)</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="minSaving" className="block text-sm font-medium text-slate-700">Tiết kiệm Tối thiểu (VNĐ)</label>
              <input 
                type="number" 
                id="minSaving" 
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                value={minSaving}
                onChange={(e) => setMinSaving(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="maxSaving" className="block text-sm font-medium text-slate-700">Tiết kiệm Tối đa (VNĐ)</label>
              <input 
                type="number" 
                id="maxSaving" 
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                value={maxSaving}
                onChange={(e) => setMaxSaving(Number(e.target.value))}
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="fixedAmount" className="block text-sm font-medium text-slate-700">Số tiền Cố định (VNĐ)</label>
            <input 
              type="number" 
              id="fixedAmount" 
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
              value={fixedAmount}
              onChange={(e) => setFixedAmount(Number(e.target.value))}
            />
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
        >
          🤖 Chạy Mô phỏng AI
        </button>
      </form>
      
      <div className="mt-6 bg-emerald-50 border border-emerald-200 p-4 rounded-md text-center">
        <p className="text-emerald-700 font-medium" dangerouslySetInnerHTML={{ __html: simulationResult }}></p>
      </div>
      
      {/* Nút ẩn để xử lý sự kiện từ các nút trong HTML động */}
      <button 
        id="pauseSavingBtn" 
        className="hidden" 
        onClick={() => {
          setPauseSavingToday(true);
          runSimulation({ preventDefault: () => {} });
        }}
      />
      
      <button 
        id="showPlanBtn" 
        className="hidden" 
        onClick={() => setShowRebalancePlan(true)}
      />
      
      {/* Modal hiển thị kế hoạch cân bằng chi tiết */}
      {showRebalancePlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Kế hoạch bù đắp chi tiêu</h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="font-medium">Phân tích tình hình:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Ngày hiện tại: {currentDay}/{daysInMonth}</li>
                  <li>Còn lại: {daysInMonth - currentDay} ngày</li>
                  <li>Thu nhập tháng: {monthlyIncome.toLocaleString('vi-VN')} VNĐ</li>
                  <li>Mục tiêu tiết kiệm: {monthlySavingTarget.toLocaleString('vi-VN')} VNĐ</li>
                  <li>Đã tiêu: {totalSpentSoFar.toLocaleString('vi-VN')} VNĐ</li>
                  <li>Đã tiết kiệm: {savedSoFar.toLocaleString('vi-VN')} VNĐ</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium">Kế hoạch điều chỉnh:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Chi tiêu hợp lý cho các ngày còn lại: <strong>{Math.round(calculateRebalancePlan().targetDailySpending).toLocaleString('vi-VN')} VNĐ/ngày</strong></li>
                  {calculateRebalancePlan().isBudgetExceeded && (
                    <li className="text-red-600">
                      Cảnh báo: Bạn đã vượt ngân sách {Math.abs(calculateRebalancePlan().remainingBudget).toLocaleString('vi-VN')} VNĐ
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                <p className="font-medium">Gợi ý hành động:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Giảm ăn ngoài trong 3 ngày tới</li>
                  <li>Hủy các khoản mua không cần thiết</li>
                  <li>Giữ tiết kiệm tối thiểu trong 7 ngày</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button 
                className="bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600"
                onClick={() => setShowRebalancePlan(false)}
              >
                Đóng
              </button>
              <button 
                className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
                onClick={() => {
                  // Áp dụng kế hoạch tự động
                  setPauseSavingToday(true);
                  setShowRebalancePlan(false);
                  runSimulation({ preventDefault: () => {} });
                }}
              >
                Áp dụng kế hoạch tự động
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PiggyBankSimulator;
