
import UserProfileDetailsPage from "../_components/UserProfileDetailsPage";

export default function UserPage({ params }) {
  
 
  return (
    <div>
     <UserProfileDetailsPage userId={params.userId}/>
    </div>
  );
}