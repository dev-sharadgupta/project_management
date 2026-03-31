const avatarColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
];

export const getRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
};


export const tagColors: Record<number, string> = {
    1: 'bg-red-100 text-red-800 border-red-200',
    2: 'bg-blue-100 text-blue-800 border-blue-200',
    3: 'bg-green-100 text-green-800 border-green-200',
    4: 'bg-purple-100 text-purple-800 border-purple-200',
    5: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    6: 'bg-orange-100 text-orange-800 border-orange-200',
    7: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    8: 'bg-pink-100 text-pink-800 border-pink-200',
    9: 'bg-gray-100 text-gray-800 border-gray-200',
    10: 'bg-cyan-100 text-gray-800 border-cyan-200',
};


export const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
};


export const taskChartColor: Record<number, string> = {
    "1": "#f59e0b",
    "2": "#3b82f6",
    "3": "#22c55e",
    "4": "#ef4444"
};


export const taskPriorityBorderClassMap: Record<number, string> = {
    1: "hover:border-l-gray-400",
    2: "hover:border-l-yellow-400",
    3: "hover:border-l-red-400",
};
