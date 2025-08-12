import { FaYoutube, FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1c222c] text-white py-10 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Logo & Description */}
        <div className="sm:col-span-2">
          {/* <img
            src="/logo.png"
            alt="Mahalekshmi Silks"
            className="w-40 mb-4"
          /> */}
          <img src="/logo.png" alt="footer_logo" width={'200'} />
          <p className="text-gray-300 text-sm leading-relaxed">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos expedita fuga odit, accusamus magnam, nulla minima blanditiis beatae voluptates vel natus nisi at? Commodi, maxime. Exercitationem soluta quos sequi minus.
          </p>
        </div>

        {/* About Us */}
        <div>
          <h4 className="font-semibold mb-3">About Us</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>About Us</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Privacy Policy */}
        <div>
          <h4 className="font-semibold mb-3">Privacy Policy</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Payment Policy</li>
            <li>Shipping Policy</li>
            <li>Return Policy</li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-semibold mb-3">Customer Care</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Help Center</li>
            <li>Track Your Order</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-semibold mb-3">Contact Us</h4>
          <p className="text-gray-300 text-sm">
            Muthoor Showroom <br />
            SH 1, Muthoor, Thiruvalla, Kerala 689107
          </p>
          <p className="text-gray-300 text-sm mt-2">
            Email: <a href="mailto:support@mahalekshmisilks.com" className="underline">support@mayukhafashionstore.com</a>
          </p>
          <p className="text-gray-300 text-sm mt-2">Phone: 0469 270 3030</p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-4">
            <a href="#"><FaYoutube className="text-lg hover:text-red-500" /></a>
            <a href="#"><FaFacebookF className="text-lg hover:text-blue-500" /></a>
            <a href="#"><FaInstagram className="text-lg hover:text-pink-500" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
        © 2025 Mayukha Fashion. All Rights Reserved. Developed by <a href="" target="_blank" className="hover:text-blue-500">Thea IT Solutions</a>.
      </div>
    </footer>
  );
}
