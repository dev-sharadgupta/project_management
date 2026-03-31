import TaskChart from "../dashboard/components/TaskChart";
import UpcomingTask from "../dashboard/components/UpcomingTask";
import API from "@/lib/axios";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import type { TaskType } from "@/types/task";


const Overview = () => {
  const { selectedProject } = useAppSelector(state => state.project);
  // Task
  const [tasks, setTasks] = useState<Record<string, TaskType[]>>({});

  /*************** Start - Get The Project Tasks ******************/
  const getProjectTasks = async (projectId: number) => {
    try {
      const response = await API.get('get_projectsTasks', {
        params: { project_id: projectId }
      });

      if (response.data.success && typeof response.data.tasks === 'object') {
        setTasks(response.data.tasks);
      }
    } catch {
      toast.error('Failed to fetch projects tasks');
    }
  }
  /*************** Start - Get The Project Tasks ******************/


  useEffect(() => {
    if (selectedProject?.project_id) {
      getProjectTasks(selectedProject.project_id);
    }
  }, [selectedProject?.project_id])


  return (
    <div className="flex flex-col lg:flex-row py-6 px-0 md:px-6 gap-6">
      <div className="xl:w-full lg:w-fit">
        <TaskChart data={tasks} />
      </div>
      <div className="xl:w-full lg:w-fit ">
        <UpcomingTask data={tasks} />
      </div>
    </div>
  )
}

export default Overview
