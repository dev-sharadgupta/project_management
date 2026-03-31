import MainDashboard from './MainDashboard';
import MainTask from '../MainTask';

type OutletProps = { page: string };
const LandingOutlet: React.FC<OutletProps> = ({ page }) => {
    let content;

    switch (page) {
        case 'main_dashboard':
            content = <MainDashboard />
            break;
        case 'main_tasks':
            content = <MainTask />
            break;
        default:
            content = <MainDashboard />
    }
    return (
        <div>
            {content}
        </div>
    )
}

export default LandingOutlet;
