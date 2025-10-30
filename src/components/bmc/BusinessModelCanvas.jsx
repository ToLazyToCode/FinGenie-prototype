import { useState } from 'react';

function BusinessModelCanvas() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filters = [
    { id: 'all', name: 'Tất cả 9 ô' },
    { id: 'value', name: 'Giá trị & Khách hàng' },
    { id: 'financials', name: 'Tài chính (Doanh thu & Chi phí)' },
    { id: 'ops', name: 'Vận hành & Đối tác' }
  ];
  
  const canvasCards = [
    {
      id: 'cs',
      title: '1. Phân khúc Khách hàng (CS)',
      content: 'Gen Z & Millennials Việt Nam (18-35 tuổi), có thu nhập, muốn kiểm soát chi tiêu và tìm kiếm sự độc lập tài chính.',
      group: 'value'
    },
    {
      id: 'vp',
      title: '2. Giá trị Đề xuất (VP)',
      content: 'Trợ lý tiết kiệm AI hóm hỉnh (người bạn). Giúp tối ưu chi tiêu và xây dựng quỹ từ tiền lẻ. 100% tập trung tiết kiệm.',
      group: 'value'
    },
    {
      id: 'ch',
      title: '3. Kênh Phân phối (CH)',
      content: 'App Stores (iOS/Android), Social Media (TikTok, Facebook), và Đối tác Ngân hàng/Tổ chức Tài chính.',
      group: 'value'
    },
    {
      id: 'cr',
      title: '4. Quan hệ Khách hàng (CR)',
      content: 'Trợ lý AI cá nhân hóa (gần gũi), Cộng đồng (gamification), Hỗ trợ tự động.',
      group: 'value'
    },
    {
      id: 'rs',
      title: '5. Nguồn Doanh thu (RS)',
      content: 'Freemium: Gói Premium (AI nâng cao, Gamification, Tự động đầu tư).\nHoa hồng (Tương lai): Giới thiệu gửi tiết kiệm tại các Ngân hàng đối tác.',
      group: 'financials'
    },
    {
      id: 'kr',
      title: '6. Nguồn lực Chính (KR)',
      content: 'Nền tảng AI & Mô hình ngôn ngữ (LLM), Đội ngũ phát triển, Dữ liệu người dùng (đã ẩn danh).',
      group: 'ops'
    },
    {
      id: 'ka',
      title: '7. Hoạt động Chính (KA)',
      content: 'Phát triển & Huấn luyện AI, Phân tích dữ liệu, Vận hành nền tảng, Marketing & Phát triển cộng đồng.',
      group: 'ops'
    },
    {
      id: 'kp',
      title: '8. Đối tác Chính (KP)',
      content: 'Tài chính: Ngân hàng, Công ty Chứng chỉ Quỹ.\nCông nghệ: Nhà cung cấp AI/Cloud (Google, AWS).\nChuyên môn: Các Chuyên gia Tài chính.',
      group: 'ops'
    },
    {
      id: 'cs2',
      title: '9. Cơ cấu Chi phí (CS)',
      content: 'Cao: Vận hành AI/Cloud Server, Chi phí huấn luyện mô hình ngôn ngữ.\nTrung bình: Marketing & Thu hút người dùng (UAC).\nThấp: Nhân sự Core Team (hiện tại).',
      group: 'financials'
    }
  ];

  return (
    <>
      {/* Bộ lọc BMC */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`bmc-filter-btn py-2 px-4 rounded-md text-sm ${
              activeFilter === filter.id
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 border'
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* Lưới 9 ô BMC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canvasCards.map((card) => (
          <div
            key={card.id}
            className={`bmc-card bg-white p-5 rounded-lg shadow transition-all duration-300 ${
              activeFilter !== 'all' && activeFilter !== card.group ? 'opacity-25 grayscale' : ''
            }`}
            data-group={card.group}
          >
            <h3 className="font-bold text-lg mb-2">{card.title}</h3>
            <p className="text-sm text-slate-700 whitespace-pre-line">{card.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default BusinessModelCanvas;
