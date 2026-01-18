import ProfileHeader from "../components/Profile/ProfileHeader";
import Stats from "../components/Profile/Stats";
import Maintenance from "../components/Maintenance/MaintenanceCard";
import Garage from "../components/Profile/Garage";


const Profile = () => {
    return (
        <div className="profile-wrapper">
            <div className="ui-panel">
                <ProfileHeader />
            </div>

            <div className="ui-panel">
                <Stats />
            </div>

            <div className="ui-panel">
                <Garage />
            </div>

            <div className="ui-panel">
                <Maintenance
                    showTitle={true}
                    showActionButton={true}
                />
            </div>
        </div>

    );
};

export default Profile;