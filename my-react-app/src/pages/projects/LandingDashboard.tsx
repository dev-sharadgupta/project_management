import { MainSidebar } from '@/components/navigation/MainSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { store } from '@/store/index'
import { Provider } from 'react-redux'
import HeadComponent from './components/LandingHead'
import LandingOutlet from './components/LandingOutlet'

import { useSearchParams } from 'react-router'

const LandingDashboard = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || "main_dashboard";

    return (
        <Provider store={store}>
            <SidebarProvider>
                {/* Add the Sidebar Trigger for Mobile View */}
                <div className="fixed top-3 left-4 z-50 md:hidden">
                    <SidebarTrigger className="w-10 h-10 shadow-lg shadow-gray-300  hover:bg-gray-200" />
                </div>

                {/* Add Main Sidebar */}
                <MainSidebar />

                {/* Main Content */}
                {/*  flex flex-col overflow-x-hidden */}
                <main className="flex-1">

                    {/* Header */}
                    <HeadComponent />

                    {/* Main Outlet */}
                    <LandingOutlet page={page} />

                </main>
            </SidebarProvider>
        </Provider>
    )
}

export default LandingDashboard
