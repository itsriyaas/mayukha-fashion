import { Link } from "react-router-dom";

function UnauthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
      {/* Red Cross Icon */}
      <div className="bg-red-600 rounded-full w-20 h-20 flex items-center justify-center mb-6">
        <span className="text-white text-5xl">×</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>

      {/* Message */}
      <p className="text-gray-600 mb-2">
        You do not have permission to view this page.
      </p>
      <p className="text-gray-600 mb-6">
        Please check your credentials and try again.
      </p>

      {/* Error Code */}
      <p className="text-sm text-gray-500">Error Code: 403</p>
       <Link to={"/shop/home"}><button type="button" class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Back to Home</button></Link>
    </div>
  );
}

export default UnauthPage;
