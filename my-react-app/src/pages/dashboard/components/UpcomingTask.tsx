import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { targetTypeColorMap, taskPriorityColorMap } from '@/lib/badgeColor';
import { taskPriorityBorderClassMap } from '@/lib/customHelper';
import type { TaskType } from '@/types/task';
import { getPriorityIcon } from '@/utils/getPriorityIcon';
import { getTaskTypeIcon } from '@/utils/getTargetTypeIcon';
import { ArrowLeft, ArrowRight, CalendarX, PartyPopper } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

type DayInfo = {
    label: string;      // Short weekday label (e.g., 'Mon', 'Tue')
    date: number;       // Day of month (e.g., 27)
    fullDate: string;   // Full readable date (e.g., "Tue May 28 2025")
    isToday: boolean;   // Is this day today?
};

const getWeekDates = (offset: number = 0): DayInfo[] => {
    const today = new Date();
    const result: DayInfo[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i + offset);
        result.push({
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate(),
            fullDate: date.toDateString(),
            isToday: date.toDateString() === new Date().toDateString(),
        });
    }

    return result;
};

interface UpcomingTaskProps {
    data: Record<string, TaskType[]>;
}

function UpcomingTask({ data }: UpcomingTaskProps) {

    const navigate = useNavigate();
    const [offset, setOffset] = useState<number>(0);
    const [activeDate, setActiveDate] = useState<string>(new Date().toDateString());

    const weekDates = getWeekDates(offset);

    const allTasks: TaskType[] = Object.values(data).flat();

    // Set Event
    const events = allTasks.filter(task => {
        const start = task.start_date ? new Date(task.start_date).toDateString() : '';
        const isYetToStart = task.status_id === 1;
        return start === activeDate && isYetToStart;
    }).sort((a, b) => (b.priority_id ?? 0) - (a.priority_id ?? 0));

    const totalTask = events.length;
    const visibleEvents = events.slice(0, 3);

    return (
        <Card className="h-full">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <h5>Upcoming Task</h5>
                    <p className="text-sm font-semibold text-gray-400">
                        {totalTask !== 0
                            ? `${totalTask} Task${totalTask !== 1 ? "s" : ""} in the queue`
                            : "No Task"}
                    </p>
                </div>
                {visibleEvents.length > 0 && (
                    <Button color='gray' size="md" fontSize="xs"
                        onClick={() => navigate(`/dashboard?page=tasks&date=${encodeURIComponent(activeDate)}`)}
                    >View All</Button>
                )}
            </CardHeader>
            <CardContent className="space-y-7">
                <div className='flex lg:flex-row items-center justify-between'>
                    <Button
                        onClick={() => setOffset(offset - 7)}
                        size="sm"
                        disabled={offset === 0}
                        className={offset === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    ><ArrowLeft /></Button>

                    <div className="flex gap-4">
                        {weekDates.map((day, i) => {
                            const isActive = day.fullDate === activeDate;

                            return (
                                <div
                                    key={i}
                                    onClick={() => setActiveDate(day.fullDate)}
                                    className={`
                                    flex flex-col items-center cursor-pointer py-3 rounded-full transition-colors font-bold text-xs
                                    ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 text-blue-600'}
                                `}
                                >
                                    <span className={`text-sm ${isActive ? 'text-white' : 'text-blue-400'}`}>
                                        {day.label}
                                    </span>
                                    <div
                                        className={`
                                        h-8 px-2.5 mt-1 flex items-center justify-center rounded-full
                                        ${isActive ? 'bg-blue-500 text-white' : 'bg-transparent hover:text-white'}
                                    `}
                                    >
                                        {day.date}
                                    </div>
                                </div>
                            );

                        })}
                    </div>

                    <Button onClick={() => setOffset(offset + 7)} size="sm"><ArrowRight /></Button>
                </div>
                <div className="space-y-4">
                    {visibleEvents.map((event, idx) => {
                        const hoverClass = taskPriorityBorderClassMap[event.priority_id ?? 0];

                        return (
                            <div
                                key={idx}
                                className={`
                                        flex justify-between items-center border-l-4 border-gray-200 pl-4 
                                        transition-colors duration-300 ${hoverClass}
                                    `}
                            >
                                <div className='space-x-2'>
                                    <Badge
                                        className={targetTypeColorMap[event.target_id ? "target" : "general"]}
                                        size="xs"
                                        fontSize="xs"
                                    >
                                        {getTaskTypeIcon(event.target_id ? "target" : "general")}
                                        {event.target_id ? 'Target' : 'General'}
                                    </Badge>
                                    <Badge
                                        className={taskPriorityColorMap[event.priority_id ?? 0]}
                                        size="xs"
                                        fontSize="xs"
                                    >
                                        {getPriorityIcon(String(event.priority_id))}
                                        {event.priority_name} Priority
                                    </Badge>
                                    <p className="font-medium">{event.title}</p>
                                    <p className="text-sm text-gray-400">
                                        <span className='font-semibold'>Due Date: </span>
                                        <span className="text-blue-500">{event.due_date}</span>
                                    </p>
                                </div>
                                <Button
                                    color='gray'
                                    fontSize="xs"
                                    size="sm"
                                    onClick={() => navigate(`/dashboard?page=tasks&task_id=${event.id}`)}
                                >
                                    View
                                </Button>
                            </div>
                        );
                    })}
                    {visibleEvents.length === 0 && (
                        <div className="flex flex-col justify-center items-center h-40 bg-gray-50 rounded-md text-gray-500 font-medium">
                            <CalendarX className="w-6 h-6 text-green-400 mb-2" />
                            <p className="text-base font-semibold">No tasks scheduled for this day</p>
                            <p className="flex items-center text-sm mt-1 text-gray-500">
                                Looks like you're all caught up
                                <PartyPopper className="w-4 h-4 text-yellow-500 ml-1" />
                            </p>
                            <p className="text-sm text-gray-400">Check the other dates</p>
                        </div>
                    )}
                </div>
            </CardContent>

        </Card>
    );
};

export default UpcomingTask;
