import Overview from '@/pages/overview/Overview'
import Targets from '@/pages/targets/Targets';
import Tasks from '@/pages/tasks/Tasks';
import Notes from '@/pages/notes';
import React from 'react'
import Meetings from '@/pages/meetings/Meetings';
import Reports from '@/pages/reports/Reports';
import Settings from '@/pages/settings/Settings';

type OutletProps = { page: string };
const Outlet: React.FC<OutletProps> = ({ page }) => {
    let content;

    switch (page) {
        case 'overview':
            content = <Overview />
            break;
        case 'targets':
            content = <Targets />
            break;
        case 'tasks':
            content = <Tasks />
            break;
        case 'notes':
            content = <Notes />
            break;
        case 'meetings':
            content = <Meetings />
            break;
        case 'reports':
            content = <Reports />
            break;
        case 'settings':
            content = <Settings />
            break;
        default:
            content = <Overview />
    }
    return (
        <div>
            {content}
        </div>
    )
}

export default Outlet;
