import { LineChart } from '@mui/x-charts/LineChart';
import { chartsTooltipClasses } from '@mui/x-charts';

export default function BasicLineChart({ settingsConfig, attendanceHistory = {} }) {
  function getAttendance() {
    var orderedAttendanceRate = [];
    try {
      for (const [key, value] of Object.entries(attendanceHistory)) {
        orderedAttendanceRate.push(value.length);
      }
    } catch (e) {
      console.error("Error fetching attendance history:", e);
      orderedAttendanceRate = [0, 0, 0, 0, 0, 0];
    }
    return orderedAttendanceRate;
  }

  function getMaxAttendance() {
    const attendanceRate = getAttendance();
    var maxValue = 0;
    for(let i = 0; i <= attendanceRate.length; i++) {
      if (attendanceRate[i] > maxValue) {
        maxValue = attendanceRate[i];
      }
    }
    if(maxValue < 10) {
      return 10;
    } else {
      return maxValue;
    }
  }
  return (
    <LineChart
      xAxis={[
        {
          scaleType: 'point',
          data: [
            'Comp. Org. & Arch.',
            'Discr. Math',
            'Fund. Prog.',
            'Prob. & Stats.',
            'RDBMS',
            'Religiosity',
          ],
        },
      ]}
      yAxis={[{ min: 0, max: getMaxAttendance() }]}
      series={[
        {
          data: getAttendance(),
          color: "#007AFF",
          showMark: true,
          curve: 'bumpX'
        },
      ]}
      grid={{ vertical: true, horizontal: true }}
      height={300}
      width={600}
      sx={{
        '& text': {
          fill: 'var(--color-text-pri) !important',
        },
        '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
          stroke: 'var(--color-text-sec) !important',
        },
        '& .MuiChartsGrid-line': {
          stroke: 'var(--color-border) !important',
        },
        [`& .${chartsTooltipClasses.paper}, &.${chartsTooltipClasses.root}`]: {
          color: 'var(--color-text-sec) !important',
          backgroundColor: settingsConfig.advancedVisual ? 'color-mix(in srgb, var(--color-primary) 20%, transparent) !important' : 'var(--color-primary) !important',
          backdropFilter: settingsConfig.advancedVisual ? "blur(8px)" : "none",
          border: "1px solid var(--color-border)",
          borderRadius: "8px !important",
          transition: "all 0.2s ease-in-out"
        },
        [`& .${chartsTooltipClasses.valueCell}`]: {
          color: 'var(--color-text-pri) !important',
        },
        [`& .${chartsTooltipClasses.cell}`]: {
          borderTop: "1px solid var(--color-border) !important",
        }
      }}
    />
  );
}

