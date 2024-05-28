function AdPostPage() {
    return (
      <section className="bg-white p-4 rounded-lg shadow tb:ml-[100px] tb:w-[370px] tbbb:ml-[120px] tbbb:w-[470px] tbb:ml-[150px] tbb:w-[500px] md:ml-[170px] mdc:ml-[120px] mdc:w-[580px] mdd:ml-[240px] mddd:ml-[120px] lgg:ml-[200px] md:w-[500px] mdd:w-[650px] mddd:w-[610px] lgg:w-[650px] lggg:w-[900px] mb-10">
        <div className="grid grid-cols-1 mdc:grid-cols-2 lggg:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-lg relative w-[260px] sbb:w-[320px] mdc:w-[280px] tbbb:ml-12 mdc:ml-0">
            <img
              src="/Images/Ai.jpg"
              alt="Advertisement"
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <p className="text-sm font-bold text-gray-500 mr-2">Description</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default AdPostPage;
  