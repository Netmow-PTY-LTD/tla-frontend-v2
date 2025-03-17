import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const MyStatsPage = () => {
  return (
    <div>
      <h1 className="font-bold text-2xl ">Overview of Your Stats</h1>

      <div>
        <div className="w-1/3">
          <Card>
            <CardHeader>
              <figure>
                <Image
                  src={"/assets/img/auth-step1.png"}
                  alt="Profiles"
                  height={80}
                  width={80}
                  className="rounded-full"
                />
              </figure>
              <CardTitle>Hossain Mishu</CardTitle>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                <p> Phone: (480) 123456789 Verified</p>
                <p> Email: yourmail@example.com</p>
                <p> Address: Cedar Boulevard, Lakeside, Florida 32123</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <CardTitle>About Description</CardTitle>
                <p>
                  If you're facing a divorce, it's crucial to seek professional
                  legal advice. Our consultations cover everything from asset
                  division to child custody arrangements, ensuring you
                  understand your rights and options.
                </p>
              </div>
              <div>
                <CardTitle>Professional Details</CardTitle>
                <p>Company Name: Netmow Au</p>
                <p>Company Address: 2464 Royal Ln. Mesa, New Jersey 45463</p>
                <p>Website URL: www.netmow.com.au</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-1/3"></div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
};

export default MyStatsPage;
