import { Chart, Legend } from "./../node_modules/highcharts/highcharts.d";
import { IChartSeriesPoint, ITransactionData } from "./types";

const getCHartsOptions = (
  categories: string[],
  seriesData: IChartSeriesPoint[],
  chartType: ChartTypes = "column",
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
      height: 250,
      backgroundColor: "transparent",
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
    ]

  };
};
const fetchTransactionsList = (List: ITransactionData[]) => {
  // Build date-aware chart data and ignore entries with invalid/missing dates
  const chartData = List
    .map((t: ITransactionData) => {
      if (!t.date) return null;
      const dateObj = t.date instanceof Date ? t.date : new Date(t.date as any);
      if (isNaN(dateObj.getTime())) return null;
      return {
        x: dateObj,
        y: Number(t.amount),
        type: t.transactionType,
        icon: t.emoji,
        category: t.category,
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
