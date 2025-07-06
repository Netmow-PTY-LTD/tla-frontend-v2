import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const ResponseStatsCard = () => {
    return (
        <Card className="w-full  shadow-sm rounded-2xl">
            <div className="flex flex-row items-center justify-between  p-2">
                <div className="text-lg font-semibold">Responses</div>
                <Link href={'/lawyer/dashboard/my-responses'}>
                    <Button variant="outline" size="sm">
                        View
                    </Button>
                </Link>
            </div>
            <hr className="border-t border-[#D9D9D9] " />
            <div className="h-full flex-1 flex items-center justify-center">
                <p className="text-4xl font-bold">20</p>
            </div>
        </Card>
    );
};

export default ResponseStatsCard;
