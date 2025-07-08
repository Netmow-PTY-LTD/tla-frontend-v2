import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const ResponseStatsCard = () => {
    return (
        <Card className="w-full shadow-sm rounded-2xl">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold">Responses</h2>
                <Link href="/lawyer/dashboard/my-responses">
                    <Button variant="outline" size="sm">
                        View
                    </Button>
                </Link>
            </div>

            <hr className="border-t border-[#D9D9D9]" />

            <div className="flex items-center justify-center h-[calc(100%-100px)]">
                <div className="flex items-center justify-center gap-6 p-4">
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 text-white">
                            <p className="text-3xl font-bold">40</p>
                        </div>
                        <span className="text-sm font-medium mt-1">Pending</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 text-white">
                            <p className="text-3xl font-bold">20</p>
                        </div>
                        <span className="text-sm font-medium mt-1">Hired</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 text-white">
                            <p className="text-3xl font-bold">10</p>
                        </div>
                        <span className="text-sm font-medium mt-1">Archived</span>
                    </div>
                </div>
            </div>

        </Card>
    );
};

export default ResponseStatsCard;
