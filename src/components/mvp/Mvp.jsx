import MvpTabs from './MvpTabs';

function Mvp() {
  return (
    <section id="mvp" className="content-section space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Các Tính năng Cốt lõi của MVP</h1>
      <p className="text-lg text-slate-600">
        MVP (Sản phẩm Khả dụng Tối thiểu) của FinGenie tập trung vào việc giải quyết các vấn đề cốt lõi: phân tích, tạo thói quen tiết kiệm và cá nhân hóa trải nghiệm.
      </p>

      <MvpTabs />
    </section>
  );
}

export default Mvp;
