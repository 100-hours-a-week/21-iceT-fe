import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface IStudyStat {
  categoryId: number;
  categoryName: string;
  correctRate: number;
}

interface ITotalStudyCardProps {
  studyStats: IStudyStat[];
}

const RadarChart = ({ studyStats }: ITotalStudyCardProps) => {
  const data: ChartData<'radar'> = {
    labels: studyStats.map(stat => stat.categoryName),
    datasets: [
      {
        label: '정답률 (%)',
        data: studyStats.map(stat => stat.correctRate),
        backgroundColor: 'rgba(59, 130, 246, 0.4)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          display: false,
          stepSize: 20,
          color: '#9CA3AF',
        },
        angleLines: { color: '#E5E7EB' },
        grid: { color: '#E5E7EB' },
        pointLabels: { color: '#4B5563' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.label}: ${ctx.parsed.r}%`,
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;
