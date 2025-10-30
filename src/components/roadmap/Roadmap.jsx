import Timeline from './Timeline';

function Roadmap() {
  return (
    <section id="roadmap" className="content-section space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Lộ trình Phát triển</h1>
      <p className="text-lg text-slate-600">
        Đây là kế hoạch để FinGenie phát triển từ một MVP thành một nền tảng tài chính cá nhân toàn diện, tập trung vào việc hoàn thiện Pitch Deck (CP4) và mở rộng tính năng.
      </p>

      <Timeline />
    </section>
  );
}

export default Roadmap;
