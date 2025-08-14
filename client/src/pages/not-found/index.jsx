import { Link } from "react-router-dom";

function NotFound() {
  return <>
  <div class="flex items-center justify-center h-screen">
  <p className="me-3">404 PAGE NOT FOUND</p>
  <Link to={"/shop/home"}><button type="button" class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Back to Home</button></Link>
</div>
  
  </>;
}

export default NotFound;
