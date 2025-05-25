import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white pt-12 pb-8 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/landing" className="inline-block mb-4">
              <span className="text-2xl font-bold text-blue-600">
                LEARN-X
              </span>
            </Link>
            <p className="text-gray-700 mb-4 max-w-xs">
              Transforming education with AI-powered personalized learning experiences.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Github size={20} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Mail size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {['Features', 'How It Works', 'For Students', 'For Educators', 'Resources'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {['Terms', 'Privacy', 'Cookies', 'Licenses', 'Settings'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Learn-X Learning, Inc. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 text-sm">
              Empowering education through AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
