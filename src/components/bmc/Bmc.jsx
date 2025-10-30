import BusinessModelCanvas from './BusinessModelCanvas';

function Bmc() {
  return (
    <section id="bmc" className="content-section space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Mô hình Kinh doanh (Business Model Canvas)</h1>
      <p className="text-lg text-slate-600">
        Mô hình của FinGenie được xây dựng dựa trên giá trị cốt lõi là "tiết kiệm", với mô hình Freemium và các đối tác tài chính chiến lược (không phải đối tác thương mại điện tử).
      </p>

      <BusinessModelCanvas />
    </section>
  );
}

export default Bmc;
