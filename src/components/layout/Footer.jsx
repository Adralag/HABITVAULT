import Logo from '../ui/Logo';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Logo className="h-8 w-auto" light />
              <span className="ml-2 text-lg font-bold text-white font-poppins">HabitVault</span>
            </div>
            <p className="mt-4 text-sm text-gray-300 max-w-md">
              A privacy-first habit tracking app that helps users build consistent routines while maintaining complete data privacy through end-to-end encryption.
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-300">&copy; {year} HabitVault. All rights reserved.</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#features" className="text-sm text-gray-300 hover:text-accent">Features</a>
              </li>
              <li>
                <a href="#security" className="text-sm text-gray-300 hover:text-accent">Security</a>
              </li>
              <li>
                <a href="#about" className="text-sm text-gray-300 hover:text-accent">About</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/privacy" className="text-sm text-gray-300 hover:text-accent">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-gray-300 hover:text-accent">Terms of Service</a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-300 hover:text-accent">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;