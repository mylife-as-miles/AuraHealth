import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    color?: 'primary' | 'secondary' | 'accent' | 'cyan';
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, color = 'secondary' }: EmptyStateProps) {
    const getColorBase = () => {
        switch (color) {
            case 'secondary': return 'text-secondary bg-secondary/10 border-secondary/20';
            case 'accent': return 'text-accent bg-accent/10 border-accent/20';
            case 'cyan': return 'text-cyan bg-cyan/10 border-cyan/20';
            default: return 'text-primary dark:text-gray-200 bg-gray-100 dark:bg-white/5 border-gray-200';
        }
    };

    const getButtonColor = () => {
        switch (color) {
            case 'secondary': return 'bg-secondary text-primary hover:bg-secondary/90';
            case 'accent': return 'bg-accent text-white hover:bg-accent/90';
            case 'cyan': return 'bg-cyan text-primary hover:bg-cyan/90';
            default: return 'bg-primary text-white hover:bg-primary/90';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-2 relative group ${getColorBase()}`}>
                <Icon strokeWidth={1.5} className="w-10 h-10 transition-transform duration-500 group-hover:scale-110" />

                {/* Floating particles animation */}
                <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-current opacity-50 animate-[ping_3s_infinite]"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-current opacity-30 animate-pulse"></div>
            </div>

            <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 ${getButtonColor()}`}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
