import { Chart, Legend } from "./../node_modules/highcharts/highcharts.d";
import { IChartSeriesPoint, ITransactionData } from "./types";

const getCHartsOptions = (
  categories: string[],
  seriesData: IChartSeriesPoint[],
  chartType: ChartTypes = "column",
  height = 250,
): Highcharts.Options => {
  return {
    title: {
      text: "",
    },
    xAxis: {
      type: "category",
      categories,
    },
    credits: {
      enabled: false,
    },
    chart: {
      height,
      backgroundColor: "transparent",
      spacing: [10, 10, 15, 10],
    },
    legend: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: "",
      },
    },
    tooltip: {
  useHTML: true,
  shared: true, // MUST have this to use this.points
  shadow: false,
  backgroundColor: "transparent",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter: function (this: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const point: any = this.points?.[0];
    if (!point) return "";

    const { type, tCategory, y, icon } = point.point;
    const dataLabel = categories[point.x]; // safer than this.x
    const textClass = type === "Income" ? "text-green-500" : "text-red-500";

    return `
      <div class="p-2 border shadow rounded-md flex flex-col items-center justify-start">
      <div class="flex w-full justify-between">
        <span>Dare:</span>
        <span>${dataLabel}</span>
      </div>  
      <div class="flex w-full justify-between">
        <span>Amount:</span>
        <span class="${textClass}">${y}</span>
      </div>  
      <div class="flex w-full justify-between">
        <span>Category:</span>
        <span>${tCategory}</span>
      </div>  
      
    `;
  },
},

    plotOptions: {
        column: {
            borderRadius: 8,
        },

    },
    series : [
        {
            type: chartType,
            data: seriesData,
            color : "#8271fe",
        }
    ],
    responsive: {
      rules: [{
        condition: { maxWidth: 480 },
        chartOptions: { chart: { height: Math.max(220, Math.round(height * 0.8)) } }
      }]
    }

  };
};
const fetchTransactionsList = (List: ITransactionData[]) => {
  // Build date-aware chart data and ignore entries with invalid/missing dates.
  // Be permissive: accept Date objects, ISO strings, or fall back to createdAt if available.
  const chartData = List
    .map((t: ITransactionData) => {
      // try transaction date, fallback to createdAt if present
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawDateCandidate: any = (t as any).date ?? (t as any).createdAt ?? null;
      if (!rawDateCandidate) return null;
      const dateObj = rawDateCandidate instanceof Date ? rawDateCandidate : new Date(rawDateCandidate as any);
      if (isNaN(dateObj.getTime())) return null;

      // parse amount robustly (strip non-number characters)
      const amountNum = Number(String(t.amount || "").replace(/[^0-9.-]+/g, ""));
      if (Number.isNaN(amountNum)) return null;

      return {
        x: dateObj,
        y: amountNum,
        type: t.transactionType ?? "",
        icon: t.emoji ?? "",
        category: t.category ?? "",
      };
    })
    .filter((p): p is { x: Date; y: number; type?: string; icon?: string; category?: string } => p !== null);

  if (!chartData.length) {
    return { newSeriesData: [], newCategories: [] };
  }

  const sortedByDate = chartData.sort((a, b) => a.x.getTime() - b.x.getTime());

  const newSeriesData = sortedByDate.map((point, index: number) => {
    const { y, type, icon, category } = point;

    return {
      x: index,
      y,
      type,
      icon,
      tCategory: category,
      rawDate: point.x,
    };
  });

  const newCategories = sortedByDate.map((p) =>
    p.x.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  );

  return {
    newSeriesData,
    newCategories,
  };
};
export { getCHartsOptions, fetchTransactionsList };
