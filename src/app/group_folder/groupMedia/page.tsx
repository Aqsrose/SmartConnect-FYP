
const GroupMedia = () => {
  return (
    <div className="absolute top-2 left-4 mb-6 border border-gray-100  w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[300px] tbbb:w-[400px] tbb:w-[500px] md:w-[470px] mdc:w-[550px] mddd:w-[550px] lg:w-[470px] lgg:w-[450px] lggg:w-[520px]">
      <div className="grid grid-cols-2 gap-1 mdc:ml-7 mdd:ml-0">
        {/* 1 */}
        <div className="flex-shrink-0 mddd:w-[270px] lgg:w-[220px] lggg:w-[260px] h-40 tbbb:h-60 bg-white rounded  border-2 border-[#003C43]">
          <img src="/Images/Aii.jpg" alt="Media" className="w-full h-full" />
        </div>

        {/* 2 */}
        <div className="flex-shrink-0 mddd:w-[270px] lgg:w-[220px] lggg:w-[260px] h-40 tbbb:h-60 bg-white rounded  border-2 border-[#003C43]">
          <img src="/Images/Aii.jpg" alt="Media" className="w-full h-full " />
        </div>

        {/* 3 */}
        <div className="flex-shrink-0 mddd:w-[270px] lgg:w-[220px] lggg:w-[260px] h-40 tbbb:h-60 bg-white rounded  border-2 border-[#003C43]">
          <img src="/Images/Aii.jpg" alt="Media" className="w-full h-full " />
        </div>

        {/* 4 */}
        <div className="flex-shrink-0 mddd:w-[270px] lgg:w-[220px] lggg:w-[260px] h-40 tbbb:h-60 bg-white rounded  border-2 border-[#003C43]">
          <img src="/Images/Aii.jpg" alt="Media" className="w-full h-full " />
        </div>
      </div>
    </div>
  );
};
export default GroupMedia;
