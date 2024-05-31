import Navbar from "./Navbar";
import Header from "./Header";
import RightBar from "./Rightbar";
import { ReactNode } from "react";

interface LayoutPageProps {
  children: ReactNode;
  showRightBar?: boolean;
}

function Layoutpage({ children, showRightBar = true }: LayoutPageProps) {
  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      <div className="flex-1">
        <Header />
        <main className="pt-[130px] tb:pl-1 md:pl-20">{children}</main>
      </div>
      {showRightBar && <RightBar />}
    </div>
  );
}
export default Layoutpage;
