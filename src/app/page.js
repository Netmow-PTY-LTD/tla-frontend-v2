import Footer from "@/components/main/common/footer/Footer";
import Header from "@/components/main/common/header/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Welcome to The LawAppOnline</h1>
      </main>
      <Footer />
    </>
  );
}
