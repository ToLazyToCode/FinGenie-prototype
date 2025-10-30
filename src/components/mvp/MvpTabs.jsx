import { useState } from 'react';

function MvpTabs() {
  const [activeTab, setActiveTab] = useState('analysis');
  
  const tabs = [
    { id: 'analysis', name: 'Phân Tích & Cảnh Báo' },
    { id: 'piggy', name: 'Quản Lý Quỹ Heo Đất' },
    { id: 'ai', name: 'AI Cá Nhân Hóa' }
  ];

  return (
    <>
      {/* Thanh điều hướng Tab */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn py-4 px-1 text-center text-sm font-medium text-slate-500 hover:text-emerald-600 ${
                activeTab === tab.id ? 'active' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Nội dung Tab */}
      <div>
        {/* Tab 1: Phân Tích & Cảnh Báo */}
        {activeTab === 'analysis' && (
          <div id="analysis" className="tab-content space-y-4">
            <h2 className="text-2xl font-semibold">Phân tích AI: Biến Dữ Liệu <span className="text-emerald-600">&rarr;</span> Hành Động</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li><strong className="font-semibold">Thống kê Đa chiều:</strong> Trực quan hóa chi tiêu theo Ngày, Tháng, Năm.</li>
              <li><strong className="font-semibold">Phân loại Linh hoạt:</strong> Ghi nhận chi tiêu theo các loại (Đồ ăn, Du lịch) và cho phép người dùng <strong className="font-semibold">thêm loại thủ công</strong>.</li>
              <li><strong className="font-semibold">Đánh giá Sức khỏe Tài chính:</strong> Tự động tính toán tỷ lệ Chi tiêu / Thu nhập.</li>
              <li><strong className="font-semibold">Cảnh báo An toàn:</strong> Gửi thông báo <strong className="font-semibold">ngay lập tức</strong> nếu người dùng vung tiền vượt quá ngưỡng "an toàn" đã đặt ra.</li>
              <li><strong className="font-semibold">Lời khuyên Thông minh:</strong> AI chủ động đưa ra các gợi ý chi tiêu mới, giúp giảm phí và tối ưu hóa ngân sách.</li>
            </ul>
          </div>
        )}

        {/* Tab 2: Quỹ Heo Đất */}
        {activeTab === 'piggy' && (
          <div id="piggy" className="tab-content space-y-4">
            <h2 className="text-2xl font-semibold">Cơ chế Tiết kiệm "Mạnh Tay" (Quỹ Heo Đất)</h2>
            <p>Chúng tôi cung cấp hai cơ chế độc đáo để kiểm soát tiền lẻ và xây dựng thói quen:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-lg text-emerald-700">1. Chế độ Linh động (Thông minh)</h3>
                <p className="text-sm">Người dùng nhập khoảng Min/Max. AI sẽ phân tích chi tiêu trong ngày để tính toán và gợi ý một số tiền tiết kiệm tối ưu nằm trong khoảng đó. (Như bạn đã thử ở trang Tổng quan!)</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-lg text-slate-700">2. Chế độ Cố định (Dễ dùng)</h3>
                <p className="text-sm">Người dùng nhập một số tiền cố định (ví dụ: 50.000đ). App sẽ nhắc nhở bỏ quỹ đúng số tiền đó mỗi ngày. Đơn giản và hiệu quả để xây dựng kỷ luật.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Cá Nhân Hóa */}
        {activeTab === 'ai' && (
          <div id="ai" className="tab-content space-y-4">
            <h2 className="text-2xl font-semibold">Người bạn AI Hóm hỉnh</h2>
            <p>Đây là khác biệt lớn nhất của FinGenie. Chúng tôi không phải là một kế toán viên khô khan.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li><strong className="font-semibold">Ngôn ngữ Hóm hỉnh:</strong> Lời khuyên được đưa ra một cách thông minh, hài hước, tạo cảm giác gần gũi.</li>
              <li><strong className="font-semibold">Tùy chỉnh Xưng hô:</strong> Người dùng có thể chọn cách FinGenie xưng hô với mình (ví dụ: Bro-Tui, Cậu-Tớ, Bạn-Mình).</li>
              <li><strong className="font-semibold">Hiểu Ngữ cảnh:</strong> "Tháng này Bro lại tốn tiền cafe rồi. Thử giảm 3 ly tuần này xem, AI tính ra cuối tháng đủ tiền mua đôi giày mới đấy!"</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default MvpTabs;
