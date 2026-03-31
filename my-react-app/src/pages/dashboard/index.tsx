import Header from '@/pages/dashboard/components/Header';
import { useSearchParams } from 'react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import Outlet from './components/Outlet';
import { Provider } from 'react-redux';
import { store } from '@/store/index';
import DashboardHead from './components/DasboardHead';

const ProjectDashboard = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "overview";

  return (
    <>
      <Provider store={store}>
        <SidebarProvider>
          <div className="fixed top-17 left-6 z-50 md:hidden"> {/* visible only on mobile */}
            <SidebarTrigger className="w-10 h-10 shadow-lg shadow-gray-300  hover:bg-gray-200" />
          </div>
          <AppSidebar />
          <main className="flex-1 text-left">
            <DashboardHead />
            <div className="w-full px-4 md:px-6 py-1">
              <Header />
            </div>
            <Outlet page={page} />
          </main>
        </SidebarProvider>
      </Provider>
    </>
  );
};
export default ProjectDashboard;
