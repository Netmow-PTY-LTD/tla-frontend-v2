import Image from "next/image";

export default function HeroShowcase() {
  return (
    <div className="hero-showcase">
      <div className="flex flex-wrap">
        <div className="w-full md:w-2/12 relative mt-20">
          <div className="w-full mb-8">
            <Image
              src={"/assets/img/showcase-1.png"}
              width={275}
              height={310}
              className="w-full showcase-img"
              alt="Showcase"
            />
          </div>
          <div className="w-full">
            <Image
              src={"/assets/img/showcase-2.png"}
              width={275}
              height={310}
              className="w-full showcase-img"
              alt="Showcase"
            />
          </div>
          <div className="showcase-gradient-overlay left-0"></div>
        </div>
        <div className="w-full md:w-8/12 md:px-5 my-8 md:my-0 md:">
          <Image
            src={"/assets/img/showcase-main.png"}
            width={1190}
            height={576}
            className="rounded-lg showcase-main"
            alt="Showcase"
          />
        </div>
        <div className="w-full md:w-2/12 relative mt-20">
          <div className="w-full mb-8">
            <Image
              src={"/assets/img/showcase-3.png"}
              width={275}
              height={310}
              className="w-full showcase-img"
              alt="Showcase"
            />
          </div>
          <div className="w-full">
            <Image
              src={"/assets/img/showcase-4.png"}
              width={275}
              height={310}
              className="w-full showcase-img"
              alt="Showcase"
            />
          </div>
          <div className="showcase-gradient-overlay right-0"></div>
        </div>
      </div>
    </div>
  );
}
