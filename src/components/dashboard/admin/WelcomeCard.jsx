import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const WelcomeCard = ({ username, role }) => {
  return (
    <Card className="w-full bg-white shadow-sm rounded-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Welcome Back, {username}!
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* <p className="text-gray-600">
          You are logged in as an <span className="font-semibold">{role}</span>.
        </p> */}
        <p className="text-sm text-gray-500">
          Here’s a quick overview of your dashboard.
        </p>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
