
import LawyerProfileDetailsPage from "../../_components/lawyer/LawyerProfileDetailsPage";


export default function UserPage({ params }) {
  
 
  return (
    <div>
     <LawyerProfileDetailsPage userId={params.userId}/>
    </div>
  );
}