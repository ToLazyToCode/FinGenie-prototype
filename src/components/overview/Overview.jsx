import PiggyBankSimulator from './PiggyBankSimulator';
import SpendingChart from './SpendingChart';

function Overview() {
  return (
    <section id="overview" className="content-section space-y-8">
      {/* Giới thiệu */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Chúng tôi KHÔNG phải là một cái ví. Chúng tôi là một Người Bạn.</h1>
        <p className="text-lg text-slate-600">
          Nội dung báo cáo này trình bày về FinGenie, một trợ lý tài chính AI tập trung 100% vào <strong className="font-bold">TIẾT KIỆM</strong>. Chúng tôi giải quyết "nỗi đau" của người dùng khi các app thị trường kích thích chi tiêu. FinGenie biến số liệu thống kê khô khan thành lời khuyên hóm hỉnh, cá nhân hóa để giúp bạn thực sự đạt được mục tiêu tài chính.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Cột trái: Mô phỏng MVP Tương tác */}
        <PiggyBankSimulator />
        
        {/* Cột phải: Biểu đồ mẫu */}
        <SpendingChart />
      </div>
    </section>
  );
}

export default Overview;
