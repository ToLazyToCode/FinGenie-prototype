import {useState} from 'react';

function Toast({ message, type }) {
    if (!message) return null;
    return (
        <div className={`toast ${type}`}>
            <div className="toast-body">{message}</div>
        </div>
    );
}

function PiggyBankSimulator() {
    // (Các state giữ nguyên, tôi đặt lại giá trị mặc định
    //  để giống với trường hợp bạn vừa nêu)
    const [savingMode, setSavingMode] = useState('flexible');
    const [formulaType, setFormulaType] = useState('linear');
    const [monthlyIncome, setMonthlyIncome] = useState(2000000); // 2 triệu VNĐ
    const [spendingRatio, setSpendingRatio] = useState(0.6); // 60% thu nhập
    const [spending, setSpending] = useState(35000);
    const [minSaving, setMinSaving] = useState(10000);
    const [maxSaving, setMaxSaving] = useState(400000);
    const [fixedAmount, setFixedAmount] = useState(50000);
    const [sensitivityK, setSensitivityK] =useState(1); // Hệ số k
    const [simulationResult, setSimulationResult] = useState('Kết quả mô phỏng sẽ xuất hiện ở đây...');
    const [dailyAvgSpending, setDailyAvgSpending] = useState(0);

    const [showRebalancePlan, setShowRebalancePlan] = useState(false);
    const [pauseSavingToday, setPauseSavingToday] = useState(false);
    const [currentZone, setCurrentZone] = useState('yellow');

    const [currentDay, setCurrentDay] = useState(10);
    const [daysInMonth, setDaysInMonth] = useState(30);
    const [totalSpentSoFar, setTotalSpentSoFar] = useState(500000);
    const [monthlySavingTarget, setMonthlySavingTarget] = useState(500000);
    const [savedSoFar, setSavedSoFar] = useState(0);

    const [toast, setToast] = useState({message: "", type: ""});

    // --- CÁC HÀM TÍNH TOÁN CỐT LÕI (Không đổi) ---

    const checkMinSavingLogic = () => {
        const avgSpending = calculateDailyAvgSpending();
        const avgDailyIncome = monthlyIncome / daysInMonth;
        const avgDailySurplus = avgDailyIncome - avgSpending;

        if (minSaving > avgDailySurplus) {
            return {
                isValid: false,
                surplus: avgDailySurplus
            };
        }
        return { isValid: true, surplus: avgDailySurplus };
    };

    const calculateDailyAvgSpending = () => {
        return (monthlyIncome / daysInMonth) * spendingRatio;
    };

    const calculateRebalancePlan = () => {
        const budgetForSpending = monthlyIncome - monthlySavingTarget;
        const remainingSpendBudget = budgetForSpending - (totalSpentSoFar + spending);
        const remainingDays = daysInMonth - currentDay;

        if (remainingDays <= 0) {
            return {
                targetDailySpending: 0,
                remainingDays: 0,
                isBudgetExceeded: true,
            };
        }

        let targetDailySpending = remainingSpendBudget / remainingDays;
        const minDailySpending = calculateDailyAvgSpending() * 0.7;
        targetDailySpending = Math.max(targetDailySpending, minDailySpending);
        const isBudgetExceeded = remainingSpendBudget < 0;

        return {
            targetDailySpending,
            remainingDays,
            remainingBudget: remainingSpendBudget,
            isBudgetExceeded
        };
    };

    const getEffectiveSavingRates = () => {
        const remainingDays = daysInMonth - currentDay;
        let requiredDailySaving = 0;

        if (remainingDays > 0) {
            requiredDailySaving = (monthlySavingTarget - savedSoFar) / remainingDays;
        }

        const effectiveMinSaving = Math.max(minSaving, requiredDailySaving);
        const effectiveMaxSaving = Math.max(maxSaving, effectiveMinSaving);

        return { effectiveMinSaving, effectiveMaxSaving, requiredDailySaving };
    };

    const calculateLinearSaving = (dailySpending, avgSpending, effectiveMin, effectiveMax) => {
        const epsilon = 0.01;
        let saving = effectiveMin + (effectiveMax - effectiveMin) * (1 - dailySpending / (avgSpending + epsilon));
        return Math.max(effectiveMin, Math.min(effectiveMax, saving));
    };

    const calculateExponentialSaving = (dailySpending, avgSpending, effectiveMin, effectiveMax) => {
        const epsilon = 0.01;
        let saving = effectiveMin + (effectiveMax - effectiveMin) * Math.exp(-sensitivityK * dailySpending / (avgSpending + epsilon));
        return Math.max(effectiveMin, Math.min(effectiveMax, saving));
    };

    // --- XỬ LÝ GIAO DIỆN VÀ SỰ KIỆN ---

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast({ message: "", type: "" });
        }, 4000);
    };

    const runSimulation = (e) => {
        e.preventDefault();

        // =================================================================
        // === KHỐI CẬP NHẬT: VALIDATION MỚI (v2.3) ===
        // =================================================================
        const avgDailyIncome = monthlyIncome / daysInMonth;

        // CHECK 1: Tiết kiệm Tối thiểu > Thu nhập ngày
        // (Áp dụng cho cả 2 chế độ)
        if (minSaving > avgDailyIncome) {
            const errorMsg = `Lỗi: "Tiết kiệm Tối thiểu" (${minSaving.toLocaleString('vi-VN')} VNĐ) không thể lớn hơn Thu nhập trung bình ngày (${Math.round(avgDailyIncome).toLocaleString('vi-VN')} VNĐ).`;
            showToast(errorMsg, "error");
            setSimulationResult(`<p class="text-red-700 font-medium">${errorMsg}</p>`);
            return;
        }

        // Chỉ áp dụng các check sau cho chế độ 'flexible'
        if (savingMode === 'flexible') {
            // CHECK 2: Tiết kiệm Tối đa > Thu nhập ngày
            if (maxSaving > avgDailyIncome) {
                const errorMsg = `Lỗi: "Tiết kiệm Tối đa" (${maxSaving.toLocaleString('vi-VN')} VNĐ) không thể lớn hơn Thu nhập trung bình ngày (${Math.round(avgDailyIncome).toLocaleString('vi-VN')} VNĐ).`;
                showToast(errorMsg, "error");
                setSimulationResult(`<p class="text-red-700 font-medium">${errorMsg}</p>`);
                return;
            }

            // CHECK 3: min >= max (check tĩnh)
            if (minSaving >= maxSaving) {
                const errorMsg = `Lỗi: "Tiết kiệm Tối thiểu" (${minSaving.toLocaleString('vi-VN')} VNĐ) phải nhỏ hơn "Tiết kiệm Tối đa" (${maxSaving.toLocaleString('vi-VN')} VNĐ).`;
                showToast(errorMsg, "error");
                setSimulationResult(`<p class="text-red-700 font-medium">${errorMsg}</p>`);
                return;
            }
        }
        // =================================================================
        // === KẾT THÚC KHỐI CẬP NHẬT ===
        // =================================================================


        // CHECK 4: (Check cũ) min > (thu nhập - chi tiêu)
        const minSavingCheck = checkMinSavingLogic();
        if (savingMode === 'flexible' && !minSavingCheck.isValid) {
            const errorMsg = `Cảnh báo: Mức 'Tiết kiệm Tối thiểu' (${minSaving.toLocaleString('vi-VN')} VNĐ) của bạn đang cao hơn số tiền dư trung bình hàng ngày (${Math.round(minSavingCheck.surplus).toLocaleString('vi-VN')} VNĐ). Điều này không khả thi.`;
            showToast(errorMsg, "error");
            setSimulationResult(`<p class="text-red-700 font-medium">${errorMsg}</p>`);
            return;
        }

        // --- Các logic tính toán còn lại ---
        const avgSpending = calculateDailyAvgSpending();
        setDailyAvgSpending(avgSpending);

        const { effectiveMinSaving, effectiveMaxSaving, requiredDailySaving } = getEffectiveSavingRates();

        if (savingMode === 'fixed') {
            const amountString = fixedAmount.toLocaleString('vi-VN') + ' VNĐ';
            let resultHTML = `Gợi ý: Bạn đã đặt mục tiêu cố định. Hãy bỏ vào heo <strong>${amountString}</strong> như đã định! Kỷ luật là sức mạnh.`;

            if (spending > avgSpending * 1.1) {
                const rebalancePlan = calculateRebalancePlan();
                resultHTML = generateZoneMessage('red', avgSpending, rebalancePlan, fixedAmount, requiredDailySaving, true);
            }
            setSimulationResult(resultHTML);
            return;
        }

        if (savingMode === 'flexible') {

            // CHECK 5: (Check cũ - check động) effectiveMin >= effectiveMax
            // Xảy ra khi mục tiêu bù đắp > maxSaving
            if (effectiveMinSaving >= effectiveMaxSaving) {
                const requiredString = Math.round(requiredDailySaving).toLocaleString('vi-VN');
                const maxString = maxSaving.toLocaleString('vi-VN');

                // (Thông báo lỗi này vẫn như cũ, đã rất rõ ràng)
                setSimulationResult(
                    `<div class="text-left">
                        <p class="font-bold text-red-700">Lỗi: Mục tiêu tiết kiệm không khả thi!</p>
                        <p class="text-sm mt-2">Phân tích của AI:</p>
                        <ul class="list-disc pl-5 text-sm space-y-1">
                            <li>Để đạt mục tiêu, bạn cần tiết kiệm <strong>${requiredString} VNĐ/ngày</strong> cho những ngày còn lại.</li>
                            <li>Mức "Tiết kiệm Tối đa" bạn đặt chỉ là <strong>${maxString} VNĐ</strong> (thấp hơn mức yêu cầu).</li>
                        </ul>
                        <p class="font-medium mt-3">Cách khắc phục:</p>
                        <p class="text-sm">Vui lòng tăng "Tiết kiệm Tối đa" lên ít nhất <strong>${requiredString} VNĐ</strong> hoặc điều chỉnh lại mục tiêu tháng.</p>
                    </div>`
                );
                return;
            }

            // Logic phân vùng (vẫn giữ logic gộp Xanh/Vàng từ v2.2)
            const redZoneThreshold = avgSpending * 1.1;

            let suggestion = 0;
            let zone = 'yellow';
            let rebalancePlan = null;

            if (spending > redZoneThreshold) {
                // --- VÙNG ĐỎ ---
                zone = 'red';
                suggestion = pauseSavingToday ? 0 : effectiveMinSaving;
                rebalancePlan = calculateRebalancePlan();

            } else {
                // --- VÙNG THƯỜNG (VÀNG + XANH) ---
                const greenZoneThreshold = avgSpending * 0.9;
                zone = (spending < greenZoneThreshold) ? 'green' : 'yellow';

                if (formulaType === 'linear') {
                    suggestion = calculateLinearSaving(spending, avgSpending, effectiveMinSaving, effectiveMaxSaving);
                } else {
                    suggestion = calculateExponentialSaving(spending, avgSpending, effectiveMinSaving, effectiveMaxSaving);
                }
            }

            setCurrentZone(zone);

            if (pauseSavingToday && zone !== 'red') {
                setPauseSavingToday(false);
            }

            suggestion = Math.round(suggestion / 1000) * 1000;

            const resultHTML = generateZoneMessage(zone, avgSpending, rebalancePlan, suggestion, requiredDailySaving, false);
            setSimulationResult(resultHTML);

            if (requiredDailySaving > minSaving && (daysInMonth - currentDay) > 0) {
                showToast(`Mục tiêu của bạn đang yêu cầu tiết kiệm ${Math.round(requiredDailySaving).toLocaleString('vi-VN')} VNĐ/ngày. Mức Tối thiểu đã được tự động điều chỉnh.`, "warning");
            }
        }
    };

    // (Hàm generateZoneMessage không đổi)
    const generateZoneMessage = (zone, avgSpending, rebalancePlan, suggestedSaving, requiredDailySaving, isFixedMode) => {
        const spendingString = spending.toLocaleString('vi-VN') + ' VNĐ';
        const avgSpendingString = Math.round(avgSpending).toLocaleString('vi-VN') + ' VNĐ';
        const savingString = suggestedSaving.toLocaleString('vi-VN') + ' VNĐ';

        let html = `<div class="text-left">`;

        if (zone === 'green') {
            html += `<div class="p-3 bg-green-50 border border-green-200 rounded-md mb-3">
              <p class="text-green-700 font-bold">Tuyệt vời! Bạn đã chi tiêu ít hơn mức trung bình.</p>
              <p class="text-green-600 text-sm">Đây là cơ hội tốt để tăng tốc tiết kiệm!</p>
            </div>`;
        } else if (zone === 'red') {
            const targetDailyString = Math.round(rebalancePlan.targetDailySpending).toLocaleString('vi-VN') + ' VNĐ';
            html += `<div class="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
              <p class="text-red-700 font-bold">Cảnh báo: (Vùng Đỏ) Bạn đã chi tiêu cao hơn mức an toàn.</p>
              <p class="text-red-600 text-sm">Chi tiêu hôm nay (${spendingString}) đã vượt ngưỡng an toàn (${Math.round(avgSpending * 1.1).toLocaleString('vi-VN')} VNĐ).</p>
            </div>`;
        } else { // Vùng Vàng
            html += `<div class="p-3 bg-blue-50 border border-blue-200 rounded-md mb-3">
              <p class="text-blue-700 font-bold">(Vùng Vàng) Mức chi tiêu hôm nay ổn định.</p>
              <p class="text-blue-600 text-sm">Bạn đang đi đúng hướng. Tiếp tục duy trì nhé!</p>
            </div>`;
        }

        html += `<p class="font-bold mb-2">FinGenie AI phân tích:</p>
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li>Chi tiêu trung bình/ngày: ${avgSpendingString}</li>
            <li>Chi tiêu hôm nay: ${spendingString}</li>
            ${(requiredDailySaving > minSaving && !isFixedMode) ? `<li class="text-amber-700">Cần tiết kiệm tối thiểu: ${Math.round(requiredDailySaving).toLocaleString('vi-VN')} VNĐ/ngày (để đạt mục tiêu)</li>` : ''}
          </ul>`;

        if (zone === 'red') {
            html += `<p class="font-bold mt-3 mb-1">Gợi ý điều chỉnh:</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Chi tiêu hợp lý cho ${rebalancePlan.remainingDays} ngày còn lại: <strong>${rebalancePlan.targetDailySpending.toLocaleString('vi-VN')} VNĐ/ngày</strong></li>
                ${rebalancePlan.isBudgetExceeded ? `<li class="text-red-600 font-medium">Bạn đã vượt tổng ngân sách!</li>` : ''}
              </ul>`;
        }

        html += `<div class="mt-4 text-center">`;
        if (pauseSavingToday) {
            html += `<p class="font-medium text-yellow-700">Bạn đã chọn tạm dừng tiết kiệm hôm nay.</p>
                      <p class="text-lg font-bold">Số tiền bỏ heo: <span class="text-emerald-600">0 VNĐ</span></p>`;
        } else {
            html += `<p class="font-medium">Hôm nay nên bỏ vào heo:</p>
                      <p class="text-2xl font-bold text-emerald-600">${savingString}</p>`;
        }

        if (zone === 'red' && !isFixedMode) {
            html += `<div class="mt-3">
                <button 
                  type="button" 
                  class="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 text-sm"
                  onclick="document.getElementById('pauseSavingBtn').click()">
                  ${pauseSavingToday ? 'Đã tạm dừng' : 'Tạm dừng tiết kiệm hôm nay'}
                </button>
                <button 
                  type="button" 
                  class="ml-2 bg-slate-500 text-white py-1 px-3 rounded-md hover:bg-slate-600 text-sm"
                  onclick="document.getElementById('showPlanBtn').click()">
                  Xem kế hoạch bù đắp
                </button>
              </div>`;
        }

        html += `</div></div>`;
        return html;
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Mô phỏng Tính năng "Heo Đất" 🐷 (v2.3)</h2>
            <p className="text-sm text-slate-500 mb-4">Đã cập nhật: Thêm kiểm tra "Tiết kiệm" không được lớn hơn "Thu nhập
                ngày".</p>

            <form className="space-y-4" onSubmit={runSimulation}>
                {/* --- NHÓM THU NHẬP & MỤC TIÊU --- */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-sm font-medium text-emerald-700 px-1">Thông tin cơ bản</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-slate-700">Thu
                                nhập hàng tháng (VNĐ)</label>
                            <input
                                type="number"
                                id="monthlyIncome"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="spendingRatio" className="block text-sm font-medium text-slate-700">Tỉ lệ chi
                                tiêu trung bình (0-1)</label>
                            <input
                                type="number"
                                id="spendingRatio"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                value={spendingRatio}
                                min="0"
                                max="1"
                                step="0.05"
                                onChange={(e) => setSpendingRatio(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="monthlySavingTarget"
                                   className="block text-sm font-medium text-slate-700">Mục tiêu tiết kiệm
                                tháng (VNĐ)</label>
                            <input
                                type="number"
                                id="monthlySavingTarget"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                value={monthlySavingTarget}
                                onChange={(e) => setMonthlySavingTarget(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="savedSoFar" className="block text-sm font-medium text-slate-700">Đã tiết kiệm
                                (VNĐ)</label>
                            <input
                                type="number"
                                id="savedSoFar"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                value={savedSoFar}
                                onChange={(e) => setSavedSoFar(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* --- NHÓM TÌNH HÌNH HIỆN TẠI --- */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-sm font-medium text-emerald-700 px-1">Tình hình hôm nay</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="currentDay" className="block text-sm font-medium text-slate-700">Ngày hiện
                                tại (1-{daysInMonth})</label>
                            <input
                                type="number"
                                id="currentDay"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                value={currentDay}
                                min="1"
                                max={daysInMonth}
                                onChange={(e) => setCurrentDay(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label htmlFor="totalSpentSoFar" className="block text-sm font-medium text-slate-700">Đã chi
                                tiêu (VNĐ)</label>
                            <input
                                type="number"
                                id="totalSpentSoFar"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                value={totalSpentSoFar}
                                onChange={(e) => setTotalSpentSoFar(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="spending" className="block text-sm font-medium text-slate-700">Chi tiêu hôm
                                nay (VNĐ)</label>
                            <input
                                type="number"
                                id="spending"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                value={spending}
                                onChange={(e) => setSpending(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* --- NHÓM CÀI ĐẶT HEO ĐẤT --- */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-sm font-medium text-emerald-700 px-1">Cài đặt Heo đất</legend>
                    <div>
                        <label htmlFor="savingMode" className="block text-sm font-medium text-slate-700">Chế độ Bỏ
                            Quỹ</label>
                        <select
                            id="savingMode"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                            value={savingMode}
                            onChange={(e) => setSavingMode(e.target.value)}
                        >
                            <option value="flexible">1. Linh động (Thông minh)</option>
                            <option value="fixed">2. Cố định (Dễ dùng)</option>
                        </select>
                    </div>

                    {savingMode === 'flexible' ? (
                        <div className="space-y-4 mt-4">
                            <div>
                                <label htmlFor="formulaType" className="block text-sm font-medium text-slate-700">Loại
                                    công
                                    thức tính toán</label>
                                <select
                                    id="formulaType"
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                    value={formulaType}
                                    onChange={(e) => setFormulaType(e.target.value)}
                                >
                                    <option value="linear">Tuyến tính (Dễ hiểu)</option>
                                    <option value="exponential">Hàm mũ (Mượt hơn)</option>
                                </select>
                            </div>

                            {formulaType === 'exponential' && (
                                <div>
                                    <label htmlFor="sensitivityK" className="block text-sm font-medium text-slate-700">Độ
                                        nhạy k (0.5-2)</label>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="minSaving" className="block text-sm font-medium text-slate-700">Tiết
                                        kiệm
                                        Tối thiểu (VNĐ)</label>
                                    <input
                                        type="number"
                                        id="minSaving"
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                        value={minSaving}
                                        onChange={(e) => setMinSaving(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="maxSaving" className="block text-sm font-medium text-slate-700">Tiết
                                        kiệm
                                        Tối đa (VNĐ)</label>
                                    <input
                                        type="number"
                                        id="maxSaving"
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                        value={maxSaving}
                                        onChange={(e) => setMaxSaving(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <label htmlFor="fixedAmount" className="block text-sm font-medium text-slate-700">Số tiền Cố
                                định (VNĐ)</label>
                            <input
                                type="number"
                                id="fixedAmount"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                                value={fixedAmount}
                                onChange={(e) => setFixedAmount(Number(e.target.value))}
                            />
                        </div>
                    )}
                </fieldset>

                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
                >
                    🤖 Chạy Mô phỏng AI (v2.3)
                </button>
            </form>

            {/* --- KHU VỰC KẾT QUẢ --- */}
            <div className={`mt-6 p-4 rounded-md border
                ${currentZone === 'green' ? 'bg-green-50 border-green-200' : ''}
                ${currentZone === 'yellow' ? 'bg-blue-50 border-blue-200' : ''}
                ${currentZone === 'red' ? 'bg-red-50 border-red-200' : ''}
            `}>
                <div className="text-slate-700" dangerouslySetInnerHTML={{__html: simulationResult}}></div>
            </div>

            {/* Nút ẩn & Modal (Không thay đổi) */}
            <button
                id="pauseSavingBtn"
                className="hidden"
                onClick={() => {
                    setPauseSavingToday(true);
                    runSimulation({ preventDefault: () => {} });
                }}
                disabled={pauseSavingToday}
            />
            <button
                id="showPlanBtn"
                className="hidden"
                onClick={() => setShowRebalancePlan(true)}
            />

            {showRebalancePlan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Kế hoạch bù đắp chi tiêu</h3>
                        {(() => {
                            const plan = calculateRebalancePlan();
                            return (
                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                        <p className="font-medium">Phân tích tình hình:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                                            <li>Ngày hiện tại: {currentDay}/{daysInMonth} (Còn {plan.remainingDays} ngày)</li>
                                            <li>Ngân sách tiêu còn lại: {plan.remainingBudget.toLocaleString('vi-VN')} VNĐ</li>
                                            <li>Đã tiêu (gồm hôm nay): {(totalSpentSoFar + spending).toLocaleString('vi-VN')} VNĐ</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-medium">Kế hoạch điều chỉnh:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                                            <li>Chi tiêu hợp lý cho các ngày còn
                                                lại: <strong>{Math.round(plan.targetDailySpending).toLocaleString('vi-VN')} VNĐ/ngày</strong>
                                            </li>
                                            {plan.isBudgetExceeded && (
                                                <li className="text-red-600">
                                                    Cảnh báo: Bạn đã vượt ngân
                                                    sách {Math.abs(plan.remainingBudget).toLocaleString('vi-VN')} VNĐ
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })()}

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
                                    setPauseSavingToday(true);
                                    setShowRebalancePlan(false);
                                    runSimulation({ preventDefault: () => {} });
                                }}
                            >
                                Áp dụng & Tạm dừng Tiết kiệm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div id="toast-container" className=".toast .toast-body">
                <Toast message={toast.message} type={toast.type} />
            </div>
        </div>
    );
}

export default PiggyBankSimulator;