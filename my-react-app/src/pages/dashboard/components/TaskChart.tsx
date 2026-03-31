import React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { Button } from "@/components/ui/button";
import { taskChartColor } from "@/lib/customHelper";
import { useNavigate } from "react-router";
import type { TaskType } from "@/types/task";


interface TaskChartProps {
    data: Record<string, TaskType[]>;
}

export default function TaskChart({ data }: TaskChartProps) {
    const navigate = useNavigate();

    const allTasks = Object.values(data).flat(); /* Get Flat all task */


    /* ###########    CHART DATA- START ############ */
    type ChartItem = {
        statusId: number;
        statusName: string;
        statusData: number;
        fill: any;
    };


    // Overdue Task
    const overdueTasks = allTasks.filter(task => {
        const dueDate = task.due_date;
        const isCompleted = task.status_id == 3;

        return (
            dueDate &&
            !isCompleted &&
            new Date(dueDate) < new Date()
        );
    });

    const overdueCount = overdueTasks.length;

    const chartData: ChartItem[] = [];

    // Track counts for non-overdue tasks by status
    const statusMap = new Map<number, ChartItem>();

    // Set the Chart data status wise
    allTasks.forEach(task => {
        const isCompleted = task.status_id === 3;
        const isOverdue = task.due_date && !isCompleted && new Date(task.due_date) < new Date();

        if (isOverdue) return; // Skip overdue for now

        const key = task.status_id;
        const status_name = task.status_name;

        if (!statusMap.has(key)) {
            statusMap.set(key, {
                statusId: key,
                statusName: status_name,
                statusData: 1,
                fill: taskChartColor[key] || "#6b7280"
            });
        } else {
            statusMap.get(key)!.statusData += 1;
        }
    });

    // Add non-overdue status groups
    chartData.push(...Array.from(statusMap.values()));

    // Add overdue slice at end
    if (overdueCount > 0) {
        chartData.push({
            statusId: -1,
            statusName: "Overdue",
            statusData: overdueCount,
            fill: "#ef4444"
        });
    }


    const chartConfig: ChartConfig = chartData.reduce((config, item) => {
        config[item.statusId] = {
            label: item.statusName,
            color: item.fill,
        };
        return config;
    }, {} as ChartConfig);


    // Total Task
    const totalTask = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.statusData, 0)
    }, [chartData])
    /* ###########    CHART DATA - END ############ */

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex justify-between items-center">
                <div className="flex-col">
                    <CardTitle className="text-lg">Tasks Summary</CardTitle>
                    <CardDescription className="text-gray-400 font-medium text-[14px]"> {overdueCount} Overdue Task{overdueCount !== 1 ? "s" : ""}</CardDescription>
                </div>
                <div className="flex">
                    <Button variant="default" className="bg-gray-100 hover:bg-gray-200 text-[#363b35] text-xs cursor-pointer py-0"
                        onClick={() => navigate(`/dashboard?page=tasks`)}
                    >View Tasks</Button>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col lg:flex-row items-center px-2">
                <div className="flex items-center w-56 h-88 relative outline-none focus:outline-none [&_*]:outline-none [&_*:focus]:outline-none">
                    <ChartContainer
                        config={chartConfig}
                        className="w-full h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="statusData"
                                nameKey="statusName"
                                innerRadius={70}
                                outerRadius={100}
                                // strokeWidth={5}
                                paddingAngle={1}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalTask.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Tasks
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>
                <div className="w-3/4 ml-10 space-y-2 text-sm font-semibold text-gray-400">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex justify-between w-full gap-5">
                            <span className="flex items-center justify-start gap-5">
                                <span className="w-2 h-1 rounded-full" style={{ backgroundColor: item.fill }} />
                                {item.statusName}
                            </span>
                            <span className=" text-gray-600 font-bold text-base w-1/4 text-center">{item.statusData}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total task
                </div>
            </CardFooter> */}
        </Card >
    )
}