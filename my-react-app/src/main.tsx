/* Import React Router */
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import { createRoot } from 'react-dom/client'

/* Import Index.css for styling */
import './index.css'

/* Import the Main Dashboard */
import LandingDashboard from "./pages/projects/LandingDashboard.tsx";

import ProjectDashboard from "./pages/dashboard/index.tsx";

import Overview from "./pages/overview/Overview.tsx";
import Notes from "./pages/notes/index.tsx";
import Meetings from "./pages/meetings/Meetings.tsx";
import Reports from "./pages/reports/Reports.tsx";
import Settings from "./pages/settings/Settings.tsx";
import Tasks from "./pages/tasks/Tasks.tsx";
import Targets from "./pages/targets/Targets.tsx"
import { Toaster } from "./components/ui/sonner.tsx";
import LandingTask from "./pages/projects/MainTask.tsx";

const router = createBrowserRouter([

  {
    path: "/",
    element: <LandingDashboard />,
  },
  {
    path: "/main_dashboard",
    element: <LandingDashboard />,
  },
  {
    path: "/main_tasks",
    element: <LandingTask />,
  },
  {
    path: "/dashboard",
    element: <ProjectDashboard />,
  },
  {
    path: "/overview",
    element: <Overview />
  },
  {
    path: "/targets",
    element: <Targets />,
  },
  {
    path: "/tasks",
    element: <Tasks />,
  },
  {
    path: "/notes",
    element: <Notes />,
  },
  {
    path: "/meetings",
    element: <Meetings />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);


const root = document.getElementById("root");
createRoot(root!).render(
  <>
    <RouterProvider router={router} />

    <Toaster position="top-right" richColors closeButton /> {/* ✅ Global toast */}
  </>
);

