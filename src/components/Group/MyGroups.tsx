import { Edit2} from 'lucide-react';
import Link from "next/link"

type GroupProps = {
    id:string,
    name: string,
    description:string,
    isPublic:boolean,
  }
// function MyGroups({id, name, description, isPublic }: GroupProps) {
    function MyGroups() {
    return(
      <section className="bg-white p-4 rounded-lg shadow mb-6 tb:ml-[110px] md:ml-[170px] mdd:ml-[400px] md:w-[550px]  lggg:w-[900px] mt-2">
      <h2 className="text-1xl font-semibold text-green-500 mb-4 ">My Groups</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 ">
       
          <div className="bg-gray-50 p-4 rounded-lg shadow relative lggg:w-[400px] h-[140px]">
            <h3 className="text-xl font-semibold mb-2">BeautyProducts</h3>
            <p className="text-gray-600 mb-4">Your skin deserves the best</p>
            {/* {isPublic && (
            <Link href={`/groups/${id}`}>
            <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-4 py-2 rounded">
              View Group
            </button>
            </Link>
            )} */}
            
            <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-4 py-2 rounded">
              View Group
            </button>
            
            <div className="absolute top-2 right-2 flex space-x-2">
              <button className="text-purple-500 hover:text-blue-700">
                <Edit2 />
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow relative lggg:w-[400px] h-[140px]">
            <h3 className="text-xl font-semibold mb-2">AnimeWorld</h3>
            <p className="text-gray-600 mb-4">さよなら (Sayonara)</p>
            <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-4 py-2 rounded">
              View Group
            </button>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button className="text-purple-500 hover:text-blue-700">
                <Edit2 />
              </button>
            </div>  
          </div>
          {/* <div className="bg-gray-50 p-4 rounded-lg shadow relative lggg:w-[400px] h-[140px]">
            <h3 className="text-xl font-semibold mb-2">AnimeWorld</h3>
            <p className="text-gray-600 mb-4">さよなら (Sayonara)</p>
            <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-4 py-2 rounded">
              View Group
            </button>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button className="text-purple-500 hover:text-blue-700">
                <Edit2 />
              </button>
            </div>  
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow relative lggg:w-[400px] h-[140px]">
            <h3 className="text-xl font-semibold mb-2">AnimeWorld</h3>
            <p className="text-gray-600 mb-4">さよなら (Sayonara)</p>
            <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-4 py-2 rounded">
              View Group
            </button>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button className="text-purple-500 hover:text-blue-700">
                <Edit2 />
              </button>
            </div>  
          </div> */}
      
      </div>
    </section>

    );
}
export default MyGroups;