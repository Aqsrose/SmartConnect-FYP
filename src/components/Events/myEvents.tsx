
import { Edit2,ArrowUpRight } from 'lucide-react';

function MyEventsPage(){
    return(
        <section className="bg-white p-4 rounded-lg shadow tb:ml-[100px] tb:w-[370px] tbbb:ml-[120px] tbbb:w-[470px] tbb:ml-[150px] tbb:w-[500px] md:ml-[170px] mdc:ml-[120px] mdc:w-[580px] mdd:ml-[240px] mddd:ml-[120px] lgg:ml-[200px] md:w-[500px]  mdd:w-[650px] mddd:w-[610px] lgg:w-[650px] lggg:w-[900px] mb-10">
        <h2 className="text-1xl font-semibold text-[#EC74A2] mb-4">My Events</h2>
        <div className="grid grid-cols-1 mdc:grid-cols-2 lggg:grid-cols-3 gap-4 ">
           
        <div  className="p-4 bg-white rounded-lg shadow-lg relative w-[260px] sbb:w-[320px] mdc:w-[280px] tbbb:ml-12 mdc:ml-0">
                <img src="images/party.jpeg" className="w-full h-40 object-cover rounded-t-lg" />
                <div className="p-4">
                <p className="text-sm font-bold text-gray-200">Thursday, 9 Pm </p>
                  <h3 className="text-lg font-bold">Event 1</h3>
                  <p className="text-gray-600">party party party party party party</p>
                  <div className="mt-4 flex items-center justify-between">
                    <button className='bg-gradient-to-r from-red-500 to-purple-500 hover:from-purple-500 hover:to-red-500 text-white px-4 py-2 rounded flex items-center transition duration-200'>
                   Delete
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="bg-green-500 text-white p-2 rounded-full">
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                   </div>
                  </div>
                </div>
              </div>

              <div  className="p-4 bg-white rounded-lg shadow-lg relative w-[320px] mdc:w-[280px] tbbb:ml-12 mdc:ml-0">
                <img src="images/party.jpeg" className="w-full h-40 object-cover rounded-t-lg" />
                <div className="p-4">
                <p className="text-sm font-bold text-gray-200">Thursday, 9 Pm </p>
                  <h3 className="text-lg font-bold">Event 1</h3>
                  <p className="text-gray-600">party party party party party party</p>
                  <div className="mt-4 flex items-center justify-between">
                    <button className='bg-gradient-to-r from-red-500 to-purple-500 hover:from-purple-500 hover:to-red-500 text-white px-4 py-2 rounded flex items-center transition duration-200'>
                    Delete
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="bg-green-500 text-white p-2 rounded-full">
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                   </div>
                  </div>
                </div>
              </div>

              <div  className="p-4 bg-white rounded-lg shadow-lg relative w-[320px] mdc:w-[280px] tbbb:ml-12 mdc:ml-0">
                <img src="images/party.jpeg" className="w-full h-40 object-cover rounded-t-lg" />
                <div className="p-4">
                <p className="text-sm font-bold text-gray-200">Thursday, 9 Pm </p>
                  <h3 className="text-lg font-bold">Event 1</h3>
                  <p className="text-gray-600">party party party party party party</p>
                  <div className="mt-4 flex items-center justify-between">
                    <button className='bg-gradient-to-r from-red-500 to-purple-500 hover:from-purple-500 hover:to-red-500 text-white px-4 py-2 rounded flex items-center transition duration-200'>
                    Delete
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="bg-green-500 text-white p-2 rounded-full">
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                   </div>
                  </div>
                </div>
              </div>

              </div>
    </section>
    )
}
export default MyEventsPage;