function Timeline() {
  const timelineSteps = [
    {
      id: 1,
      title: 'Giai đoạn 1: Gamification & Cộng đồng',
      description: 'Hoàn thiện Bảng Dự báo Doanh thu (3 năm) cho CP4.',
      features: 'Bắt đầu phát triển "Thử thách tiết kiệm" (Vd: 7 ngày không trà sữa), nhiệm vụ kiếm điểm, và bảng xếp hạng. Quà tặng phải hỗ trợ tiết kiệm, không kích thích chi tiêu.'
    },
    {
      id: 2,
      title: 'Giai đoạn 2: Tối ưu hóa Gợi ý',
      description: 'Thử nghiệm người dùng (20 users) về trải nghiệm AI và tính năng Heo Đất để lấy feedback cho CP4.',
      features: 'Hoàn thiện Module "Gợi ý Mua sắm Thông minh" (Vd: Gợi ý quán cafe rẻ hơn) và "AI Gợi ý Ngân hàng" (Phân tích lãi suất/phí).'
    },
    {
      id: 3,
      title: 'Giai đoạn 3: Tự động Đầu tư (Micro-investing)',
      description: 'Hoàn thiện thiết kế Pitch Deck cuối cùng, sẵn sàng gọi vốn (Mục tiêu CP4).',
      features: 'Cho phép người dùng tự động đầu tư các khoản tiền lẻ từ "Quỹ Heo Đất" vào các sản phẩm tài chính an toàn như Chứng chỉ Quỹ.'
    }
  ];

  return (
    <div className="space-y-12">
      {timelineSteps.map((step) => (
        <div key={step.id} className="relative">
          <div className="absolute w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold -left-5 top-0 shadow-lg">
            {step.id}
          </div>
          <div className="ml-10 pl-8 py-4 bg-white rounded-lg shadow-md border-l-4 border-emerald-600">
            <h3 className="text-xl font-bold text-emerald-700">{step.title}</h3>
            <p className="text-slate-600 mt-1">{step.description}</p>
            <p className="text-slate-600 mt-2">
              <strong className="font-semibold">Tính năng:</strong> {step.features}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
