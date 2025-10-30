import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

function SpendingChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Always ensure any existing chart is destroyed first
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    
    // Create new chart only if the ref is available
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Ăn uống & Cafe', 'Di chuyển', 'Giải trí & Mua sắm', 'Hóa đơn', 'Tiết kiệm (Heo Đất)'],
          datasets: [{
            label: 'Phân bổ Chi tiêu',
            data: [35, 15, 20, 10, 20],
            backgroundColor: [
              '#F59E0B',
              '#3B82F6',
              '#EC4899',
              '#6366F1',
              '#10B981'
            ],
            borderColor: '#f8fafc',
            borderWidth: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: {
                  size: 11
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null) {
                    label += context.parsed + '%';
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Phân tích Chi tiêu Mẫu</h2>
      <p className="text-sm text-slate-500 mb-4">FinGenie giúp bạn trực quan hóa chi tiêu. Dưới đây là biểu đồ mẫu về phân bổ chi tiêu hàng tháng.</p>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      <p className="text-xs text-slate-400 text-center mt-4">Biểu đồ này được vẽ bằng Chart.js, minh họa cho tính năng thống kê của MVP.</p>
    </div>
  );
}

export default SpendingChart;
