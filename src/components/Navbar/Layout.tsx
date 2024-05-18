import Navbar from "./Navbar";
import Header from "./Header";
import RightBar from "./Rightbar";
import { ReactNode } from "react";

function Layoutpage({ children }: {children: ReactNode}){
 
    return (
        <div className="flex flex-col md:flex-row">
          <Navbar />
          <div className="flex-1">
            <Header />
            <main className="pt-32 tb:pl-1 md:pl-20  ">{children}</main>
          </div>
          <RightBar/>
        </div>
      );
}
export default Layoutpage;