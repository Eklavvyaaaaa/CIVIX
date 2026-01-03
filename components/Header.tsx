
import React from 'react';
import { LogoIcon } from './icons';

interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="text-center p-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-center gap-3 mb-2">
                <LogoIcon className="h-10 w-10"/>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
            </div>
            <p className="text-md text-gray-500">{subtitle}</p>
        </header>
    );
};

export default Header;
